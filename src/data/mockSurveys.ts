// サーベイの質問タイプ
export type QuestionType =
  | "single"
  | "multiple"
  | "rating"
  | "text"
  | "boolean";

// サーベイのステータスタイプ
export type SurveyStatus = "active" | "draft" | "completed" | "expired";

// サーベイの種類タイプ
export type SurveyType =
  | "engagement"
  | "feedback"
  | "satisfaction"
  | "assessment"
  | "other";

// 質問オプション
export interface QuestionOption {
  id: number;
  text: string;
  nextQuestionId?: number; // 条件分岐用
}

// 質問データ型
export interface SurveyQuestion {
  id: number;
  text: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  minRating?: number;
  maxRating?: number;
}

// サーベイデータ型
export interface Survey {
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
  questions?: SurveyQuestion[];
  targetAudience?: string;
  createdBy?: string;
}

// サーベイの詳細データ型（TakeSurveyで使用）
export interface SurveyDetail {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  questions: SurveyQuestion[];
}

// モックのサーベイデータ
export const mockSurveysList: Survey[] = [
  {
    id: 1,
    title: "四半期エンゲージメント調査",
    description: "従業員エンゲージメントと職場環境に関する調査",
    status: "active",
    type: "engagement",
    createdAt: "2025-04-01T09:00:00Z",
    expiresAt: "2025-05-30T23:59:59Z",
    responsesCount: 87,
    completionRate: 68,
    priority: "high",
    estimatedTime: "10分",
    questions: [
      {
        id: 1,
        text: "あなたの所属部署を選択してください",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "営業部" },
          { id: 2, text: "マーケティング部" },
          { id: 3, text: "エンジニアリング部", nextQuestionId: 3 },
          { id: 4, text: "人事部" },
          { id: 5, text: "経営管理部" },
        ],
      },
      {
        id: 2,
        text: "勤続年数を選択してください",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "1年未満" },
          { id: 2, text: "1-3年" },
          { id: 3, text: "3-5年" },
          { id: 4, text: "5-10年" },
          { id: 5, text: "10年以上" },
        ],
      },
      {
        id: 3,
        text: "現在の職場環境にどの程度満足していますか？",
        description: "1（非常に不満）から5（非常に満足）の尺度でお答えください",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 4,
        text: "職場で最も価値を感じる側面はどれですか？（複数選択可）",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "給与・待遇" },
          { id: 2, text: "キャリア成長の機会" },
          { id: 3, text: "同僚との関係" },
          { id: 4, text: "仕事と生活のバランス" },
          { id: 5, text: "会社の使命・ビジョン" },
          { id: 6, text: "学習・成長の機会" },
        ],
      },
      {
        id: 5,
        text: "チームのコミュニケーションは効果的であると感じますか？",
        type: "boolean",
        required: true,
      },
      {
        id: 6,
        text: "職場環境や従業員エンゲージメントを向上させるための提案があれば教えてください。",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: 2,
    title: "リモートワーク満足度調査",
    description: "在宅勤務環境とツールに関するフィードバック",
    status: "active",
    type: "satisfaction",
    createdAt: "2025-04-05T14:30:00Z",
    expiresAt: "2025-05-15T23:59:59Z",
    responsesCount: 56,
    completionRate: 42,
    priority: "medium",
    estimatedTime: "5分",
    isCompleted: true,
    questions: [
      {
        id: 1,
        text: "リモートワークの頻度はどれくらいですか？",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "週5日（完全リモート）" },
          { id: 2, text: "週3-4日" },
          { id: 3, text: "週1-2日" },
          { id: 4, text: "月に数日程度" },
          { id: 5, text: "リモートワークはしていない" },
        ],
      },
      {
        id: 2,
        text: "現在のリモートワーク環境にどの程度満足していますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 3,
        text: "リモートワーク中に最も課題を感じる点は何ですか？（複数選択可）",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "コミュニケーションの難しさ" },
          { id: 2, text: "仕事とプライベートの境界があいまい" },
          { id: 3, text: "孤独感や孤立感" },
          { id: 4, text: "ネットワーク環境の問題" },
          { id: 5, text: "作業スペースの確保" },
          { id: 6, text: "モチベーションの維持" },
        ],
      },
      {
        id: 4,
        text: "リモートワークのメリットだと感じる点は何ですか？（複数選択可）",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "通勤時間の削減" },
          { id: 2, text: "集中できる環境での作業" },
          { id: 3, text: "柔軟な働き方" },
          { id: 4, text: "プライベートとの両立のしやすさ" },
          { id: 5, text: "自分のペースで働ける" },
        ],
      },
      {
        id: 5,
        text: "リモートワークに関する改善提案や要望があれば教えてください。",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: 3,
    title: "社内コミュニケーション評価",
    description: "部署間コミュニケーションと情報共有の効率性評価",
    status: "draft",
    type: "assessment",
    createdAt: "2025-04-10T11:15:00Z",
    expiresAt: "2025-05-20T23:59:59Z",
    responsesCount: 0,
    completionRate: 0,
    priority: "low",
    estimatedTime: "15分",
  },
  {
    id: 4,
    title: "新機能フィードバック調査",
    description: "最近導入した社内ツールの新機能に関するフィードバック",
    status: "active",
    type: "feedback",
    createdAt: "2025-04-12T16:45:00Z",
    expiresAt: "2025-06-05T23:59:59Z",
    responsesCount: 45,
    completionRate: 36,
    priority: "high",
    estimatedTime: "7分",
    questions: [
      {
        id: 1,
        text: "新機能についてどの程度理解していますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 2,
        text: "新機能を使用頻度はどれくらいですか？",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "毎日" },
          { id: 2, text: "週に数回" },
          { id: 3, text: "月に数回" },
          { id: 4, text: "ほとんど使用していない" },
          { id: 5, text: "全く使用していない" },
        ],
      },
      {
        id: 3,
        text: "新機能の使いやすさをどのように評価しますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 4,
        text: "新機能で最も役立つ部分はどこですか？",
        type: "text",
        required: true,
      },
      {
        id: 5,
        text: "新機能で改善が必要な部分はどこですか？",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: 5,
    title: "福利厚生満足度調査",
    description: "現在の福利厚生プログラムの評価と提案",
    status: "completed",
    type: "satisfaction",
    createdAt: "2025-03-01T10:30:00Z",
    expiresAt: "2025-03-31T23:59:59Z",
    responsesCount: 120,
    completionRate: 92,
    priority: "medium",
    estimatedTime: "8分",
    isCompleted: true,
  },
  {
    id: 6,
    title: "キャリア開発希望調査",
    description: "従業員のキャリア目標と必要なサポートに関する調査",
    status: "expired",
    type: "other",
    createdAt: "2025-02-15T09:00:00Z",
    expiresAt: "2025-03-15T23:59:59Z",
    responsesCount: 98,
    completionRate: 76,
    priority: "low",
    estimatedTime: "12分",
    isCompleted: true,
  },
  {
    id: 7,
    title: "職場環境改善調査",
    description: "オフィス環境やリモートワーク環境の改善に関する調査",
    status: "active",
    type: "feedback",
    createdAt: "2025-04-15T10:00:00Z",
    expiresAt: "2025-06-15T23:59:59Z",
    responsesCount: 23,
    completionRate: 18,
    priority: "medium",
    estimatedTime: "8分",
    questions: [
      {
        id: 1,
        text: "現在の職場環境（オフィスまたはリモート）で最も改善が必要な点は何ですか？",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "デスク/椅子などの什器" },
          { id: 2, text: "照明環境" },
          { id: 3, text: "オフィスの空調" },
          { id: 4, text: "防音/静かさ" },
          { id: 5, text: "リラックススペース" },
          { id: 6, text: "会議室の数や設備" },
        ],
      },
      {
        id: 2,
        text: "理想的な職場環境についてご意見をお聞かせください。",
        type: "text",
        required: true,
      },
      {
        id: 3,
        text: "現在のオフィスレイアウトにどの程度満足していますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
    ],
  },
  {
    id: 8,
    title: "チームビルディング調査",
    description: "チーム連携と協働に関する意識調査",
    status: "active",
    type: "engagement",
    createdAt: "2025-04-20T13:30:00Z",
    expiresAt: "2025-05-25T23:59:59Z",
    responsesCount: 42,
    completionRate: 31,
    priority: "high",
    estimatedTime: "7分",
    questions: [
      {
        id: 1,
        text: "チーム内でのコミュニケーションの頻度はどれくらいですか？",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "毎日複数回" },
          { id: 2, text: "毎日1回程度" },
          { id: 3, text: "週に2-3回" },
          { id: 4, text: "週に1回程度" },
          { id: 5, text: "月に数回以下" },
        ],
      },
      {
        id: 2,
        text: "チーム内で最も効果的なコミュニケーション手段は何ですか？",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "対面ミーティング" },
          { id: 2, text: "ビデオ会議" },
          { id: 3, text: "チャットツール" },
          { id: 4, text: "メール" },
          { id: 5, text: "電話" },
        ],
      },
      {
        id: 3,
        text: "チームの協力体制についてどの程度満足していますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
    ],
  },
  {
    id: 9,
    title: "テクノロジーニーズ調査",
    description: "業務効率化のための新しいツールやテクノロジーに関する要望調査",
    status: "active",
    type: "assessment",
    createdAt: "2025-04-25T09:45:00Z",
    expiresAt: "2025-06-10T23:59:59Z",
    responsesCount: 15,
    completionRate: 12,
    priority: "medium",
    estimatedTime: "10分",
    questions: [
      {
        id: 1,
        text: "業務で日常的に使用しているツールを教えてください（複数選択可）",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "Microsoft Office" },
          { id: 2, text: "Google Workspace" },
          { id: 3, text: "Slack/Teams等のチャットツール" },
          { id: 4, text: "プロジェクト管理ツール" },
          { id: 5, text: "CRM/顧客管理システム" },
          { id: 6, text: "その他のクラウドサービス" },
        ],
      },
      {
        id: 2,
        text: "現在の業務で最も時間がかかるタスクは何ですか？",
        type: "text",
        required: true,
      },
      {
        id: 3,
        text: "どのような新しいツールやテクノロジーがあれば業務が効率化されると思いますか？",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: 10,
    title: "メンタルヘルス調査",
    description: "職場でのストレスとメンタルヘルスに関する実態調査",
    status: "active",
    type: "satisfaction",
    createdAt: "2025-05-01T11:00:00Z",
    expiresAt: "2025-05-31T23:59:59Z",
    responsesCount: 30,
    completionRate: 24,
    priority: "high",
    estimatedTime: "12分",
    questions: [
      {
        id: 1,
        text: "現在の業務によるストレスレベルをどのように評価しますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 2,
        text: "主なストレス要因は何ですか？（複数選択可）",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "業務量" },
          { id: 2, text: "納期/期限" },
          { id: 3, text: "人間関係" },
          { id: 4, text: "評価/昇進に関する不安" },
          { id: 5, text: "ワークライフバランス" },
          { id: 6, text: "キャリアの不確実性" },
        ],
      },
      {
        id: 3,
        text: "ストレス解消のために会社でサポートしてほしいことはありますか？",
        type: "text",
        required: true,
      },
      {
        id: 4,
        text: "リフレッシュのために取り入れている習慣はありますか？",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: 11,
    title: "社内研修フィードバック",
    description: "最近実施した社内研修の効果と改善点に関する調査",
    status: "active",
    type: "feedback",
    createdAt: "2025-05-05T14:15:00Z",
    expiresAt: "2025-06-05T23:59:59Z",
    responsesCount: 8,
    completionRate: 6,
    priority: "low",
    estimatedTime: "5分",
    questions: [
      {
        id: 1,
        text: "参加した研修のカテゴリを選択してください",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "技術研修" },
          { id: 2, text: "マネジメント研修" },
          { id: 3, text: "コミュニケーション研修" },
          { id: 4, text: "コンプライアンス研修" },
          { id: 5, text: "その他" },
        ],
      },
      {
        id: 2,
        text: "研修の内容はどの程度役立ちましたか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 3,
        text: "研修で特に良かった点を教えてください",
        type: "text",
        required: true,
      },
      {
        id: 4,
        text: "研修の改善点があれば教えてください",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: 12,
    title: "1on1ミーティング評価",
    description: "定期的な1on1ミーティングの効果と改善点に関する調査",
    status: "active",
    type: "assessment",
    createdAt: "2025-05-08T10:30:00Z",
    expiresAt: "2025-06-08T23:59:59Z",
    responsesCount: 12,
    completionRate: 9,
    priority: "medium",
    estimatedTime: "7分",
    questions: [
      {
        id: 1,
        text: "1on1ミーティングの頻度はどれくらいですか？",
        type: "single",
        required: true,
        options: [
          { id: 1, text: "毎週" },
          { id: 2, text: "隔週" },
          { id: 3, text: "月1回" },
          { id: 4, text: "不定期" },
          { id: 5, text: "実施していない" },
        ],
      },
      {
        id: 2,
        text: "1on1ミーティングの効果をどのように評価しますか？",
        type: "rating",
        required: true,
        minRating: 1,
        maxRating: 5,
      },
      {
        id: 3,
        text: "1on1ミーティングで最も価値を感じる点は何ですか？",
        type: "multiple",
        required: true,
        options: [
          { id: 1, text: "キャリア相談の機会" },
          { id: 2, text: "業務上の問題解決" },
          { id: 3, text: "フィードバックの授受" },
          { id: 4, text: "信頼関係の構築" },
          { id: 5, text: "ビジョンや目標の共有" },
        ],
      },
      {
        id: 4,
        text: "1on1ミーティングの改善点があれば教えてください",
        type: "text",
        required: false,
      },
    ],
  },
];
