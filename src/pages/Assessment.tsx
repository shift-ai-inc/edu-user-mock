import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Loader2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash-es"; // Lodash debounce for auto-save
import { aiAssessmentQuestions } from "@/data/aiAssessmentQuestions"; // Import AI questions

// アセスメントの質問タイプ
export type QuestionType = "single" | "multiple" | "rating" | "text" | "boolean";

// 質問オプション
export interface QuestionOption {
  id: number; // ユニークID (ランダム化しても追跡可能)
  text: string;
  // nextQuestionId?: number; // 適応型で使用する可能性
}

// 質問データ型
export interface Question {
  id: number; // ユニークID
  text: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  minRating?: number;
  maxRating?: number;
  difficulty?: number; // 適応型用 (例: 1=易, 2=中, 3=難)
  category?: string; // 質問カテゴリ (小カテゴリとして使用)
  majorCategory?: string; // 大カテゴリ
}

// アセスメントデータ型
export interface Assessment {
  id: number;
  title: string;
  description: string;
  estimatedTime: string; // 目安時間
  questions: Question[];
}

// 回答データ型
interface Answer {
  questionId: number;
  value: string | string[] | number | boolean | null | number[];
}

// ローカルストレージ保存用データ型
interface SavedAssessmentData {
  assessmentId: number;
  answers: Answer[];
  currentQuestionIndex: number;
  elapsedTime: number; // 秒単位
  questionOrder: number[]; // ランダム化された質問IDの順序
  savedAt: string;
  status?: string; // 完了ステータスなど（オプション）
}

// --- モックデータ生成 ---
const generateMockQuestions = (
  count: number,
  assessmentId: number
): Question[] => {
  const questions: Question[] = [];
  const categories = [
    "論理思考",
    "コミュニケーション",
    "問題解決",
    "協調性",
    "リーダーシップ",
  ];
  for (let i = 1; i <= count; i++) {
    const type: QuestionType = ["single", "rating", "boolean"][
      i % 3
    ] as QuestionType;
    const category = categories[i % categories.length];
    const question: Question = {
      id: i,
      text: `質問 ${i} (${assessmentId}): ${category}に関するあなたの考えは？ (${type})`,
      description:
        type === "rating"
          ? "1(全くそう思わない)から5(非常にそう思う)で評価してください。"
          : undefined,
      type: type,
      required: true,
      difficulty: (i % 3) + 1, // 1, 2, 3
      category: category,
      majorCategory: "総合", // Default major category for generic questions
    };

    if (type === "single" || type === "multiple") {
      question.options = [
        { id: 1, text: `選択肢 A (Q${i}-${assessmentId})` },
        { id: 2, text: `選択肢 B (Q${i}-${assessmentId})` },
        { id: 3, text: `選択肢 C (Q${i}-${assessmentId})` },
        { id: 4, text: `選択肢 D (Q${i}-${assessmentId})` },
      ];
    } else if (type === "rating") {
      question.minRating = 1;
      question.maxRating = 5;
    }
    questions.push(question);
  }
  return questions;
};

// --- 複数のモックアセスメントデータ ---
export const allMockAssessments: Assessment[] = [
  {
    id: 101, // アセスメントID
    title: "総合スキルアセスメント",
    description:
      "このアセスメントは、あなたの様々なスキルや特性を評価するためのものです。正直に回答してください。",
    estimatedTime: "約10分",
    questions: generateMockQuestions(10, 101), // 問題数を10に
  },
  {
    id: 102,
    title: "パーソナリティ診断",
    description: "あなたの性格特性や行動傾向を分析します。",
    estimatedTime: "約30分",
    questions: generateMockQuestions(80, 102),
  },
  {
    id: 103,
    title: "リーダーシップ適性検査",
    description: "リーダーとしての潜在能力やスタイルを評価します。",
    estimatedTime: "約45分",
    questions: generateMockQuestions(100, 103),
  },
  {
    id: 201, // New Assessment ID for AI Literacy
    title: "生成AIスキル・リテラシー評価",
    description: "生成AIに関するあなたのスキルとリテラシーを評価します。各項目について、1 (全くそう思わない) から 4 (非常にそう思う) の4段階で評価してください。",
    estimatedTime: "約15分",
    questions: aiAssessmentQuestions, // Use imported questions
  },
];
// --- モックデータここまで ---

