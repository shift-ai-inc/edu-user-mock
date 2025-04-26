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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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

// --- Mock Data Generation ---
const generateMockResult = (id: number): AssessmentResult => {
  const categories = ["論理思考", "コミュニケーション", "問題解決", "協調性", "リーダーシップ"];
  const scores: CategoryScore[] = categories.map(cat => ({
    category: cat,
    score: Math.floor(Math.random() * 61) + 40, // 40-100
    average: Math.floor(Math.random() * 21) + 55, // 55-75
    previous: Math.floor(Math.random() * 41) + 45, // 45-85
  }));

  const overall = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length);
  const strengths = scores.filter(s => s.score >= 75).map(s => s.category);
  const weaknesses = scores.filter(s => s.score < 60).map(s => s.category);

  return {
    assessmentId: id,
    assessmentTitle: `総合スキルアセスメント (ID: ${id})`,
    completedDate: new Date().toLocaleDateString("ja-JP"),
    overallScore: overall,
    summary: `全体スコアは ${overall} 点です。${strengths.length > 0 ? strengths.join('、') + 'に強みが見られます。' : ''}${weaknesses.length > 0 ? weaknesses.join('、') + 'の領域で改善の余地があります。' : ''}`,
    categoryScores: scores,
    strengths: strengths.length > 0 ? strengths : ["特筆すべき強みはありません"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["特筆すべき弱みはありません"],
    recommendations: [
      { title: "論理思考力向上のためのオンラインコース", description: "データ分析とクリティカルシンキングを強化します。", link: "#" },
      { title: "効果的なコミュニケーション研修", description: "プレゼンテーションと対人スキルを向上させます。", link: "#" },
      ...(weaknesses.includes("問題解決") ? [{ title: "問題解決ワークショップ", description: "実践的なケーススタディを通じて解決能力を養います。", link: "#" }] : []),
    ],
    detailedFeedback: `今回の${id === 101 ? '総合スキルアセスメント' : 'アセスメント'}では、あなたの多面的な能力が評価されました。特に${strengths.join('と')}の分野で高いポテンシャルが示されています。一方で、${weaknesses.join('や')}については、さらなる学習と実践を通じて伸ばしていくことが期待されます。推奨されるリソースを活用し、継続的なスキルアップを目指しましょう。`,
  };
};

// --- Chart Configuration ---
const categoryChartConfig = {
  score: { label: "あなたのスコア", color: "hsl(var(--chart-1))" },
  average: { label: "業界平均", color: "hsl(var(--chart-2))" },
  previous: { label: "前回スコア", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;


export default function AssessmentResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const assessmentId = parseInt(id || "0", 10);
        if (isNaN(assessmentId) || assessmentId <= 0) {
           throw new Error("無効なアセスメントIDです。");
        }
        const mockResult = generateMockResult(assessmentId);
        setResult(mockResult);

      } catch (error) {
        console.error("アセスメント結果の取得に失敗しました", error);
        toast({
          title: "エラー",
          description: "結果データの取得に失敗しました。",
          variant: "destructive",
        });
        // Optionally navigate back on error
        // navigate("/assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, toast, navigate]);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // PDF download handler (via print dialog)
  const handleDownloadPdf = () => {
     toast({
      title: "PDFとして保存",
      description: "印刷ダイアログが表示されます。「PDFとして保存」を選択してください。",
    });
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">結果を読み込んでいます...</p>
      </div>
    );
  }

  // No result found state
  if (!result) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
         <Card>
            <CardHeader>
                <CardTitle>結果が見つかりません</CardTitle>
                <CardDescription>指定されたアセスメントの結果が見つかりませんでした。</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                 <Button variant="outline" onClick={() => navigate("/assessments")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    アセスメント一覧に戻る
                </Button>
            </CardFooter>
         </Card>
      </div>
    );
  }

  // --- Render Component ---
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 print:p-0 print:space-y-4">
      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 print:hidden">
        <div>
          <Button variant="outline" size="sm" onClick={() => navigate("/assessments")} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            一覧に戻る
          </Button>
          <h1 className="text-3xl font-bold">{result.assessmentTitle} - 結果</h1>
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

      {/* Overall Score and Summary */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            総合評価
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 text-center">
            <p className="text-6xl font-bold text-primary">{result.overallScore}</p>
            <p className="text-muted-foreground">Overall Score</p>
            <Progress value={result.overallScore} className="w-32 h-2 mt-2 mx-auto" />
          </div>
          <p className="text-muted-foreground flex-grow">{result.summary}</p>
        </CardContent>
      </Card>

      {/* Category Scores Chart */}
      <Card className="print:shadow-none print:border-none">
        <CardHeader>
          <CardTitle className="text-xl">カテゴリ別スコア</CardTitle>
          <CardDescription>
            各カテゴリにおけるあなたのスコア、業界平均、前回スコアの比較です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryChartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.categoryScores} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                 <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="score" fill="var(--color-score)" radius={4} barSize={20} />
                <Bar dataKey="average" fill="var(--color-average)" radius={4} barSize={20} />
                <Bar dataKey="previous" fill="var(--color-previous)" radius={4} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

       {/* Strengths and Weaknesses */}
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

      {/* Recommended Learning Resources */}
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
                <TableHead className="text-right print:hidden">リンク</TableHead>
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
                        <a href={rec.link} target="_blank" rel="noopener noreferrer">
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

      {/* Detailed Feedback */}
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

      {/* Future Review Placeholder */}
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
