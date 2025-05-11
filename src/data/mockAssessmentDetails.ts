// アセスメント詳細データ型
export interface AssessmentDetailData {
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

export const mockAssessmentDetails: AssessmentDetailData[] = [
  {
    id: 101,
    title: "総合スキルアセスメント",
    description:
      "論理思考、コミュニケーション、問題解決能力などを総合的に評価します。",
    category: "スキル",
    estimatedTime: "約10分",
    questionCount: 10,
    status: "available",
    instructions:
      "このアセスメントは、あなたの総合的なスキルを測定することを目的としています。各質問に正直に答えてください。時間制限はありませんが、目安時間を参考にしてください。",
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
    instructions:
      "このパーソナリティ診断は、あなたの内面的な特性を理解するのに役立ちます。リラックスして、直感に従って回答してください。",
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
    instructions:
      "リーダーシップに関する様々なシナリオについて、あなたの考えや行動を選択してください。最適なリーダーシップスタイルを見つける手助けとなります。",
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
    instructions:
      "ITに関する基本的な知識を問うテストです。選択肢の中から最も適切と思われるものを選んでください。",
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
