import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { mockAssessmentDetails } from "@/data/mockAssessmentDetails";

// Define a type for the detailed assessment data
interface AssessmentDetailData {
  id: number;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  questionCount: number;
  status:
    | "available"
    | "draft"
    | "archived"
    | "in-progress"
    | "completed"
    | "active";
  instructions: string;
  sections: Array<{ name: string; questionCount: number }>;
  version: string;
  lastUpdated: string;
  createdBy: string;
  tags?: string[];
}

export default function AssessmentDetailPage() {
  // Change parameter name to match route definition in main.tsx
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  // Debug logs to understand what's happening
  console.log("Requested ID:", assessmentId);
  console.log(
    "Available IDs:",
    mockAssessmentDetails.map((a) => a.id)
  );

  // idはstring型なので、モックデータのid（number型）と比較するために数値変換
  const parsedId = parseInt(assessmentId || "0", 10);
  const assessment = mockAssessmentDetails.find((a) => a.id === parsedId);

  // Log the result of the find operation
  console.log(
    "Found assessment:",
    assessment ? `${assessment.id} - ${assessment.title}` : "Not found"
  );

  if (!assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/assessments")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          アセスメント一覧に戻る
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>アセスメントが見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              指定されたIDのアセスメントは見つかりませんでした。ID:{" "}
              {assessmentId}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadgeStyle = (status: AssessmentDetailData["status"]) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-neutral-100 text-neutral-800";
      case "active":
        return "bg-blue-200 text-blue-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AssessmentDetailData["status"]) => {
    switch (status) {
      case "available":
        return "受験可能";
      case "in-progress":
        return "中断中";
      case "completed":
        return "完了済";
      case "draft":
        return "下書き";
      case "archived":
        return "アーカイブ済";
      case "active":
        return "アクティブ";
      default:
        return "不明";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="outline"
        onClick={() => navigate("/assessments")}
        className="mb-6 print:hidden"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        アセスメント一覧に戻る
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </div>
            <Badge
              className={`${getStatusBadgeStyle(
                assessment.status
              )} text-sm px-3 py-1`}
            >
              {getStatusLabel(assessment.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>カテゴリ:</strong> {assessment.category}
            </div>
            <div>
              <strong>目安時間:</strong> {assessment.estimatedTime}
            </div>
            <div>
              <strong>問題数:</strong> {assessment.questionCount} 問
            </div>
            <div>
              <strong>バージョン:</strong> {assessment.version}
            </div>
            <div>
              <strong>最終更新日:</strong>{" "}
              {new Date(assessment.lastUpdated).toLocaleDateString("ja-JP")}
            </div>
            <div>
              <strong>作成者:</strong> {assessment.createdBy}
            </div>
            {assessment.tags && assessment.tags.length > 0 && (
              <div className="md:col-span-2">
                <strong>タグ:</strong>{" "}
                {assessment.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="mr-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>アセスメント手順</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">
            {assessment.instructions}
          </p>
        </CardContent>
      </Card>

      {assessment.sections && assessment.sections.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>セクション構成</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {assessment.sections.map((section, index) => (
                <li key={index}>
                  {section.name} ({section.questionCount} 問)
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2 print:hidden">
        <Button
          onClick={() => navigate(`/assessments/take/${assessment.id}`)}
          // The disabled prop is removed to make the button always active
        >
          {assessment.status === "in-progress"
            ? "アセスメントを再開"
            : "アセスメントを開始"}
        </Button>
      </div>
    </div>
  );
}
