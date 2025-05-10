import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Plus,
  Copy,
  BarChart3,
  Edit,
  Eye,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";

// サンプルデータ (Add more fields based on AddAssessment form)
const assessments = [
  {
    id: "ASS-001",
    title: "リーダーシップ能力診断",
    type: "能力診断", // Corresponds to category
    questions: 45, // Should reflect latest version count ideally
    companies: 8,
    status: "published", // Changed to match new status values
    createdAt: "2023-02-15",
    difficulty: "medium",
    estimatedTime: 60,
    targetSkillLevel: "intermediate",
    version: 3, // Reflect latest version number
  },
  {
    id: "ASS-002",
    title: "エンジニアスキル評価",
    type: "スキル評価",
    questions: 60,
    companies: 12,
    status: "published",
    createdAt: "2023-03-10",
    difficulty: "hard",
    estimatedTime: 90,
    targetSkillLevel: "advanced",
    version: 2,
  },
  {
    id: "ASS-003",
    title: "組織文化サーベイ",
    type: "組織診断",
    questions: 30,
    companies: 15,
    status: "published",
    createdAt: "2023-04-22",
    difficulty: "easy",
    estimatedTime: 30,
    targetSkillLevel: "beginner",
    version: 1,
  },
  {
    id: "ASS-004",
    title: "マネジメントスキル診断",
    type: "能力診断",
    questions: 40,
    companies: 6,
    status: "draft",
    createdAt: "2023-06-05",
    difficulty: "medium",
    estimatedTime: 50,
    targetSkillLevel: "intermediate",
    version: 1,
  },
  {
    id: "ASS-005",
    title: "コミュニケーション適性テスト",
    type: "適性検査",
    questions: 35,
    companies: 0,
    status: "archived", // Keep archived for filtering example
    createdAt: "2022-11-30",
    difficulty: "easy",
    estimatedTime: 25,
    targetSkillLevel: "beginner",
    version: 1,
  },
];

// サンプル設問データ (Keep for potential future use in detail view)
// const questions = [ ... ]; // Keep commented out or remove if not used here

export default function Assessments() {
  const navigate = useNavigate(); // Initialize navigate
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // 検索フィルタリング
  const filteredAssessments = assessments.filter((assessment) => {
    // タブによるフィルタリング
    if (activeTab !== "all" && assessment.status !== activeTab) {
      if (activeTab === 'archived' && assessment.status === 'archived') {
         // keep going
      } else if (activeTab !== assessment.status) {
        return false;
      }
    }
    // 検索語によるフィルタリング
    return (
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ステータスに応じたバッジのスタイル
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return <Badge variant="default">公開中</Badge>;
      case "draft": return <Badge variant="outline">下書き</Badge>;
      case "archived": return <Badge variant="secondary">アーカイブ</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  const handleAddNew = () => {
    navigate('/assessments/add');
  };

  // Navigate to the detail page
  const handleViewDetails = (assessmentId: string) => {
    navigate(`/assessments/detail/${assessmentId}`);
  };

  // Navigate to the edit page
  const handleEdit = (assessmentId: string) => {
    navigate(`/assessments/edit/${assessmentId}`);
  };

  // Row click handler (still navigates to details)
  const handleRowClick = (assessmentId: string, event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
     // Prevent navigation if clicking on interactive elements like buttons, dropdown triggers etc.
     const target = event.target as HTMLElement;
     if (
       target.closest('button, [role="button"], [role="menuitem"], [data-state="open"]')
     ) {
       return;
     }
     handleViewDetails(assessmentId);
   };


  // Placeholder actions
  const handleAnalyzeResults = (assessmentId: string) => {
    console.log("Navigate to results analysis for:", assessmentId);
    // navigate(`/assessments/${assessmentId}/results`);
  };
  const handleDuplicate = (assessmentId: string) => {
    console.log("Duplicate assessment:", assessmentId);
  };


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">アセスメント管理</h1>
          <p className="text-gray-500 mt-1">企業に提供するアセスメントの作成と管理</p>
        </div>
        <Button className="flex items-center gap-1" onClick={handleAddNew}>
          <Plus size={16} />
          新規アセスメント作成
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="published">公開中</TabsTrigger>
            <TabsTrigger value="draft">下書き</TabsTrigger>
            <TabsTrigger value="archived">アーカイブ</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="アセスメントを検索..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* TODO: Implement Filter */}
            {/* <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>設問数</TableHead>
                    <TableHead>最新Ver.</TableHead> {/* Added Version Column */}
                    <TableHead>ステータス</TableHead>
                    <TableHead>作成/更新日</TableHead> {/* Changed Label */}
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={8} className="h-24 text-center"> {/* Increased colSpan */}
                         該当するアセスメントが見つかりません。
                       </TableCell>
                     </TableRow>
                   ) : (
                    filteredAssessments.map((assessment) => (
                      <TableRow
                        key={assessment.id}
                        onClick={(e) => handleRowClick(assessment.id, e)} // Add onClick handler
                        className="cursor-pointer hover:bg-muted/50" // Add hover effect
                      >
                        <TableCell className="font-medium">{assessment.id}</TableCell>
                        <TableCell>{assessment.title}</TableCell>
                        <TableCell>{assessment.type}</TableCell>
                        <TableCell>{assessment.questions}</TableCell>
                        <TableCell>v{assessment.version}</TableCell> {/* Display Version */}
                        <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        <TableCell>{formatDate(assessment.createdAt)}</TableCell> {/* Show creation date for now */}
                        <TableCell>
                          <TooltipProvider delayDuration={0}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                {/* Stop propagation to prevent row click when opening menu */}
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>アクション</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(assessment.id); }}> {/* Stop propagation */}
                                  <Eye className="mr-2 h-4 w-4" />
                                  詳細表示
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(assessment.id); }}> {/* Stop propagation */}
                                  <Edit className="mr-2 h-4 w-4" />
                                  編集
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAnalyzeResults(assessment.id); }}> {/* Stop propagation */}
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  結果分析
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(assessment.id); }}> {/* Stop propagation */}
                                  <Copy className="mr-2 h-4 w-4" />
                                  複製
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
             {/* TODO: Add Pagination if needed */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
