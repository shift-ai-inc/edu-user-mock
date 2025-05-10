import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
interface AssessmentResultSummary {
  id: number;
  title: string;
  completedDate: string;
  overallScore: number; // 0-100
  status: "Completed" | "Pending"; // Example status
}

// --- Mock Data Generation ---
const generateMockResultsList = (count: number): AssessmentResultSummary[] => {
  const results: AssessmentResultSummary[] = [];
  for (let i = 1; i <= count; i++) {
    const id = 100 + i; // Example IDs
    results.push({
      id: id,
      title: `総合スキルアセスメント #${i}`,
      completedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString("ja-JP"),
      overallScore: Math.floor(Math.random() * 41) + 60, // 60-100
      status: "Completed",
    });
  }
  return results.sort((a, b) => b.id - a.id); // Sort by ID descending
};

export default function AssessmentResultsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<AssessmentResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateMockResultsList(5); // Generate 5 mock results
        setResults(mockData);
      } catch (err) {
        console.error("アセスメント結果一覧の取得に失敗しました", err);
        setError("結果一覧の読み込みに失敗しました。");
        toast({
          title: "エラー",
          description: "結果一覧データの取得に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [toast]);

  const handleViewResult = (id: number) => {
    navigate(`/assessments/results/${id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">アセスメント結果一覧</h1>

      <Card>
        <CardHeader>
          <CardTitle>完了済みアセスメント</CardTitle>
          <CardDescription>
            過去に完了したアセスメントの結果を確認できます。
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
                完了済みのアセスメント結果はありません。
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アセスメント名</TableHead>
                  <TableHead>完了日</TableHead>
                  <TableHead className="text-center">総合スコア</TableHead>
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
                    <TableCell>{result.completedDate}</TableCell>
                    <TableCell className="text-center">
                      {result.status === "Completed" ? (
                        <span className="font-semibold">{result.overallScore}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={result.status === "Completed" ? "secondary" : "outline"}>
                        {result.status === "Completed" ? "完了" : "保留中"}
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
