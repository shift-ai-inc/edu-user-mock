import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Clock,
  ListChecks, // 質問数アイコン
  HelpCircle,
  ArrowUpDown,
  FileText, // アセスメントアイコン
  Filter, // フィルターアイコン (将来用)
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Select for filtering
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Pagination components

// アセスメントのステータスタイプ
type AssessmentStatus = "available" | "in-progress" | "completed" | "draft" | "archived";

// アセスメントのカテゴリタイプ (例)
type AssessmentCategory = "skill" | "personality" | "aptitude" | "knowledge" | "other";


// アセスメントリスト項目データ型
interface AssessmentListItem {
  id: number;
  title: string;
  description: string;
  status: AssessmentStatus;
  category: AssessmentCategory;
  estimatedTime: string; // 例: "約10分", "30分"
  questionCount: number;
  lastAttempted?: string; // 最終試行日時 (ISO string)
  createdAt: string; // 作成日時 (ISO string)
  updatedAt: string; // 更新日時 (ISO string)
  version?: string; // バージョン番号
  tags?: string[]; // タグ
}

// ローカルストレージ保存用データ型
interface SavedAssessmentData {
  assessmentId: number;
  answers: any[];
  currentQuestionIndex: number;
  elapsedTime: number;
  questionOrder: number[];
  savedAt: string;
  status?: "in-progress" | "completed"; // ローカルストレージ側でのステータス
}

// モックのアセスメントリストデータ
const mockAssessmentList: AssessmentListItem[] = [
  {
    id: 101,
    title: "総合スキルアセスメント",
    description: "論理思考、コミュニケーション、問題解決能力などを総合的に評価します。",
    status: "available",
    category: "skill",
    estimatedTime: "約10分",
    questionCount: 10,
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-07-10T14:30:00Z",
    version: "1.2",
    tags: ["core-skills", "general"],
  },
  {
    id: 102,
    title: "パーソナリティ診断",
    description: "あなたの性格特性や行動傾向を分析します。",
    status: "available",
    category: "personality",
    estimatedTime: "約30分",
    questionCount: 80,
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2024-07-05T11:00:00Z",
    tags: ["behavioral", "self-assessment"],
  },
  {
    id: 103,
    title: "リーダーシップ適性検査",
    description: "リーダーとしての潜在能力やスタイルを評価します。",
    status: "draft", // 下書き状態の例
    category: "aptitude",
    estimatedTime: "約45分",
    questionCount: 100,
    createdAt: "2024-07-20T16:00:00Z",
    updatedAt: "2024-07-20T16:00:00Z",
    version: "1.0",
  },
  {
    id: 104,
    title: "IT知識基礎テスト",
    description: "基本的なIT用語や概念の理解度を測ります。",
    status: "archived", // アーカイブ済みの例
    category: "knowledge",
    estimatedTime: "約20分",
    questionCount: 50,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    tags: ["it", "basic"],
  },
  {
    id: 105,
    title: "プロジェクトマネジメントスキル評価",
    description: "プロジェクト管理能力を評価します。",
    status: "available",
    category: "skill",
    estimatedTime: "約25分",
    questionCount: 40,
    createdAt: "2024-07-12T10:00:00Z",
    updatedAt: "2024-07-18T14:30:00Z",
    version: "1.1",
    tags: ["project-management", "skill"],
  },
  {
    id: 106,
    title: "カスタマーサービス応対テスト",
    description: "顧客対応スキルを測定します。",
    status: "in-progress",
    category: "skill",
    estimatedTime: "約15分",
    questionCount: 30,
    createdAt: "2024-07-05T09:00:00Z",
    updatedAt: "2024-07-15T11:00:00Z",
    tags: ["customer-service", "communication"],
  },
  {
    id: 107,
    title: "データ分析基礎能力テスト",
    description: "基本的なデータ分析能力を評価します。",
    status: "completed",
    category: "knowledge",
    estimatedTime: "約30分",
    questionCount: 60,
    createdAt: "2024-06-20T16:00:00Z",
    updatedAt: "2024-07-01T16:00:00Z",
    version: "1.0",
    tags: ["data-analysis", "basic"],
  },
];

const ITEMS_PER_PAGE = 5; // 1ページあたりのアイテム数

