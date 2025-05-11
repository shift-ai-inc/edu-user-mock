import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Printer,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

// 中央管理されたモックデータとタイプをインポート
import {
  SurveyStatus,
  SurveyType,
  QuestionType,
  mockSurveysList,
} from "@/data/mockSurveys";

// Helper functions
const getStatusBadgeStyle = (status: SurveyStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "expired":
      return "bg-red-100 text-red-800";
  }
};

const getStatusLabel = (status: SurveyStatus) => {
  switch (status) {
    case "active":
      return "実施中";
    case "draft":
      return "下書き";
    case "completed":
      return "完了";
    case "expired":
      return "期限切れ";
  }
};

const getTypeLabel = (type: SurveyType) => {
  switch (type) {
    case "engagement":
      return "エンゲージメント";
    case "feedback":
      return "フィードバック";
    case "satisfaction":
      return "満足度";
    case "assessment":
      return "アセスメント";
    case "other":
      return "その他";
  }
};

const getPriorityBadgeStyle = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
  }
};

const getPriorityLabel = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getQuestionTypeLabel = (type: QuestionType): string => {
  switch (type) {
    case "rating":
      return "評価尺度";
    case "text":
      return "自由記述";
    case "multiple":
      return "多肢選択";
    case "single":
      return "単一選択";
    case "boolean":
      return "はい/いいえ";
    default:
      return type;
  }
};

export default function SurveyDetailPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const surveyIdNum = parseInt(surveyId || "0");

  // mockSurveysListから該当するサーベイを検索
  const survey = mockSurveysList.find((s) => s.id === surveyIdNum);

  if (!survey) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/surveys")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>サーベイが見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定されたIDのサーベイは見つかりませんでした。ID: {surveyId}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired =
    new Date(survey.expiresAt) < new Date() && survey.status !== "completed";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="outline"
        onClick={() => navigate("/surveys")}
        className="mb-6 print:hidden"
      >
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
            <Badge
              className={`${getStatusBadgeStyle(
                survey.status
              )} text-sm px-3 py-1`}
            >
              {getStatusLabel(survey.status)}
            </Badge>
          </div>
          {survey.isCompleted && (
            <Badge
              variant="outline"
              className="mt-2 text-xs bg-green-50 border-green-300 text-green-700 w-fit"
            >
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
              <strong>優先度:</strong>{" "}
              <Badge
                className={`${getPriorityBadgeStyle(
                  survey.priority
                )} px-2 py-0.5 text-xs`}
              >
                {getPriorityLabel(survey.priority)}
              </Badge>
            </div>
            <div>
              <strong>作成日:</strong> {formatDate(survey.createdAt)}
            </div>
            <div>
              <strong>期限:</strong> {formatDate(survey.expiresAt)}
              {isExpired && (
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
              {survey.questions.slice(0, 3).map((q) => (
                <li key={q.id}>
                  {q.text}{" "}
                  <Badge variant="outline" className="ml-1 text-xs">
                    {getQuestionTypeLabel(q.type)}
                  </Badge>
                </li>
              ))}
              {survey.questions.length > 3 && (
                <li>他 {survey.questions.length - 3}項目...</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          印刷
        </Button>

        {/* サーベイの状態によって表示するボタンを切り替え */}
        {survey.status === "active" && !survey.isCompleted && !isExpired ? (
          <>
            {/* 開始ボタンを追加 */}
            <Button
              variant="outline"
              onClick={() => navigate(`/surveys/take/${survey.id}`)}
            >
              サーベイを開始
            </Button>
            <Button
              variant="default"
              onClick={() => navigate(`/surveys/take/${survey.id}`)}
            >
              回答する
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => navigate(`/surveys/results/${survey.id}`)}
            disabled={
              survey.status === "draft" ||
              (survey.status === "expired" && survey.responsesCount === 0)
            }
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            結果を見る
          </Button>
        )}
      </div>
    </div>
  );
}
