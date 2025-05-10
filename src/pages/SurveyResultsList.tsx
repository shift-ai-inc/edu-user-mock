import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Button import is removed as it's no longer used in the table
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react"; // Eye icon removed
import { useToast } from "@/hooks/use-toast";

// --- Mock Data Types ---
interface SurveyResultSummary {
  id: number;
  title: string;
  submittedDate: string;
  respondents: number;
  status: "Completed" | "Ongoing"; // Example status
}

// --- Mock Data Generation ---
const generateMockSurveyResultsList = (count: number): SurveyResultSummary[] => {
  const results: SurveyResultSummary[] = [];
  const titles = [
    "四半期エンゲージメント調査",
    "製品満足度フィードバック",
    "職場環境に関するアンケート",
    "新人研修効果測定",
    "福利厚生に関する意識調査",
  ];
  for (let i = 1; i <= count; i++) {
    const id = i; // Simple IDs for surveys
    results.push({
      id: id,
      title: `${titles[i % titles.length]} (${new Date().getFullYear()} Q${Math.ceil(i/2)})`, // Example title generation
      submittedDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("ja-JP"), // Submitted weeks ago
      respondents: Math.floor(Math.random() * 151) + 50, // 50-200 respondents
      status: "Completed",
    });
  }
  // Add one ongoing example (optional)
  // results.push({
  //   id: count + 1,
  //   title: "年末社員満足度調査",
  //   submittedDate: "-",
  //   respondents: 0,
  //   status: "Ongoing",
  // });
  return results.sort((a, b) => b.id - a.id); // Sort by ID descending
};

export default function SurveyResultsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<SurveyResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600)); // Slightly different delay
        const mockData = generateMockSurveyResultsList(5); // Generate 5 mock survey results
        setResults(mockData);
      } catch (err) {
        console.error("サーベイ結果一覧の取得に失敗しました", err);
        setError("結果一覧の読み込みに失敗しました。");
        toast({
          title: "エラー",
          description: "サーベイ結果一覧データの取得に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [toast]);

  const handleViewResult = (id: number) => {
    navigate(`/surveys/results/${id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">サーベイ結果一覧</h1>

      <Card>
        <CardHeader>
          <CardTitle>完了済みサーベイ</CardTitle>
          <CardDescription>
            過去に実施されたサーベイの結果を確認できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">読み込み中...</p>
            </div>
          ) : error ? (
             <div className="flex items-center justify-center py-10 text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          ) : results.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                完了済みのサーベイ結果はありません。
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サーベイ名</TableHead>
                  <TableHead>最終提出日</TableHead>
                  <TableHead className="text-center">回答者数</TableHead>
                  <TableHead className="text-center">ステータス</TableHead>
                  {/* Action column removed */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow 
                    key={result.id}
                    onClick={() => result.status === "Completed" && handleViewResult(result.id)}
                    className={result.status === "Completed" ? "cursor-pointer hover:bg-muted/50" : ""}
                  >
                    <TableCell className="font-medium">{result.title}</TableCell>
                    <TableCell>{result.submittedDate}</TableCell>
                    <TableCell className="text-center">
                      {result.respondents}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={result.status === "Completed" ? "secondary" : "outline"}>
                        {result.status === "Completed" ? "完了" : "実施中"}
                      </Badge>
                    </TableCell>
                    {/* Action cell removed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
