import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Plus,
  Mail,
  BarChart3,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils"; // Import cn

// サンプルデータ (SurveyDetail.tsx と同じものを使用)
const surveys = [
  {
    id: "SUR-2023-001",
    title: "従業員満足度調査 2023前期",
    targetCompany: "株式会社テクノロジーズ",
    respondents: 82,
    targetCount: 120,
    startDate: "2023-04-10",
    endDate: "2023-04-24",
    status: "completed",
  },
  {
    id: "SUR-2023-002",
    title: "組織風土調査",
    targetCompany: "ABCコンサルティング",
    respondents: 45,
    targetCount: 50,
    startDate: "2023-05-15",
    endDate: "2023-05-29",
    status: "active",
  },
  {
    id: "SUR-2023-003",
    title: "リモートワーク実態調査",
    targetCompany: "グローバルメディア株式会社",
    respondents: 28,
    targetCount: 100,
    startDate: "2023-06-01",
    endDate: "2023-06-15",
    status: "active",
  },
  {
    id: "SUR-2023-004",
    title: "マネジメント評価サーベイ",
    targetCompany: "フューチャーイノベーション",
    respondents: 0,
    targetCount: 35,
    startDate: "2023-07-01",
    endDate: "2023-07-15",
    status: "scheduled",
  },
  {
    id: "SUR-2023-005",
    title: "1on1フィードバックサーベイ",
    targetCompany: "スマートソリューションズ",
    respondents: 0,
    targetCount: 60,
    startDate: "2023-07-10",
    endDate: "2023-07-24",
    status: "draft",
  },
];

export default function Surveys() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewDialog, setShowNewDialog] = useState(false);

  // ステータスによるフィルタリング
  const filteredSurveys = surveys.filter((survey) => {
    // タブによるフィルタリング
    if (activeTab !== "all" && survey.status !== activeTab) {
      return false;
    }

    // 検索語によるフィルタリング
    return (
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.targetCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 進捗率の計算
  const calculateProgress = (respondents: number, targetCount: number) => {
    if (targetCount === 0) return 0; // Avoid division by zero
    return Math.round((respondents / targetCount) * 100);
  };

  // ステータスバッジのスタイル
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">実施中</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">予定</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">完了</Badge>;
      case "draft":
        return <Badge variant="outline">下書き</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Row click handler
  const handleRowClick = (surveyId: string) => {
    navigate(`/surveys/detail/${surveyId}`);
  };


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">サーベイ管理</h1>
          <p className="text-gray-500 mt-1">企業向けサーベイの配信と結果管理</p>
        </div>

        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              新規サーベイ作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新規サーベイの作成</DialogTitle>
              <DialogDescription>
                新しいサーベイの基本情報を入力してください。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  タイトル
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  placeholder="例: 従業員満足度調査 2023"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  対象企業
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="企業を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">株式会社テクノロジーズ</SelectItem>
                    <SelectItem value="abc">ABCコンサルティング</SelectItem>
                    <SelectItem value="global">
                      グローバルメディア株式会社
                    </SelectItem>
                    <SelectItem value="future">
                      フューチャーイノベーション
                    </SelectItem>
                    <SelectItem value="smart">
                      スマートソリューションズ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assessment" className="text-right">
                  アセスメント
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="使用するアセスメントを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leadership">
                      リーダーシップ能力診断
                    </SelectItem>
                    <SelectItem value="skill">エンジニアスキル評価</SelectItem>
                    <SelectItem value="culture">組織文化サーベイ</SelectItem>
                    <SelectItem value="management">
                      マネジメントスキル診断
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  開始日
                </Label>
                <Input id="startDate" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  終了日
                </Label>
                <Input id="endDate" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetCount" className="text-right">
                  対象人数
                </Label>
                <Input id="targetCount" type="number" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                キャンセル
              </Button>
              <Button type="submit">作成</Button> {/* TODO: Implement form submission */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="active">実施中</TabsTrigger>
            <TabsTrigger value="scheduled">予定</TabsTrigger>
            <TabsTrigger value="completed">完了</TabsTrigger>
            <TabsTrigger value="draft">下書き</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="サーベイを検索..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
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
                    <TableHead>対象企業</TableHead>
                    <TableHead>期間</TableHead>
                    <TableHead>回答状況</TableHead>
                    <TableHead>ステータス</TableHead>
                    {/* <TableHead className="w-[100px]">アクション</TableHead> */} {/* Removed Action column */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurveys.map((survey) => (
                    <TableRow
                      key={survey.id}
                      onClick={() => handleRowClick(survey.id)} // Add onClick handler
                      className="cursor-pointer hover:bg-gray-50" // Add cursor and hover effect
                    >
                      <TableCell className="font-medium">{survey.id}</TableCell>
                      <TableCell>{survey.title}</TableCell>
                      <TableCell>{survey.targetCompany}</TableCell>
                      <TableCell>
                        {formatDate(survey.startDate)} 〜{" "}
                        {formatDate(survey.endDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-sm">
                            <span>
                              {survey.respondents}/{survey.targetCount}人
                            </span>
                            <span>
                              {calculateProgress(
                                survey.respondents,
                                survey.targetCount
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={calculateProgress(
                              survey.respondents,
                              survey.targetCount
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(survey.status)}</TableCell>
                      {/* Removed Action Cell */}
                      {/*
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             // Add stopPropagation to prevent row click when clicking the button
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>アクション</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              結果閲覧
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Mail className="mr-2 h-4 w-4" />
                              リマインド送信
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Calendar className="mr-2 h-4 w-4" />
                              日程変更
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Users className="mr-2 h-4 w-4" />
                              対象者管理
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {survey.status === "draft" && (
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>公開する</DropdownMenuItem>
                            )}
                            {(survey.status === "active" ||
                              survey.status === "scheduled") && (
                              <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                                中止する
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
             {/* Add Footer if needed, e.g., for pagination */}
             {/*
             <CardFooter className="flex items-center justify-between border-t bg-white px-6 py-3">
               <div className="text-xs text-muted-foreground">
                 全 {filteredSurveys.length} 件
               </div>
               {/* Add Pagination Controls Here if using pagination */}
             {/* </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>

      {/* 実施中のサーベイのサマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              実施中のサーベイ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{surveys.filter(s => s.status === 'active').length}</div>
            <p className="text-sm text-gray-500 mt-1">
              {surveys.filter(s => s.status === 'active').length}つのサーベイが現在実施中です
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-500" />
              総回答者数 (実施中)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {surveys.filter(s => s.status === 'active').reduce((sum, s) => sum + s.respondents, 0)}
            </div>
            <p className="text-sm text-gray-500 mt-1">現在実施中のサーベイの総回答者数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
              平均回答率 (実施中)
            </CardTitle>
          </CardHeader>
          <CardContent>
             {(() => {
                const activeSurveys = surveys.filter(s => s.status === 'active');
                const totalRespondents = activeSurveys.reduce((sum, s) => sum + s.respondents, 0);
                const totalTarget = activeSurveys.reduce((sum, s) => sum + s.targetCount, 0);
                const avgRate = totalTarget > 0 ? Math.round((totalRespondents / totalTarget) * 100) : 0;
                return (
                  <>
                    <div className="text-3xl font-bold">{avgRate}%</div>
                    <p className="text-sm text-gray-500 mt-1">現在実施中のサーベイの平均回答率</p>
                  </>
                );
             })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