export default function AssessmentList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof AssessmentListItem>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        // APIからアセスメントリストを取得する想定
        // const fetchedList = await fetchAssessmentListApi();

        const updatedList = mockAssessmentList.map((assessment) => {
          const storageKey = `assessment_${assessment.id}`;
          const savedData = localStorage.getItem(storageKey);
          let currentStatus: AssessmentStatus = assessment.status; // APIからのステータスをデフォルトに

          if (savedData) {
            try {
              const parsed: SavedAssessmentData = JSON.parse(savedData);
              if (parsed && parsed.assessmentId === assessment.id) {
                if (parsed.status === "completed") {
                  currentStatus = "completed";
                } else if (parsed.status === "in-progress" && currentStatus !== "completed") {
                  // API側で既に完了済みなら、ローカルの中断中より優先
                  currentStatus = "in-progress";
                }
              }
            } catch (e) {
              console.error(`Failed to parse saved data for ${storageKey}:`, e);
              localStorage.removeItem(storageKey);
            }
          }
          return { ...assessment, status: currentStatus };
        });

        setAssessments(updatedList);
        setLoading(false);
      } catch (error) {
        console.error("アセスメントリストの取得に失敗しました", error);
        toast({
          title: "エラー",
          description: "アセスメントリストの取得に失敗しました。",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [toast]);

  const sortedAndFilteredAssessments = assessments
    .filter((assessment) => {
      const matchesSearch =
        searchTerm === "" ||
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assessment.category && assessment.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (assessment.tags && assessment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || assessment.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      if (sortField === "createdAt" || sortField === "updatedAt" || sortField === "lastAttempted") {
        const dateA = valA ? new Date(valA as string).getTime() : 0;
        const dateB = valB ? new Date(valB as string).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const totalPages = Math.ceil(sortedAndFilteredAssessments.length / ITEMS_PER_PAGE);
  const paginatedAssessments = sortedAndFilteredAssessments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/assessments/detail/${id}`);
  };
  
  const toggleSort = (field: keyof AssessmentListItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const getStatusBadgeStyle = (status: AssessmentStatus) => {
    switch (status) {
      case "available": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "in-progress": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "archived": return "bg-neutral-100 text-neutral-800 hover:bg-neutral-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusLabel = (status: AssessmentStatus) => {
    switch (status) {
      case "available": return "受験可能";
      case "in-progress": return "中断中";
      case "completed": return "完了済";
      case "draft": return "下書き";
      case "archived": return "アーカイブ済";
      default: return "不明";
    }
  };

  const getCategoryLabel = (category: AssessmentCategory) => {
    switch (category) {
      case "skill": return "スキル";
      case "personality": return "パーソナリティ";
      case "aptitude": return "適性";
      case "knowledge": return "知識";
      case "other": return "その他";
      default: return category;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ja-JP", { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Max number of page links to show (excluding prev/next/ellipsis)
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
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <FileText className="mr-2 h-6 w-6" />
            アセスメント一覧
          </CardTitle>
          <CardDescription>
            利用可能なアセスメントを確認し、受験を開始または再開します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="検索 (タイトル, 説明, カテゴリ, タグ)..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">フィルター:</p>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                <SelectItem value="available">受験可能</SelectItem>
                <SelectItem value="in-progress">中断中</SelectItem>
                <SelectItem value="completed">完了済</SelectItem>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="archived">アーカイブ済</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="カテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                <SelectItem value="skill">スキル</SelectItem>
                <SelectItem value="personality">パーソナリティ</SelectItem>
                <SelectItem value="aptitude">適性</SelectItem>
                <SelectItem value="knowledge">知識</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button variant="ghost" className="p-0 h-auto font-medium hover:bg-transparent" onClick={() => toggleSort("title")}>
                        タイトル {sortField === "title" && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-auto font-medium hover:bg-transparent" onClick={() => toggleSort("category")}>
                        カテゴリ {sortField === "category" && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" className="p-0 h-auto font-medium hover:bg-transparent" onClick={() => toggleSort("questionCount")}>
                        問題数 {sortField === "questionCount" && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      <Button variant="ghost" className="p-0 h-auto font-medium hover:bg-transparent" onClick={() => toggleSort("updatedAt")}>
                        最終更新 {sortField === "updatedAt" && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 h-auto font-medium hover:bg-transparent" onClick={() => toggleSort("status")}>
                        ステータス {sortField === "status" && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8">読み込み中...</TableCell></TableRow>
                  ) : paginatedAssessments.length > 0 ? (
                    paginatedAssessments.map((assessment) => (
                      <TableRow 
                        key={assessment.id} 
                        onClick={() => handleViewDetails(assessment.id)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          <div>{assessment.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 truncate max-w-xs hidden sm:block">
                            {assessment.description}
                          </div>
                          <div className="flex items-center gap-1 mt-1 md:hidden">
                            <ListChecks className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{assessment.questionCount} 問</span>
                            <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                            <span className="text-xs">{assessment.estimatedTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryLabel(assessment.category)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <ListChecks className="h-3 w-3 text-muted-foreground mr-1" />
                            {assessment.questionCount} 問
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {assessment.estimatedTime}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{formatDate(assessment.updatedAt)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeStyle(assessment.status)}>
                            {getStatusLabel(assessment.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <HelpCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-lg font-medium">アセスメントが見つかりません</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            条件に一致するアセスメントはありません。フィルターを変更してみてください。
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

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
        </CardContent>
      </Card>
    </div>
  );
}
