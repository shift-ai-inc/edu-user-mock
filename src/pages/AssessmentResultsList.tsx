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
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Pagination components

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
  // Simulate some pending results for variety if needed
  if (count > 5) {
    results[1].status = "Pending";
    results[1].overallScore = 0; // Pending usually means no score yet
    results[3].status = "Pending";
    results[3].overallScore = 0;
  }
  return results.sort((a, b) => b.id - a.id); // Sort by ID descending
};

const ITEMS_PER_PAGE = 5; // Number of items per page

export default function AssessmentResultsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [results, setResults] = useState<AssessmentResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = generateMockResultsList(12); // Generate 12 mock results for pagination
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; 
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage - halfMaxPages < 1) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfMaxPages > totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }
    
    if (startPage > 1) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    return items;
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
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>アセスメント名</TableHead>
                    <TableHead>完了日</TableHead>
                    <TableHead className="text-center">総合スコア</TableHead>
                    <TableHead className="text-center">ステータス</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.map((result) => (
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      {renderPaginationItems()}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