// 配列をシャッフルするユーティリティ関数 (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function AssessmentPage() {
  // Change from "id" to "assessmentId" to match route definition in main.tsx
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ステート
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [submitInProgress, setSubmitInProgress] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // 秒単位
  const [questionOrder, setQuestionOrder] = useState<number[]>([]); // ランダム化された質問IDの順序
  const [isSaved, setIsSaved] = useState(false); // 保存状態フラグ

  // --- データ取得と初期化 ---
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        const assessmentIdNum = parseInt(assessmentId ?? "", 10); // URLから取得したIDを数値に変換

        if (isNaN(assessmentIdNum)) {
          throw new Error("Invalid Assessment ID");
        }

        // モックデータからIDで検索
        const fetchedAssessment = allMockAssessments.find(
          (a) => a.id === assessmentIdNum
        );

        if (!fetchedAssessment) {
          console.error(
            `Assessment with ID ${assessmentIdNum} not found in mock data.`
          );
          throw new Error(`Assessment with ID ${assessmentIdNum} not found`);
        }

        console.log(
          `Loading assessment: ID=${fetchedAssessment.id}, Title=${fetchedAssessment.title}`
        );
        setAssessment(fetchedAssessment);

        const storageKey = `assessment_${fetchedAssessment.id}`;
        const savedData = localStorage.getItem(storageKey);

        if (savedData) {
          const parsed: SavedAssessmentData = JSON.parse(savedData);
          if (parsed.assessmentId === fetchedAssessment.id) {
            setAnswers(parsed.answers || []);
            setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
            setElapsedTime(parsed.elapsedTime || 0);
            const initialQuestionOrder =
              parsed.questionOrder?.length > 0
                ? parsed.questionOrder
                : shuffleArray(fetchedAssessment.questions.map((q) => q.id));
            setQuestionOrder(initialQuestionOrder);
            setIsSaved(true);
            toast({ title: "中断した箇所から再開しました" });
          } else {
            console.warn(
              `Saved data for different assessment ID (${parsed.assessmentId}) found for key ${storageKey}. Starting fresh.`
            );
            localStorage.removeItem(storageKey);
            setQuestionOrder(
              shuffleArray(fetchedAssessment.questions.map((q) => q.id))
            );
            setAnswers([]);
            setCurrentQuestionIndex(0);
            setElapsedTime(0);
          }
        } else {
          console.log(
            `No saved data found for ${storageKey}. Starting new assessment.`
          );
          setQuestionOrder(
            shuffleArray(fetchedAssessment.questions.map((q) => q.id))
          );
          setAnswers([]);
          setCurrentQuestionIndex(0);
          setElapsedTime(0);
        }
      } catch (error) {
        console.error("アセスメントの取得または初期化に失敗しました", error);
        toast({
          title: "エラー",
          description: `アセスメントデータの読み込みに失敗しました。(${
            error instanceof Error ? error.message : "Unknown error"
          })`,
          variant: "destructive",
        });
        setAssessment(null);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId, toast, navigate]);

  // --- 時間計測 ---
  useEffect(() => {
    if (loading || submitInProgress || !assessment) return;

    const timer = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitInProgress, assessment]);

  // --- 自動保存 ---
  const debouncedSave = useCallback(
    debounce((dataToSave: SavedAssessmentData) => {
      if (!assessment) return;
      try {
        const storageKey = `assessment_${assessment.id}`;
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        setIsSaved(true);
        console.log(`Auto-saved to ${storageKey}:`, dataToSave);
      } catch (e) {
        console.error("自動保存に失敗:", e);
        toast({
          title: "自動保存エラー",
          description: "回答の自動保存に失敗しました。",
          variant: "destructive",
        });
      }
    }, 1500),
    [assessment, toast] // assessment と toast を依存配列に追加
  );

  useEffect(() => {
    if (loading || !assessment || questionOrder.length === 0) return;

    const dataToSave: SavedAssessmentData = {
      assessmentId: assessment.id,
      answers,
      currentQuestionIndex,
      elapsedTime,
      questionOrder,
      savedAt: new Date().toISOString(),
    };
    debouncedSave(dataToSave);

    return () => {
      debouncedSave.cancel();
    };
  }, [
    answers,
    currentQuestionIndex,
    elapsedTime,
    questionOrder,
    assessment,
    loading,
    debouncedSave,
  ]);

  // --- 現在の質問と進捗 ---
  const currentQuestionId = useMemo(
    () => questionOrder[currentQuestionIndex],
    [questionOrder, currentQuestionIndex]
  );
  const currentQuestion = useMemo(
    () => assessment?.questions.find((q) => q.id === currentQuestionId),
    [assessment, currentQuestionId]
  );
  const totalQuestions = useMemo(() => questionOrder.length, [questionOrder]);
  const remainingQuestions = useMemo(
    () => (totalQuestions > 0 ? totalQuestions - currentQuestionIndex - 1 : 0),
    [totalQuestions, currentQuestionIndex]
  );
  const progressPercentage = useMemo(
    () =>
      totalQuestions > 0
        ? ((currentQuestionIndex + 1) / totalQuestions) * 100
        : 0,
    [currentQuestionIndex, totalQuestions]
  );

  // --- 回答処理 ---
  const updateAnswer = useCallback(
    (value: Answer["value"]) => {
      if (!currentQuestion) return;
      setIsSaved(false);

      setAnswers((prevAnswers) => {
        const existingAnswerIndex = prevAnswers.findIndex(
          (a) => a.questionId === currentQuestion.id
        );
        const newAnswer: Answer = { questionId: currentQuestion.id, value };

        if (existingAnswerIndex >= 0) {
          const updatedAnswers = [...prevAnswers];
          updatedAnswers[existingAnswerIndex] = newAnswer;
          return updatedAnswers;
        } else {
          return [...prevAnswers, newAnswer];
        }
      });
    },
    [currentQuestion]
  );

  const getCurrentAnswer = useCallback((): Answer["value"] => {
    if (!currentQuestion) return null;
    const answer = answers.find((a) => a.questionId === currentQuestion.id);
    return answer ? answer.value : null;
  }, [answers, currentQuestion]);

  // --- ナビゲーション ---
  const handleNext = () => {
    if (!currentQuestion || !assessment) return;

    if (currentQuestion.required && getCurrentAnswer() === null) {
      toast({
        title: "入力エラー",
        description: "この質問は必須です。",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setSubmitDialogOpen(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // --- 提出処理 ---
  const handleSubmitAssessment = async () => {
    if (!assessment) return;
    setSubmitInProgress(true);
    toast({
      title: "送信中...",
      description: "アセスメント結果を送信しています。",
    });

    try {
      console.log("Submitting Assessment:", {
        assessmentId: assessment.id,
        answers,
        elapsedTime,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const storageKey = `assessment_${assessment.id}`;
      localStorage.removeItem(storageKey);
      console.log(`Removed item from local storage: ${storageKey}`);

      toast({
        title: "送信完了",
        description: "アセスメントが正常に送信されました。",
      });
      navigate(`/assessments/results/${assessment.id}`);
    } catch (error) {
      console.error("アセスメントの送信に失敗しました", error);
      toast({
        title: "送信エラー",
        description: "送信に失敗しました。後でもう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setSubmitInProgress(false);
      setSubmitDialogOpen(false);
    }
  };

  // --- 選択肢のランダム化 ---
  const shuffledOptions = useMemo(() => {
    if (currentQuestion?.options) {
      return shuffleArray(currentQuestion.options);
    }
    return [];
  }, [currentQuestion]);

  // --- レンダリング ---
  const renderQuestionInput = () => {
    if (!currentQuestion) return <p>質問を読み込み中...</p>;

    const currentValue = getCurrentAnswer();

    switch (currentQuestion.type) {
      case "single":
        return (
          <div className="space-y-3">
            {shuffledOptions.map((option) => {
              const isSelected = currentValue === option.id;
              return (
                <div
                  key={option.id}
                  className={`flex items-center p-3 border-2 rounded-md cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 font-medium"
                      : "border-input hover:border-primary/50 hover:bg-accent"
                  }`}
                  onClick={() => updateAnswer(option.id)}
                >
                  <div className="pl-2">{option.text}</div>
                </div>
              );
            })}
          </div>
        );

      case "multiple": {
        const currentValuesNum = (
          Array.isArray(currentValue) ? currentValue : []
        ) as number[];
        return (
          <div className="space-y-4">
            {shuffledOptions.map((option) => {
              const isChecked = currentValuesNum.includes(option.id);
              return (
                <div key={option.id} className="items-top flex space-x-2">
                  <Checkbox
                    id={`option-${currentQuestion.id}-${option.id}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const optionIdNum = option.id;
                      let updatedValues: number[];
                      if (checked) {
                        updatedValues = [...currentValuesNum, optionIdNum];
                      } else {
                        updatedValues = currentValuesNum.filter(
                          (id) => id !== optionIdNum
                        );
                      }
                      updateAnswer(
                        updatedValues.length > 0 ? updatedValues : null
                      );
                    }}
                    className="mt-1 h-5 w-5 border-2"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={`option-${currentQuestion.id}-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.text}
                    </Label>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      case "rating": {
        const minRating = currentQuestion.minRating || 1;
        const maxRating = currentQuestion.maxRating || 5;
        const ratings = Array.from(
          { length: maxRating - minRating + 1 },
          (_, i) => minRating + i
        );
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{minRating} (最低)</span>
              <span>{maxRating} (最高)</span>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {ratings.map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={currentValue === rating ? "default" : "outline"}
                  className="min-w-[40px]"
                  onClick={() => updateAnswer(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        );
      }

      case "text":
        return (
          <Textarea
            value={(currentValue as string) || ""}
            onChange={(e) => updateAnswer(e.target.value || null)}
            placeholder="回答を入力してください..."
            className="min-h-[100px]"
          />
        );

      case "boolean":
        return (
          <div className="flex flex-col items-center space-y-8 py-6">
            <div className="flex w-full max-w-xs mx-auto justify-center gap-4">
              <div
                className={`w-36 text-center py-4 px-6 border-2 rounded-lg cursor-pointer transition-all ${
                  currentValue === true
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-input hover:border-primary/50 hover:bg-accent"
                }`}
                onClick={() => updateAnswer(true)}
              >
                はい
              </div>

              <div
                className={`w-36 text-center py-4 px-6 border-2 rounded-lg cursor-pointer transition-all ${
                  currentValue === false
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-input hover:border-primary/50 hover:bg-accent"
                }`}
                onClick={() => updateAnswer(false)}
              >
                いいえ
              </div>
            </div>
          </div>
        );

      default:
        return <p>未対応の質問タイプです: {currentQuestion.type}</p>;
    }
  };

  // --- ローディング表示 ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">アセスメントを準備中...</p>
      </div>
    );
  }

  // --- アセスメントデータがない場合 ---
  if (!assessment) {
    return (
      <div className="p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>アセスメントが見つかりません</CardTitle>
            <CardDescription>
              指定されたIDのアセスメントが見つかりませんでした。URLを確認するか、一覧に戻ってください。
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/assessments")}>一覧に戻る</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- assessment が確定した後に currentQuestion をチェック ---
  if (!currentQuestion) {
    console.error(
      `Current question not found for index ${currentQuestionIndex} with ID ${currentQuestionId}`
    );
    return (
      <div className="p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>エラー</CardTitle>
            <CardDescription>
              現在の質問の読み込み中にエラーが発生しました。一覧に戻ってやり直してください。
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/assessments")}>一覧に戻る</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- 時間フォーマット ---
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // --- メインレンダリング ---
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ヘッダー情報 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setHelpDialogOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            {/* 保存状態表示 */}
            <div className="flex items-center space-x-2">
              {/* 自動保存インジケーター */}
              <div
                className={cn(
                  "flex items-center text-xs px-2 py-1 rounded transition-colors duration-300",
                  isSaved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-50 text-yellow-600"
                )}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    保存済み
                  </>
                ) : (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    自動保存中
                  </>
                )}
              </div>

              {/* 残り時間推定 */}
              <div className="hidden sm:flex items-center bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                <Clock className="h-3 w-3 mr-1" />
                残り約{Math.ceil((totalQuestions - currentQuestionIndex) * 0.5)}
                分
              </div>

              {/* 回答進捗バッジ */}
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                {Math.round(progressPercentage)}% 完了
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium tabular-nums">
                {formatTime(elapsedTime)}
              </span>
              <span className="text-sm text-muted-foreground">
                {" "}
                / 目安 {assessment.estimatedTime}
              </span>
            </div>
          </div>
        </div>
        {/* 進捗バー */}
        <Progress value={progressPercentage} className="h-2 mb-1" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            残り {remainingQuestions} 問 (現在 {currentQuestionIndex + 1} /{" "}
            {totalQuestions})
          </span>
          <span>{Math.round(progressPercentage)}% 完了</span>
        </div>
      </div>

      {/* 質問カード */}
      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="mr-2 text-primary font-semibold">
              Q{currentQuestionIndex + 1}.
            </span>
            {currentQuestion.text}
            {currentQuestion.required && (
              <span className="text-red-500 ml-2">*</span>
            )}
          </CardTitle>
          {currentQuestion.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="min-h-[150px]">
          {renderQuestionInput()}
        </CardContent>
      </Card>

      {/* ナビゲーションボタン */}
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={() => setExitDialogOpen(true)}>
            中断して終了
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitInProgress}
            aria-label="前の質問へ"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            前へ
          </Button>
          <Button
            onClick={handleNext}
            disabled={submitInProgress}
            aria-label={
              currentQuestionIndex === totalQuestions - 1
                ? "アセスメントを提出"
                : "次の質問へ"
            }
          >
            {currentQuestionIndex === totalQuestions - 1 ? "提出する" : "次へ"}
            {currentQuestionIndex < totalQuestions - 1 && (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* --- ダイアログ --- */}

      {/* 終了確認ダイアログ */}
      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アセスメントを中断しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              現在の回答状況は自動保存されています。後で続きから再開できます。
              本当に中断して終了しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/assessments")}>
              中断して終了
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 提出確認ダイアログ */}
      <AlertDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アセスメントを提出しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              これが最後の質問です。提出すると、回答を修正することはできません。
              よろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitInProgress}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitAssessment}
              disabled={submitInProgress}
            >
              {submitInProgress && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              提出する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ヘルプダイアログ */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{assessment.title} - ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <h3 className="font-semibold mb-1">概要</h3>
              <p className="text-muted-foreground">{assessment.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">操作方法</h3>
              <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                <li>各質問に回答し、「次へ」ボタンで進んでください。</li>
                <li>
                  必須の質問（<span className="text-red-500 font-bold">*</span>
                  マーク）には必ず回答してください。
                </li>
                <li>
                  回答は自動的に保存されます。ブラウザを閉じても、後で同じデバイス・ブラウザから再開できます。
                </li>
                <li>
                  「前へ」ボタンで前の質問に戻れます（適応型テストでない場合）。
                </li>
                <li>
                  画面上部のプログレスバーで進捗状況、残り質問数、経過時間を確認できます。
                </li>
                <li>全ての質問に回答後、「提出する」ボタンが表示されます。</li>
                <li>
                  「中断して終了」ボタンで、いつでもアセスメントを中断できます。進捗は保存されます。
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">所要時間の目安</h3>
              <p className="text-muted-foreground">
                {assessment.estimatedTime}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">注意点</h3>
              <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                <li>安定したインターネット接続環境での実施を推奨します。</li>
                <li>
                  回答中にブラウザを閉じても進捗は保存されますが、長時間離れる場合はご注意ください。
                </li>
                <li>
                  問題や選択肢の順番は、実施ごとにランダムに表示されることがあります。
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setHelpDialogOpen(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
