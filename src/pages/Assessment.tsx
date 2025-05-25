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
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash-es";
import { aiAssessmentQuestions } from "@/data/aiAssessmentQuestions";

// アセスメントの質問タイプ
type QuestionType = "single" | "multiple" | "rating" | "text" | "boolean";

// 質問オプション
interface QuestionOption {
  id: number;
  text: string;
}

// 質問データ型
export interface Question {
  id: number;
  text: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  minRating?: number;
  maxRating?: number;
  difficulty?: number;
  category?: string;
  majorCategory?: string;
}

// アセスメントデータ型
export interface Assessment {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  questions: Question[];
}

// 回答データ型
interface Answer {
  questionId: number;
  value: any;
  answeredAt: number;
}

// アセスメントの状態
interface AssessmentState {
  currentQuestionIndex: number;
  answers: Answer[];
  startTime: number | null;
  endTime: number | null;
  progress: number;
  isSubmitting: boolean;
  isSubmitted: boolean;
  timeTaken?: number;
  score?: number;
  estimatedAbility?: number;
}

const personalityQuestions: Question[] = [
  { id: 301, text: "あなたは社交的ですか？", type: "boolean", required: true, majorCategory: "パーソナリティ", category: "社交性" },
  { id: 302, text: "計画を立てるのが好きですか？", type: "boolean", required: true, majorCategory: "パーソナリティ", category: "計画性" },
  { id: 303, text: "新しいことに挑戦するのはワクワクしますか？", type: "boolean", required: true, majorCategory: "パーソナリティ", category: "挑戦心" },
];

const leadershipQuestions: Question[] = [
  { id: 401, text: "チームを率いた経験がありますか？", type: "boolean", required: true, majorCategory: "リーダーシップ", category: "経験" },
  { id: 402, text: "困難な状況でも冷静さを保てますか？", type: "boolean", required: true, majorCategory: "リーダーシップ", category: "冷静さ" },
  { id: 403, text: "他者の意見を尊重しますか？", type: "boolean", required: true, majorCategory: "リーダーシップ", category: "協調性" },
];

const itKnowledgeQuestions: Question[] = [
  { id: 501, text: "クラウドコンピューティングの基本的な概念を理解していますか？", type: "boolean", required: true, majorCategory: "IT知識", category: "クラウド" },
  { id: 502, text: "データベースとは何か説明できますか？", type: "text", required: true, majorCategory: "IT知識", category: "データベース" },
  { id: 503, text: "基本的なプログラミングの経験はありますか？", type: "boolean", required: true, majorCategory: "IT知識", category: "プログラミング" },
];

export const allMockAssessments: Assessment[] = [
  {
    id: 101,
    title: "総合スキルアセスメント",
    description: "論理思考、コミュニケーション、問題解決能力などを総合的に評価します。この評価は、あなたの生成AIに関するスキルとリテラシーレベルを測定することも目的としています。",
    estimatedTime: "約30分",
    questions: aiAssessmentQuestions,
  },
  {
    id: 102,
    title: "パーソナリティ診断",
    description: "あなたの性格特性や行動傾向を分析します。",
    estimatedTime: "約15分",
    questions: personalityQuestions,
  },
  {
    id: 103,
    title: "リーダーシップ適性検査",
    description: "リーダーとしての潜在能力やスタイルを評価します。",
    estimatedTime: "約20分",
    questions: leadershipQuestions,
  },
  {
    id: 104,
    title: "IT知識基礎テスト",
    description: "基本的なIT用語や概念の理解度を測ります。",
    estimatedTime: "約10分",
    questions: itKnowledgeQuestions,
  },
];

