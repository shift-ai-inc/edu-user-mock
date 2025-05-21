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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
} from "recharts"; // Directly using recharts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"; // Shadcn UI Chart wrapper
import {
  Printer,
  Download,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  BellRing,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { allMockAssessments, type Assessment } from "./Assessment"; // Import mock assessments and Assessment type

// --- Mock Data Types ---

interface CategoryScore {
  category: string;
  score: number; // 0-100
  average: number; // Industry average
  previous: number; // Previous score
}

interface AssessmentResult {
  assessmentId: number;
  assessmentTitle: string;
  completedDate: string;
  overallScore: number; // 0-100
  summary: string; // Overall summary
  categoryScores: CategoryScore[];
  strengths: string[]; // Strength categories
  weaknesses: string[]; // Weakness categories
  recommendations: { title: string; description: string; link?: string }[];
  detailedFeedback: string;
}

// --- Mock Data Generation (Simplified for Debugging) ---
const generateMockResult = (currentAssessment: Assessment): AssessmentResult => {
  const { id, title } = currentAssessment;
  console.log(`[generateMockResult] Generating SIMPLIFIED result for Assessment ID: ${id}, Title: ${title}`);

  const simplifiedCategories: CategoryScore[] = [
    { category: "簡易カテゴリA", score: Math.floor(Math.random() * 51) + 50, average: Math.floor(Math.random() * 21) + 55, previous: Math.floor(Math.random() * 41) + 45 },
    { category: "簡易カテゴリB", score: Math.floor(Math.random() * 51) + 50, average: Math.floor(Math.random() * 21) + 55, previous: Math.floor(Math.random() * 41) + 45 },
    { category: "簡易カテゴリC", score: Math.floor(Math.random() * 51) + 50, average: Math.floor(Math.random() * 21) + 55, previous: Math.floor(Math.random() * 41) + 45 },
  ];

  const overall = simplifiedCategories.length > 0 
    ? Math.round(simplifiedCategories.reduce((sum, s) => sum + s.score, 0) / simplifiedCategories.length)
    : 50;

  const strengthsList = simplifiedCategories.filter(s => s.score > 70).map(s => s.category);
  const weaknessesList = simplifiedCategories.filter(s => s.score <= 70).map(s => s.category);

  return {
    assessmentId: id, 
    assessmentTitle: title, 
    completedDate: new Date().toLocaleDateString("ja-JP"),
    overallScore: overall,
    summary: `これは ${title} の総合評価です。全体スコアは ${overall} 点です。この結果は現在、汎用的なカテゴリを使用して表示されています。`,
    categoryScores: simplifiedCategories,
    strengths: strengthsList.length > 0 ? strengthsList : ["特筆すべき強みはありません (簡易版)"],
    weaknesses: weaknessesList.length > 0 ? weaknessesList : ["特筆すべき弱みはありません (簡易版)"],
    recommendations: [
      {
        title: "学習リソース (簡易版)",
        description: "このリソースは汎用的なプレースホルダーです。",
        link: "#",
      },
      {
        title: "次のステップ (簡易版)",
        description: "さらなるスキルアップを目指しましょう。",
        link: "#",
      },
    ],
    detailedFeedback: `これは ${title} に関する詳細フィードバックのプレースホルダーです。各カテゴリのスコアを確認し、強みを伸ばし弱点を補強するための学習計画を立てましょう。`,
  };
};


// --- Chart Configuration ---
const categoryChartConfig = {
  score: { label: "あなたのスコア", color: "hsl(var(--chart-1))" },
  average: { label: "業界平均", color: "hsl(var(--chart-2))" },
  previous: { label: "前回スコア", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export default function AssessmentResults() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); 

        const assessmentIdNum = parseInt(assessmentId || "0", 10);
        console.log(`[AssessmentResults] Received assessmentId from URL: ${assessmentId}, Parsed to: ${assessmentIdNum}`);

        if (isNaN(assessmentIdNum) || assessmentIdNum <= 0) {
          console.error(`[AssessmentResults] Invalid assessmentId from URL: ${assessmentId}`);
          throw new Error("無効なアセスメントIDです。");
        }
        
        // ADDED LOGGING HERE:
        console.log("[AssessmentResults] Inspecting allMockAssessments. Available assessments:", 
          allMockAssessments.map(a => ({id: a.id, title: a.title}))
        );

        const currentAssessment = allMockAssessments.find(a => a.id === assessmentIdNum);
        if (!currentAssessment) {
          console.error(`[AssessmentResults] Assessment with ID ${assessmentIdNum} not found in allMockAssessments. Available IDs from import: ${allMockAssessments.map(a => a.id).join(', ')}`);
          throw new Error(`ID ${assessmentIdNum} のアセスメントが見つかりません。`);
        }
        
        console.log(`[AssessmentResults] Found assessment: ID=${currentAssessment.id}, Title=${currentAssessment.title}, Number of questions: ${currentAssessment.questions?.length || 0}`);
        
        if (currentAssessment.questions && currentAssessment.questions.length > 0) {
          console.log(`[AssessmentResults] First 5 questions for assessment ${currentAssessment.id}:`);
          currentAssessment.questions.slice(0, 5).forEach(q => {
            if (q && q.text && q.id) {
               console.log(`  - QID ${q.id}: Text="${q.text.substring(0,30)}...", Category="${q.category}", MajorCategory="${q.majorCategory}"`);
            } else {
               console.log(`  - Found an undefined or incomplete question object in assessment ${currentAssessment.id}`);
            }
          });
        } else {
          console.log(`[AssessmentResults] No questions found for assessment ${currentAssessment.id}`);
        }

        const mockResult = generateMockResult(currentAssessment);
        console.log(`[AssessmentResults] Generated SIMPLIFIED mockResult for ${currentAssessment.title}:`, JSON.parse(JSON.stringify(mockResult)));
        setResult(mockResult);

      } catch (error) {
        console.error("[AssessmentResults] アセスメント結果の取得中にエラーが発生しました:", error);
        const errorMessage = error instanceof Error ? error.message : "結果データの取得に失敗しました。";
        toast({
          title: "エラー",
          description: errorMessage,
          variant: "destructive",
        });
        setResult(null); 
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchResult();
    } else {
      console.error("[AssessmentResults] assessmentId is undefined in useEffect. Routing might be incorrect.");
      toast({
        title: "エラー",
        description: "アセスメントIDが指定されていません。ルート設定を確認してください。",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [assessmentId, toast, navigate]); 

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast({
      title: "PDFとして保存",
      description:
        "印刷ダイアログが表示されます。「PDFとして保存」を選択してください。",
    });
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">
          結果を読み込んでいます...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle>アセスメント結果の表示エラー</CardTitle>
            <CardDescription>
              アセスメント結果の読み込みまたは生成に問題が発生しました。コンソールで詳細を確認するか、一覧に戻って再試行してください。
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate("/assessments/results")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              結果一覧に戻る
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 print:p-0 print:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 print:hidden">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/assessments/results")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            結果一覧に戻る
          </Button>
          <h1 className="text-3xl font-bold">
            {result.assessmentTitle} - 結果
          </h1>
          <p className="text-muted-foreground">
            完了日: {result.completedDate}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            印刷
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            PDF保存
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            総合評価
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 text-center">
            <p className="text-6xl font-bold text-primary">
              {result.overallScore}
            </p>
            <p className="text-muted-foreground">Overall Score</p>
            <Progress
              value={result.overallScore}
              className="w-32 h-2 mt-2 mx-auto"
            />
          </div>
          <p className="text-muted-foreground flex-grow">{result.summary}</p>
        </CardContent>
      </Card>

      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="text-xl">カテゴリ別スコア</CardTitle>
          <CardDescription>
            各カテゴリにおけるあなたのスコア、業界平均、前回スコアの比較です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={categoryChartConfig}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.categoryScores}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0} 
                />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="score"
                  fill="var(--color-score)"
                  radius={4}
                  barSize={20}
                />
                <Bar
                  dataKey="average"
                  fill="var(--color-average)"
                  radius={4}
                  barSize={20}
                />
                <Bar
                  dataKey="previous"
                  fill="var(--color-previous)"
                  radius={4}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-green-600">
              <TrendingUp className="mr-2 h-5 w-5" />
              あなたの強み
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {result.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center text-orange-600">
              <TrendingDown className="mr-2 h-5 w-5" />
              改善のポイント
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {result.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            推奨される学習リソース
          </CardTitle>
          <CardDescription>
            スコアに基づいて推奨される学習リソースや次のステップです。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>リソース名</TableHead>
                <TableHead>説明</TableHead>
                <TableHead className="text-right print:hidden">
                  リンク
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.recommendations.map((rec, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{rec.title}</TableCell>
                  <TableCell>{rec.description}</TableCell>
                  <TableCell className="text-right print:hidden">
                    {rec.link ? (
                      <Button variant="link" size="sm" asChild>
                        <a
                          href={rec.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          詳細を見る
                        </a>
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            詳細フィードバック
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {result.detailedFeedback}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-50 print:hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BellRing className="mr-2 h-5 w-5 text-gray-500" />
            今後のレビュー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            定期的なスキルレビューのためにリマインダーを設定できます。（この機能は現在開発中です）
          </p>
          <Button size="sm" variant="secondary" className="mt-2" disabled>
            リマインダー設定
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
