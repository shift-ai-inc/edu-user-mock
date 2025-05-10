import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // Import Badge

// Define a type for the detailed assessment data
interface AssessmentDetailData {
  id: number;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  questionCount: number;
  status: "available" | "draft" | "archived" | "in-progress" | "completed";
  instructions: string;
  sections: Array<{ name: string; questionCount: number }>;
  version: string;
  lastUpdated: string;
  createdBy: string;
  tags?: string[];
}

// Mock data for all assessment details
// This list should ideally be fetched or come from a shared data source
const allMockDetailedAssessments: AssessmentDetailData[] = [
  {
    id: 101,
    title: "総合スキルアセスメント",
    description: "論理思考、コミュニケーション、問題解決能力などを総合的に評価します。",
    category: "スキル",
    estimatedTime: "約10分",
    questionCount: 10,
    status: "available",
    instructions: "このアセスメントは、あなたの総合的なスキルを測定することを目的としています。各質問に正直に答えてください。時間制限はありませんが、目安時間を参考にしてください。",
    sections: [
      { name: "論理思考", questionCount: 3 },
      { name: "コミュニケーション", questionCount: 4 },
      { name: "問題解決", questionCount: 3 },
    ],
    version: "1.2",
    lastUpdated: "2024-07-15",
    createdBy: "AI HR Solutions",
    tags: ["core-skills", "general"],
  },
  {
    id: 102,
    title: "パーソナリティ診断",
    description: "あなたの性格特性や行動傾向を分析します。",
    category: "パーソナリティ",
    estimatedTime: "約30分",
    questionCount: 80,
    status: "available",
    instructions: "このパーソナリティ診断は、あなたの内面的な特性を理解するのに役立ちます。リラックスして、直感に従って回答してください。",
    sections: [
      { name: "自己認識", questionCount: 20 },
      { name: "対人関係スタイル", questionCount: 20 },
      { name: "ストレス対処", questionCount: 20 },
      { name: "動機付け要因", questionCount: 20 },
    ],
    version: "1.0",
    lastUpdated: "2024-07-10",
    createdBy: "HR Analytics Inc.",
    tags: ["behavioral", "self-assessment"],
  },
  {
    id: 103,
    title: "リーダーシップ適性検査",
    description: "リーダーとしての潜在能力やスタイルを評価します。",
    category: "適性",
    estimatedTime: "約45分",
    questionCount: 100,
    status: "draft",
    instructions: "リーダーシップに関する様々なシナリオについて、あなたの考えや行動を選択してください。最適なリーダーシップスタイルを見つける手助けとなります。",
    sections: [
      { name: "意思決定", questionCount: 25 },
      { name: "チームマネジメント", questionCount: 25 },
      { name: "ビジョン設定", questionCount: 25 },
      { name: "変革推進", questionCount: 25 },
    ],
    version: "1.0",
    lastUpdated: "2024-07-20",
    createdBy: "Management Experts LLC",
    tags: ["leadership", "aptitude"],
  },
  {
    id: 104,
    title: "IT知識基礎テスト",
    description: "基本的なIT用語や概念の理解度を測ります。",
    category: "知識",
    estimatedTime: "約20分",
    questionCount: 50,
    status: "archived",
    instructions: "ITに関する基本的な知識を問うテストです。選択肢の中から最も適切と思われるものを選んでください。",
    sections: [
      { name: "ハードウェア", questionCount: 10 },
      { name: "ソフトウェア", questionCount: 15 },
      { name: "ネットワーク", questionCount: 15 },
      { name: "セキュリティ", questionCount: 10 },
    ],
    version: "0.9",
    lastUpdated: "2024-05-01",
    createdBy: "Tech Learning Co.",
    tags: ["it", "basic", "knowledge-check"],
  },
];

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const assessmentId = parseInt(id || "0");
  const assessment = allMockDetailedAssessments.find(a => a.id === assessmentId);

  if (!assessment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>アセスメントが見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定されたIDのアセスメントは見つかりませんでした。ID: {id}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadgeStyle = (status: AssessmentDetailData['status']) => {
    switch (status) {
      case "available": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "archived": return "bg-neutral-100 text-neutral-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AssessmentDetailData['status']) => {
    switch (status) {
      case "available": return "受験可能";
      case "in-progress": return "中断中";
      case "completed": return "完了済";
      case "draft": return "下書き";
      case "archived": return "アーカイブ済";
      default: return "不明";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate("/assessments")} className="mb-6 print:hidden">
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
            <Badge className={`${getStatusBadgeStyle(assessment.status)} text-sm px-3 py-1`}>
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
              <strong>最終更新日:</strong> {new Date(assessment.lastUpdated).toLocaleDateString('ja-JP')}
            </div>
            <div>
              <strong>作成者:</strong> {assessment.createdBy}
            </div>
            {assessment.tags && assessment.tags.length > 0 && (
              <div className="md:col-span-2">
                <strong>タグ:</strong> {assessment.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-1">{tag}</Badge>)}
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
          <p className="text-sm whitespace-pre-wrap">{assessment.instructions}</p>
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
          {assessment.status === "in-progress" ? "アセスメントを再開" : "アセスメントを開始"}
        </Button>
      </div>
    </div>
  );
}
