import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Printer, BarChart3, CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";

// Re-define types and mock data or import if they were moved to a shared location
type SurveyStatus = "active" | "draft" | "completed" | "expired";
type SurveyType = "engagement" | "feedback" | "satisfaction" | "assessment" | "other";

interface Survey {
  id: number;
  title: string;
  description: string;
  status: SurveyStatus;
  type: SurveyType;
  createdAt: string;
  expiresAt: string;
  responsesCount: number;
  completionRate: number;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  isCompleted?: boolean;
  // Potentially more details for a detail page:
  questions?: Array<{ id: string; text: string; type: string }>; // Example
  targetAudience?: string; // Example
  createdBy?: string; // Example
}

const mockSurveys: Survey[] = [
  {
    id: 1,
    title: "四半期エンゲージメント調査",
    description: "従業員エンゲージメントと職場環境に関する調査です。皆様の率直なご意見をお聞かせください。",
    status: "active",
    type: "engagement",
    createdAt: "2025-04-01T09:00:00Z",
    expiresAt: "2025-05-10T23:59:59Z",
    responsesCount: 87,
    completionRate: 68,
    priority: "high",
    estimatedTime: "10分",
    targetAudience: "全従業員",
    createdBy: "人事部",
    questions: [ {id: "q1", text: "現在の業務に満足していますか？", type: "rating"}, {id: "q2", text: "職場環境について改善点はありますか？", type: "text"}]
  },
  {
    id: 2,
    title: "リモートワーク満足度調査",
    description: "在宅勤務環境とツールに関するフィードバックを収集し、今後の改善に役立てます。",
    status: "active",
    type: "satisfaction",
    createdAt: "2025-04-05T14:30:00Z",
    expiresAt: "2025-05-15T23:59:59Z",
    responsesCount: 56,
    completionRate: 42,
    priority: "medium",
    estimatedTime: "5分",
    isCompleted: true,
    targetAudience: "リモートワーク実施者",
    createdBy: "IT部門",
  },
  {
    id: 3,
    title: "社内コミュニケーション評価",
    description: "部署間コミュニケーションと情報共有の効率性評価を目的としたサーベイです。",
    status: "draft",
    type: "assessment",
    createdAt: "2025-04-10T11:15:00Z",
    expiresAt: "2025-05-20T23:59:59Z",
    responsesCount: 0,
    completionRate: 0,
    priority: "low",
    estimatedTime: "15分",
    createdBy: "経営企画室",
  },
  {
    id: 4,
    title: "新機能フィードバック調査",
    description: "最近導入した社内ツールの新機能に関するフィードバックを募集します。",
    status: "active",
    type: "feedback",
    createdAt: "2025-04-12T16:45:00Z",
    expiresAt: "2025-05-05T23:59:59Z",
    responsesCount: 45,
    completionRate: 36,
    priority: "high",
    estimatedTime: "7分",
    targetAudience: "全従業員",
    createdBy: "製品開発チーム",
  },
  {
    id: 5,
    title: "福利厚生満足度調査",
    description: "現在の福利厚生プログラムの評価と改善のための提案を募集します。",
    status: "completed",
    type: "satisfaction",
    createdAt: "2025-03-01T10:30:00Z",
    expiresAt: "2025-03-31T23:59:59Z",
    responsesCount: 120,
    completionRate: 92,
    priority: "medium",
    estimatedTime: "8分",
    isCompleted: true,
    createdBy: "人事部",
  },
  {
    id: 6,
    title: "キャリア開発希望調査",
    description: "従業員のキャリア目標と必要なサポートに関する調査を行い、育成プログラムの参考にします。",
    status: "expired",
    type: "other",
    createdAt: "2025-02-15T09:00:00Z",
    expiresAt: "2025-03-15T23:59:59Z",
    responsesCount: 98,
    completionRate: 76,
    priority: "low",
    estimatedTime: "12分",
    isCompleted: true,
    createdBy: "人材開発部",
  },
];