const AssessmentPage = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    endTime: null,
    progress: 0,
    isSubmitting: false,
    isSubmitted: false,
  });
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const idToLoad = parseInt(assessmentId || "0");
    const loadedAssessment = allMockAssessments.find(
      (a) => a.id === idToLoad
    );
    
    if (loadedAssessment) {
      setAssessment(loadedAssessment);
      const timeMatch = loadedAssessment.estimatedTime.match(/(\d+)/);
      if (timeMatch) {
        setTimeLeft(parseInt(timeMatch[1]) * 60);
      } else {
        setTimeLeft(30 * 60); // Default to 30 minutes if not specified
      }
    } else {
      toast({
        title: "エラー",
        description: `アセスメント (ID: ${idToLoad}) が見つかりません。`,
        variant: "destructive",
      });
      navigate("/assessments");
    }
  }, [assessmentId, navigate, toast]);

  useEffect(() => {
    if (
      assessmentState.startTime &&
      !assessmentState.endTime &&
      timeLeft !== null &&
      timeLeft > 0
    ) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && assessmentState.startTime && !assessmentState.isSubmitted) {
      handleSubmit(true); // Auto-submit if time runs out
    }
  }, [assessmentState.startTime, assessmentState.endTime, timeLeft, assessmentState.isSubmitted]);

  const currentQuestion = useMemo(() => {
    if (!assessment) return null;
    // Since Next/Prev are removed, currentQuestionIndex will likely remain 0
    return assessment.questions[assessmentState.currentQuestionIndex];
  }, [assessment, assessmentState.currentQuestionIndex]);

  const debouncedSaveAnswer = useCallback(
    debounce((questionId: number, value: any) => {
      console.log("Auto-saving answer for question:", questionId, "value:", value);
      // This is a good place for a silent auto-save to backend if implemented
      toast({
        title: "自動保存",
        description: `質問 ${questionId} の回答が保存されました。`,
        duration: 2000,
      });
    }, 1000), 
    [toast]
  );

  const handleAnswerChange = (value: any) => {
    setCurrentAnswer(value);
    if (currentQuestion) {
      debouncedSaveAnswer(currentQuestion.id, value);
    }
  };

  const startAssessment = () => {
    if (!assessment) return;
    setShowInstructions(false);
    setAssessmentState((prev) => ({
      ...prev,
      startTime: Date.now(),
      // Progress will be for the first question initially
      progress: (1 / (assessment.questions.length || 1)) * 100, 
    }));
  };

  // goToNextQuestion and goToPreviousQuestion are no longer triggered by UI buttons
  // They are kept here in case of future re-introduction or programmatic use,
  // but are effectively unused in the current UI flow.
  const goToNextQuestion = () => {
    if (!assessment || !currentQuestion || assessmentState.currentQuestionIndex >= assessment.questions.length - 1) return;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      value: currentAnswer,
      answeredAt: Date.now(),
    };

    setAssessmentState((prev) => {
      const existingAnswerIndex = prev.answers.findIndex(ans => ans.questionId === newAnswer.questionId);
      let updatedAnswers;
      if (existingAnswerIndex > -1) {
        updatedAnswers = [...prev.answers];
        updatedAnswers[existingAnswerIndex] = newAnswer;
      } else {
        updatedAnswers = [...prev.answers, newAnswer];
      }
      
      const nextIndex = prev.currentQuestionIndex + 1;
      return {
        ...prev,
        answers: updatedAnswers,
        currentQuestionIndex: nextIndex,
        progress:
          ((nextIndex + 1) / assessment.questions.length) * 100,
      };
    });
    
    const nextQuestionId = assessment.questions[assessmentState.currentQuestionIndex + 1]?.id;
    if (nextQuestionId) {
      const nextAnswer = assessmentState.answers.find(ans => ans.questionId === nextQuestionId);
      setCurrentAnswer(nextAnswer ? nextAnswer.value : null);
    } else {
      setCurrentAnswer(null);
    }
  };

  const goToPreviousQuestion = () => {
    if (assessmentState.currentQuestionIndex > 0) {
      if (currentQuestion && currentAnswer !== null) {
         const currentQAnswer: Answer = {
          questionId: currentQuestion.id,
          value: currentAnswer,
          answeredAt: Date.now(),
        };
        setAssessmentState(prev => {
          const existingIndex = prev.answers.findIndex(a => a.questionId === currentQAnswer.questionId);
          if (existingIndex !== -1) {
            const newAnswers = [...prev.answers];
            newAnswers[existingIndex] = currentQAnswer;
            return {...prev, answers: newAnswers};
          }
          return {...prev, answers: [...prev.answers, currentQAnswer]};
        });
      }

      const prevIndex = assessmentState.currentQuestionIndex - 1;
      setAssessmentState((prev) => ({
        ...prev,
        currentQuestionIndex: prevIndex,
        progress:
          ((prevIndex + 1) /
            (assessment?.questions.length || 1)) *
          100,
      }));
      
      const previousQuestionId = assessment?.questions[prevIndex]?.id;
      if (previousQuestionId) {
        const previousAnswer = assessmentState.answers.find(
          (ans) => ans.questionId === previousQuestionId
        );
        setCurrentAnswer(previousAnswer ? previousAnswer.value : null);
      } else {
        setCurrentAnswer(null);
      }
    }
  };


  const handleSubmit = async (isTimeUp = false) => {
    if (assessmentState.isSubmitted) return;

    setShowConfirmDialog(false);
    setAssessmentState((prev) => ({ ...prev, isSubmitting: true }));

    // Ensure the current answer for the current (likely first) question is included
    let finalAnswers = [...assessmentState.answers];
    if (currentQuestion && currentAnswer !== null) {
      const lastAnswer: Answer = {
        questionId: currentQuestion.id,
        value: currentAnswer,
        answeredAt: Date.now(),
      };
      const existingIndex = finalAnswers.findIndex(a => a.questionId === lastAnswer.questionId);
      if (existingIndex !== -1) {
        finalAnswers[existingIndex] = lastAnswer;
      } else {
        finalAnswers.push(lastAnswer);
      }
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const endTime = Date.now();
    const timeTaken = Math.round(
      (endTime - (assessmentState.startTime || endTime)) / 1000
    );

    setAssessmentState((prev) => ({
      ...prev,
      endTime,
      isSubmitting: false,
      isSubmitted: true,
      timeTaken,
      answers: finalAnswers, // Store the final set of answers
    }));

    if (isTimeUp) {
      toast({
        title: "時間切れ",
        description: "アセスメントが自動的に提出されました。",
        variant: "warning",
      });
    } else {
      toast({
        title: "成功",
        description: "アセスメントが正常に提出されました。",
        variant: "success",
      });
    }
    
    // Save results to localStorage (example persistence)
    localStorage.setItem(`assessment_results_${assessmentId}`, JSON.stringify({
      assessmentId,
      answers: finalAnswers,
      timeTaken,
      assessmentTitle: assessment?.title,
      questions: assessment?.questions, // Save questions for result display context
    }));

    // Navigate to results page
    navigate(`/assessments/results/${assessmentId}`);
  };

  const handleCancelAssessment = () => {
    setShowCancelDialog(false);
    navigate("/assessments"); // Or to a dashboard/home page
    toast({
      title: "アセスメント中断",
      description: "アセスメントが中断されました。",
      variant: "info",
    });
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "N/A";
    if (seconds < 0) return "00:00"; // Ensure non-negative display
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Loading state for assessment data
  if (!assessment && !assessmentId) { // Initial load before ID is known
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">アセスメント情報を読み込んでいます...</p>
      </div>
    );
  }
  
  if (!assessment && assessmentId) { // Loading with a known ID
     return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">アセスメント (ID: {assessmentId}) を読み込んでいます...</p>
      </div>
    );
  }

  // Instructions Screen
  if (showInstructions) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              {assessment.title}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground pt-2">
              {assessment.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center text-lg">
              <Clock className="mr-3 h-6 w-6 text-primary" />
              <span>
                目安時間: <strong>{assessment.estimatedTime}</strong>
              </span>
            </div>
            <div className="flex items-center text-lg">
              <HelpCircle className="mr-3 h-6 w-6 text-primary" />
              <span>
                問題数: <strong>{assessment.questions.length}問</strong>
              </span>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-semibold text-blue-700 mb-2">注意事項:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>全ての質問に正直に回答してください。</li>
                <li>回答は自動保存されますが、中断する場合は「中断する」ボタンを使用してください。</li>
                <li>
                  制限時間があります。時間内に全ての質問に回答してください。
                </li>
                <li>
                  ブラウザを閉じたり、ページを更新したりすると、進行状況が失われる可能性があります。
                  （中断機能を利用してください）
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              size="lg"
              onClick={startAssessment}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
            >
              アセスメントを開始する
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Submission Complete Screen
  if (assessmentState.isSubmitted) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-2xl text-center">
        <Card className="shadow-lg">
          <CardHeader>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-bold text-green-600">
              アセスメント完了！
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              ご協力ありがとうございました。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              所要時間:{" "}
              <strong>{formatTime(assessmentState.timeTaken || 0)}</strong>
            </p>
            {/* Optionally display score or other feedback here */}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() =>
                navigate(`/assessments/results/${assessmentId}`)
              }
              className="w-full sm:w-auto"
            >
              結果を見る
            </Button>
            <Button
              onClick={() => navigate("/assessments")}
              className="w-full sm:w-auto"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              アセスメント一覧に戻る
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Loading state for current question (should be quick if assessment is loaded)
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">質問を読み込んでいます...</p>
      </div>
    );
  }

  // Dynamically render input based on question type
  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "single":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent",
                  currentAnswer === option.id && "bg-primary/10 border-primary ring-2 ring-primary"
                )}
                onClick={() => handleAnswerChange(option.id)}
              >
                <Label
                  htmlFor={`option-${option.id}`} // Not strictly needed as no input, but good for consistency
                  className="text-base flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        );
      case "multiple":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent",
                  Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.id) &&
                    "bg-primary/10 border-primary ring-2 ring-primary"
                )}
                onClick={() => { // Allow clicking the whole div to toggle
                  const newAnswers = Array.isArray(currentAnswer)
                    ? [...currentAnswer]
                    : [];
                  const index = newAnswers.indexOf(option.id);
                  if (index > -1) {
                    newAnswers.splice(index, 1);
                  } else {
                    newAnswers.push(option.id);
                  }
                  handleAnswerChange(newAnswers);
                }}
              >
                <Checkbox
                  id={`option-${option.id}`}
                  checked={
                    Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.id)
                  }
                  className="mr-3 h-5 w-5"
                  onCheckedChange={(checked) => { // Keep onCheckedChange for accessibility and direct interaction
                    const newAnswers = Array.isArray(currentAnswer)
                      ? [...currentAnswer]
                      : [];
                    const index = newAnswers.indexOf(option.id);
                    if (checked && index === -1) {
                      newAnswers.push(option.id);
                    } else if (!checked && index > -1) {
                      newAnswers.splice(index, 1);
                    }
                    handleAnswerChange(newAnswers);
                  }}
                />
                <Label
                  htmlFor={`option-${option.id}`}
                  className="text-base flex-1 cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        );
      case "rating":
        return (
          <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-around sm:items-center py-4">
            <span className="text-sm text-muted-foreground">
              {currentQuestion.minRating || 1} (低い)
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from(
                {
                  length:
                    (currentQuestion.maxRating || 5) -
                    (currentQuestion.minRating || 1) +
                    1,
                },
                (_, i) => (currentQuestion.minRating || 1) + i
              ).map((ratingValue) => (
                <Button
                  key={ratingValue}
                  variant={
                    currentAnswer === ratingValue ? "default" : "outline"
                  }
                  size="icon"
                  className="rounded-full h-10 w-10 text-lg transition-colors"
                  onClick={() => handleAnswerChange(ratingValue)}
                >
                  {ratingValue}
                </Button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.maxRating || 5} (高い)
            </span>
          </div>
        );
      case "text":
        return (
          <Textarea
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="回答を入力してください..."
            rows={5}
            className="text-base focus:ring-2 focus:ring-primary"
          />
        );
      case "boolean":
        return (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant={currentAnswer === true ? "default" : "outline"}
              onClick={() => handleAnswerChange(true)}
              className={cn(
                "flex-1 py-3 text-base transition-colors",
                currentAnswer !== true && "hover:bg-accent hover:text-accent-foreground" // Keep hover style for unselected
              )}
            >
              はい
            </Button>
            <Button
              variant={currentAnswer === false ? "secondary" : "outline"} // Use "secondary" for "No" when selected
              onClick={() => handleAnswerChange(false)}
              className={cn(
                "flex-1 py-3 text-base transition-colors",
                 currentAnswer !== false && "hover:bg-accent hover:text-accent-foreground" // Keep hover style for unselected
              )}
            >
              いいえ
            </Button>
          </div>
        );
      default:
        return <p>不明な質問タイプです。</p>;
    }
  };

  // Validation for the current question, used to disable submit button
  const isCurrentQuestionAnswerInvalid =
    (currentQuestion.required && (currentAnswer === null || currentAnswer === undefined)) ||
    (currentQuestion.type === "multiple" &&
      Array.isArray(currentAnswer) &&
      currentAnswer.length === 0 &&
      currentQuestion.required) ||
    (currentQuestion.type === "text" &&
      (currentAnswer === "" || currentAnswer === null || currentAnswer === undefined) && // Check for empty string too
      currentQuestion.required);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl flex flex-col min-h-[calc(100vh-theme(space.16))] md:min-h-screen">
      <header className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary truncate" title={assessment.title}>
            {assessment.title}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-card border px-3 py-1.5 rounded-md shadow-sm">
            <Clock className="h-4 w-4" />
            <span>残り時間: {formatTime(timeLeft)}</span>
          </div>
        </div>
        <Progress
          value={assessmentState.progress}
          className="w-full h-3"
          aria-label="アセスメント進捗"
        />
        <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              質問 {assessmentState.currentQuestionIndex + 1} /{" "}
              {assessment.questions.length}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 border-destructive/50"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                中断する
              </Button>
              <Button
                size="sm"
                onClick={() => setShowConfirmDialog(true)}
                disabled={isCurrentQuestionAnswerInvalid || assessmentState.isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {assessmentState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                終了して提出
              </Button>
            </div>
        </div>
      </header>

      <main className="flex-grow mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold leading-relaxed">
              {currentQuestion.majorCategory && (
                <span className="text-sm font-normal text-muted-foreground block mb-1">
                  {currentQuestion.majorCategory}
                  {currentQuestion.category && ` > ${currentQuestion.category}`}
                </span>
              )}
              {currentQuestion.text}
            </CardTitle>
            {currentQuestion.description && (
              <CardDescription className="pt-1 text-sm">
                {currentQuestion.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>{renderQuestionInput()}</CardContent>
        </Card>
      </main>

      {/* Footer is removed */}

      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アセスメントを提出しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              提出すると、回答を編集することはできません。よろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit()}>
              提出する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アセスメントを中断しますか？</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              本当にこのアセスメントを中断しますか？
              進行状況は保存されません。 (現在の自動保存はローカルの揮発性状態のみです)
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleCancelAssessment}>
              中断する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentPage;
