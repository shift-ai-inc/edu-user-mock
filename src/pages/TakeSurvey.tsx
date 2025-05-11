import { useState, useEffect } from "react";
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
  DialogDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  HelpCircle,
  Loader2,
  Clock,
} from "lucide-react";

// サーベイの質問タイプや共通タイプを中央のファイルからインポート
import { mockSurveysList, SurveyQuestion } from "@/data/mockSurveys";

// 回答データ型
interface Answer {
  questionId: number;
  value: string | string[] | number | boolean | null;
}

// TakeSurvey用のサーベイインターフェース
interface SurveyDetail {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  questions: SurveyQuestion[];
}

export default function TakeSurvey() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ステート
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<boolean>(false);

  // サーベイデータを取得
  useEffect(() => {
    // 実際の実装ではAPIからデータを取得する
    const fetchSurvey = async () => {
      try {
        // URLのidとモックデータのidを型一致で比較
        const surveyIdNum = parseInt(surveyId ?? "", 10);
        // 中央管理されたモックデータからサーベイを検索
        const foundSurvey = mockSurveysList.find((s) => s.id === surveyIdNum);

        if (foundSurvey && foundSurvey.questions) {
          // SurveyインターフェースにTakeSurveyに必要なプロパティを含める
          setSurvey({
            id: foundSurvey.id,
            title: foundSurvey.title,
            description: foundSurvey.description,
            estimatedTime: foundSurvey.estimatedTime,
            questions: foundSurvey.questions,
          });
          setLoading(false);

          // ローカルストレージから途中保存データを復元
          const savedData = localStorage.getItem(`survey_${foundSurvey.id}`);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed.answers || []);
            setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
            setSavedAnswers(true);
          }
        } else {
          setSurvey(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("サーベイの取得に失敗しました", error);
        toast({
          title: "エラー",
          description:
            "サーベイデータの取得に失敗しました。後でもう一度お試しください。",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId, toast]);

  // 現在の質問
  const currentQuestion = survey?.questions[currentQuestionIndex];

  // 進捗率を計算
  const progressPercentage = survey
    ? ((currentQuestionIndex + 1) / survey.questions.length) * 100
    : 0;

  // 回答を更新
  const updateAnswer = (value: string | string[] | number | boolean | null) => {
    if (!currentQuestion) return;

    setAnswers((prevAnswers) => {
      // 既存の回答を探す
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        value,
      };

      // 既存の回答を更新するか、新しい回答を追加
      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, newAnswer];
      }
    });
  };

  // 現在の質問に対する回答を取得
  const getCurrentAnswer = (): Answer["value"] => {
    if (!currentQuestion) return null;

    const answer = answers.find((a) => a.questionId === currentQuestion.id);
    return answer ? answer.value : null;
  };

  // 次の質問に進む
  const handleNext = () => {
    if (!currentQuestion || !survey) return;

    // 必須入力チェック
    if (currentQuestion.required && getCurrentAnswer() === null) {
      toast({
        title: "入力エラー",
        description: "この質問は必須です。回答を入力してください。",
        variant: "destructive",
      });
      return;
    }

    // 条件分岐チェック
    if (currentQuestion.type === "single" && currentQuestion.options) {
      const selectedOptionId = Number(getCurrentAnswer());
      const selectedOption = currentQuestion.options.find(
        (opt) => opt.id === selectedOptionId
      );

      if (selectedOption?.nextQuestionId) {
        // 条件分岐で特定の質問にジャンプ
        const targetQuestionIndex = survey.questions.findIndex(
          (q) => q.id === selectedOption.nextQuestionId
        );
        if (targetQuestionIndex !== undefined && targetQuestionIndex >= 0) {
          setCurrentQuestionIndex(targetQuestionIndex);
          return;
        }
      }
    }

    // 通常の次の質問に進む
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // 全ての質問に回答した場合、完了画面へ
      handleSubmitSurvey();
    }
  };

  // 前の質問に戻る
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // サーベイを保存
  const handleSave = async () => {
    if (!survey) return;

    setSaveInProgress(true);

    try {
      // 実際の実装ではAPIに保存する
      // ここではローカルストレージに保存
      const saveData = {
        surveyId: survey.id,
        answers,
        currentQuestionIndex,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(`survey_${survey.id}`, JSON.stringify(saveData));

      setSaveInProgress(false);
      setSaveDialogOpen(false);
      setSavedAnswers(true);

      toast({
        title: "保存完了",
        description: "回答が正常に保存されました。後で続きから再開できます。",
      });
    } catch (error) {
      console.error("保存に失敗しました", error);
      setSaveInProgress(false);

      toast({
        title: "保存エラー",
        description:
          "回答の保存に失敗しました。ネットワーク接続を確認してください。",
        variant: "destructive",
      });
    }
  };

  // サーベイを提出
  const handleSubmitSurvey = async () => {
    if (!survey) return;

    try {
      // 実際の実装ではAPIに送信する
      // モックの遅延を追加
      toast({
        title: "送信中...",
        description: "サーベイの回答を送信しています。",
      });

      // モックの送信遅延
      setTimeout(() => {
        // 送信成功後、結果ページへ
        navigate(`/surveys/results/${survey.id}`);
      }, 1000);
    } catch (error) {
      console.error("サーベイの送信に失敗しました", error);
      toast({
        title: "送信エラー",
        description:
          "サーベイの送信に失敗しました。後でもう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  // 質問の種類に応じた入力コンポーネントを表示
  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const currentValue = getCurrentAnswer();

    switch (currentQuestion.type) {
      case "single":
        return (
          <RadioGroup
            value={currentValue as string}
            onValueChange={(value) => updateAnswer(value)}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={String(option.id)}
                  id={`option-${option.id}`}
                />
                <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => {
              const values = (currentValue as string[]) || [];
              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${option.id}`}
                    checked={values.includes(String(option.id))}
                    onCheckedChange={(checked) => {
                      const optionId = String(option.id);
                      if (checked) {
                        updateAnswer([
                          ...((currentValue as string[]) || []),
                          optionId,
                        ]);
                      } else {
                        updateAnswer(
                          ((currentValue as string[]) || []).filter(
                            (id) => id !== optionId
                          )
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              );
            })}
          </div>
        );

      case "rating": {
        const minRating = currentQuestion.minRating || 1;
        const maxRating = currentQuestion.maxRating || 5;
        const ratings = Array.from(
          { length: maxRating - minRating + 1 },
          (_, i) => minRating + i
        );
        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {minRating} (最低)
              </span>
              <span className="text-sm text-muted-foreground">
                {maxRating} (最高)
              </span>
            </div>
            <div className="flex justify-between gap-2">
              {ratings.map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={currentValue === rating ? "default" : "outline"}
                  className="flex-1"
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
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="回答を入力してください..."
            className="min-h-[100px]"
          />
        );

      case "boolean":
        return (
          <RadioGroup
            value={currentValue === null ? "" : String(currentValue)}
            onValueChange={(value) => updateAnswer(value === "true")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="boolean-yes" />
              <Label htmlFor="boolean-yes">はい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="boolean-no" />
              <Label htmlFor="boolean-no">いいえ</Label>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">サーベイを読み込み中...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>サーベイが見つかりません</CardTitle>
            <CardDescription>
              指定されたサーベイは存在しないか、アクセス権がありません。
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/surveys")}>
              サーベイ一覧に戻る
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{survey.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setHelpDialogOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {survey.estimatedTime}
            </span>
            {savedAnswers && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                保存済み
              </span>
            )}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>
            質問 {currentQuestionIndex + 1} / {survey.questions.length}
          </span>
          <span>{Math.round(progressPercentage)}% 完了</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion?.text}</CardTitle>
          {currentQuestion?.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>{renderQuestionInput()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={() => setExitDialogOpen(true)}>
            終了
          </Button>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => setSaveDialogOpen(true)}
          >
            <Save className="mr-2 h-4 w-4" />
            途中保存
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            前へ
          </Button>
          <Button className="ml-2" onClick={handleNext}>
            {currentQuestionIndex === survey.questions.length - 1
              ? "送信"
              : "次へ"}
            {currentQuestionIndex === survey.questions.length - 1 ? null : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 途中保存ダイアログ */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>サーベイを保存</DialogTitle>
            <DialogDescription>
              現在の回答を保存します。後で続きから再開できます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={saveInProgress}>
              {saveInProgress && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 終了確認ダイアログ */}
      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>サーベイを終了しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              終了すると、保存されていない回答は失われます。
              {!savedAnswers && "現在の回答は保存されていません。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/surveys")}>
              終了する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ヘルプダイアログ */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{survey.title} - ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">概要</h3>
              <p className="text-sm text-muted-foreground">
                {survey.description}
              </p>
            </div>
            <div>
              <h3 className="font-medium">操作方法</h3>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>「次へ」ボタンで次の質問に進みます</li>
                <li>「前へ」ボタンで前の質問に戻ります</li>
                <li>「途中保存」ボタンで現在の回答を保存できます</li>
                <li>「終了」ボタンでサーベイを終了します</li>
                <li>必須の質問には回答が必要です</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">所要時間</h3>
              <p className="text-sm text-muted-foreground">
                {survey.estimatedTime}
              </p>
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

// IRT/CAT用AIアセスメント
import {
  aiAssessmentQuestions,
  AIItem,
} from "@/components/data/aiAssessmentQuestions";
import { CATSession } from "@/components/data/ability_estimation";
// Reuse the Progress and Card components already imported at the top
import { PieChart, AlertCircle, TrendingUp } from "lucide-react";

// 推定精度表示コンポーネント
function PrecisionIndicator({
  standardError,
  answeredQuestions,
  targetError = 0.3,
}: {
  standardError: number;
  answeredQuestions: number;
  targetError?: number;
  maxItems?: number;
}) {
  // 標準誤差から信頼度への変換（95%信頼区間を想定）
  // 標準誤差1.96が信頼度約0%、標準誤差0が信頼度100%に相当
  const confidenceLevel = Math.max(
    0,
    Math.min(100, Math.round((1 - standardError / 2) * 100))
  );

  // 目標精度までに必要な残り問題数を予測
  const TYPICAL_ERROR_REDUCTION_RATE = 0.15; // 典型的な1問あたりの誤差減少率

  let estimatedRemainingQuestions = 0;
  if (standardError > targetError) {
    // 残りの誤差を減らすのに必要な問題数を計算
    estimatedRemainingQuestions = Math.ceil(
      (standardError - targetError) / TYPICAL_ERROR_REDUCTION_RATE
    );
  }

  // 信頼度に基づいた進捗パーセンテージ
  const initialConfidence = 0; // 初期信頼度
  const targetConfidence = 85; // 目標信頼度（SE=0.3に相当）
  const progressPercent = Math.min(
    ((confidenceLevel - initialConfidence) /
      (targetConfidence - initialConfidence)) *
      100,
    100
  );

  return (
    <div className="bg-muted/10 rounded-lg p-4 mb-4 border border-muted">
      <h3 className="font-medium text-sm mb-3">推定精度指標</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-background p-3 rounded-md">
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <AlertCircle className="h-3 w-3" />
            <span>標準誤差 (SE)</span>
          </div>
          <div className="font-medium text-lg">
            {standardError === Infinity
              ? "計算中"
              : `±${standardError.toFixed(2)}`}
          </div>
        </div>
        <div className="bg-background p-3 rounded-md">
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <TrendingUp className="h-3 w-3" />
            <span>信頼度</span>
          </div>
          <div className="font-medium text-lg">
            {standardError === Infinity ? "計算中" : `${confidenceLevel}%`}
          </div>
        </div>
        <div className="bg-background p-3 rounded-md">
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <PieChart className="h-3 w-3" />
            <span>予測残問題数</span>
          </div>
          <div className="font-medium text-lg">
            {standardError === Infinity
              ? "計算中"
              : `約${estimatedRemainingQuestions}問`}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>信頼度ベース進捗</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>回答済み: {answeredQuestions}問</span>
          <span>
            目標: 信頼度{targetConfidence}%（SE±{targetError}）
          </span>
        </div>
      </div>
    </div>
  );
}

export function TakeSurveyCAT() {
  // 中央値から開始するように初期能力値を0に設定（一般的なアプローチ）
  const [catSession] = useState(() => new CATSession(aiAssessmentQuestions, 0));
  const [currentItem, setCurrentItem] = useState<AIItem | null>(
    catSession.getNextItem() as AIItem
  );
  const [responses, setResponses] = useState<{ [id: string]: boolean }>({});
  const [finished, setFinished] = useState(false);
  const [ability, setAbility] = useState(0);
  const [standardError, setStandardError] = useState(Infinity);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const TARGET_ERROR = 0.3; // 目標精度
  const MAX_ITEMS = 20; // 最大問題数

  // 回答処理
  const handleAnswer = (itemId: string, selectedOptionId: string) => {
    const item = aiAssessmentQuestions.find((q) => q.id === itemId)!;
    const correct = selectedOptionId === item.correctAnswer;

    catSession.processResponse(itemId, correct);
    setResponses((prev) => ({ ...prev, [itemId]: correct }));
    setAbility(catSession.getFinalAbility());
    setStandardError(catSession["standardError"]);

    if (catSession.shouldEndTest(MAX_ITEMS, TARGET_ERROR)) {
      setFinished(true);
    } else {
      setCurrentItem(catSession.getNextItem() as AIItem);
    }
  };

  if (finished) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">AI適性アセスメント結果</h2>
        <div className="bg-primary/5 rounded-lg p-6 mb-6 border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">最終推定能力値</h3>
            <span className="text-2xl font-bold text-primary">
              {ability.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md">測定精度</h3>
            <span className="text-md font-medium">
              ±{standardError.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md">信頼度</h3>
            <span className="text-md font-medium">
              {Math.max(
                0,
                Math.min(100, Math.round((1 - standardError / 2) * 100))
              )}
              %
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-md">回答数</h3>
            <span className="text-md font-medium">
              {Object.keys(responses).length}問
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          <p>能力値は平均0、標準偏差1の正規分布で表現されます。</p>
          <p>
            一般的に、+1.0以上が上位16%、+2.0以上が上位2.5%の能力に相当します。
          </p>
        </div>
      </div>
    );
  }

  if (!currentItem) return <div>全ての設問に回答済みです。</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">AI適性アセスメント</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setHelpDialogOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* 数値による推定精度指標表示 */}
        <PrecisionIndicator
          standardError={standardError}
          answeredQuestions={Object.keys(responses).length}
          targetError={TARGET_ERROR}
          maxItems={MAX_ITEMS}
        />
      </div>

      <Card className="mb-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span className="mr-2 text-primary font-semibold">
              Q{Object.keys(responses).length + 1}.
            </span>
            {currentItem.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentItem.options.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center p-3 border-2 rounded-md cursor-pointer transition-all hover:border-primary/50 hover:bg-accent"
                onClick={() => handleAnswer(currentItem.id, opt.id)}
              >
                <div className="pl-2">{opt.text}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground bg-muted/10 p-4 rounded-md border border-muted">
        <h3 className="font-medium mb-2">適応型テストについて</h3>
        <p className="mb-2">
          このテストは適応型で、あなたの回答に応じて次の問題が変化します。
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            信頼度が
            {Math.max(
              0,
              Math.min(100, Math.round((1 - TARGET_ERROR / 2) * 100))
            )}
            %以上に達した時点、または{MAX_ITEMS}問回答した時点で終了します。
          </li>
          <li>
            標準誤差(SE)が小さいほど、能力推定の精度が高いことを意味します。
          </li>
        </ul>
      </div>

      {/* ヘルプダイアログ */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI適性アセスメント - ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <h3 className="font-semibold mb-1">概要</h3>
              <p className="text-muted-foreground">
                このアセスメントはアイテム反応理論(IRT)を用いた適応型テスト(CAT)です。
                回答パターンに基づいて問題の難易度が調整され、効率的に能力を測定します。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">推定精度指標について</h3>
              <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                <li>
                  <strong>標準誤差(SE)</strong>:
                  能力推定値の不確かさを示す値です。小さいほど精度が高いことを意味します。
                </li>
                <li>
                  <strong>信頼度</strong>:
                  推定の確かさをパーセントで表したものです。標準誤差から変換された値で、高いほど信頼性が高いことを示します。
                </li>
                <li>
                  <strong>予測残問題数</strong>:
                  目標精度に達するために必要と推定される問題数です。
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">終了条件</h3>
              <p className="text-muted-foreground">
                以下のいずれかの条件で終了します：
                <ul className="list-disc ml-5 space-y-1">
                  <li>標準誤差が目標値（±{TARGET_ERROR}）以下になった場合</li>
                  <li>
                    信頼度が
                    {Math.max(
                      0,
                      Math.min(100, Math.round((1 - TARGET_ERROR / 2) * 100))
                    )}
                    %以上に達した場合
                  </li>
                  <li>最大問題数（{MAX_ITEMS}問）に達した場合</li>
                </ul>
              </p>
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