// Helper functions (copied from SurveyList or similar)
const getStatusBadgeStyle = (status: SurveyStatus) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "draft": return "bg-gray-100 text-gray-800";
    case "completed": return "bg-blue-100 text-blue-800";
    case "expired": return "bg-red-100 text-red-800";
  }
};

const getStatusLabel = (status: SurveyStatus) => {
  switch (status) {
    case "active": return "実施中";
    case "draft": return "下書き";
    case "completed": return "完了";
    case "expired": return "期限切れ";
  }
};

const getTypeLabel = (type: SurveyType) => {
  switch (type) {
    case "engagement": return "エンゲージメント";
    case "feedback": return "フィードバック";
    case "satisfaction": return "満足度";
    case "assessment": return "アセスメント";
    case "other": return "その他";
  }
};

const getPriorityBadgeStyle = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "low": return "bg-green-100 text-green-800";
  }
};

const getPriorityLabel = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high": return "高";
    case "medium": return "中";
    case "low": return "低";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};


export default function SurveyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surveyId = parseInt(id || "0");
  const survey = mockSurveys.find(s => s.id === surveyId);

  if (!survey) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => navigate("/surveys")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>サーベイが見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定されたIDのサーベイは見つかりませんでした。ID: {id}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(survey.expiresAt) < new Date();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate("/surveys")} className="mb-6 print:hidden">
        <ArrowLeft className="mr-2 h-4 w-4" />
        サーベイ一覧に戻る
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{survey.title}</CardTitle>
              <CardDescription>{survey.description}</CardDescription>
            </div>
            <Badge className={`${getStatusBadgeStyle(survey.status)} text-sm px-3 py-1`}>
              {getStatusLabel(survey.status)}
            </Badge>
          </div>
           {survey.isCompleted && (
            <Badge variant="outline" className="mt-2 text-xs bg-green-50 border-green-300 text-green-700 w-fit">
              <CheckCircle className="h-3 w-3 mr-1" />
              回答済み
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>種類:</strong> {getTypeLabel(survey.type)}
            </div>
            <div>
              <strong>優先度:</strong> <Badge className={`${getPriorityBadgeStyle(survey.priority)} px-2 py-0.5 text-xs`}>{getPriorityLabel(survey.priority)}</Badge>
            </div>
            <div>
              <strong>作成日:</strong> {formatDate(survey.createdAt)}
            </div>
            <div>
              <strong>期限:</strong> {formatDate(survey.expiresAt)}
              {isExpired && survey.status !== 'completed' && (
                <span className="ml-2 text-red-600 text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  期限切れ
                </span>
              )}
            </div>
            <div>
              <strong>回答数:</strong> {survey.responsesCount} 件
            </div>
            <div>
              <strong>回答率:</strong> {survey.completionRate}%
            </div>
            <div>
              <strong>目安時間:</strong> 
              <span className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                {survey.estimatedTime}
              </span>
            </div>
            {survey.targetAudience && (
              <div>
                <strong>対象者:</strong> {survey.targetAudience}
              </div>
            )}
            {survey.createdBy && (
              <div>
                <strong>作成者:</strong> {survey.createdBy}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {survey.questions && survey.questions.length > 0 && (
         <Card className="mb-6">
          <CardHeader>
            <CardTitle>サーベイ項目（一部抜粋）</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {survey.questions.slice(0, 3).map((q) => ( // Display first 3 questions as example
                <li key={q.id}>
                  {q.text} <Badge variant="outline" className="ml-1 text-xs">{q.type}</Badge>
                </li>
              ))}
              {survey.questions.length > 3 && <li>他 {survey.questions.length - 3}項目...</li>}
            </ul>
          </CardContent>
        </Card>
      )}


      <div className="flex justify-end gap-2 print:hidden">
        <Button 
          variant="outline"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          印刷
        </Button>
        {survey.status === "active" && !survey.isCompleted && !isExpired ? (
          <Button
            variant="default"
            onClick={() => navigate(`/surveys/take/${survey.id}`)}
          >
            回答する
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate(`/surveys/results/${survey.id}`)}
            disabled={survey.status === 'draft'}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            結果を見る
          </Button>
        )}
      </div>
    </div>
  );
}
