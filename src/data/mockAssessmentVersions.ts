import { AssessmentVersion, AssessmentBaseInfo } from '@/types/assessment-version';

// Mock data for basic assessment information
// In a real app, this might come from a different endpoint or be combined
const mockAssessments: AssessmentBaseInfo[] = [
  {
    id: "ASS-001",
    title: "リーダーシップ能力診断",
    category: "ソフトスキル",
    difficulty: "中級",
    estimatedTime: 30,
    targetSkillLevel: "チームリーダー候補",
    status: "active", // Reflects the latest active version's status
    createdAt: "2023-01-05T09:00:00Z",
    description: "チームを効果的に導くためのリーダーシップスキルを評価します。"
  },
  {
    id: "ASS-002",
    title: "エンジニアスキル評価 (バックエンド)",
    category: "技術スキル",
    difficulty: "中級",
    estimatedTime: 60,
    targetSkillLevel: "中堅エンジニア",
    status: "active",
    createdAt: "2023-02-20T11:00:00Z",
    description: "バックエンド開発に必要な基本的な知識と応用力を測定します。"
  },
  {
    id: "ASS-003",
    title: "新人向けビジネスマナーテスト",
    category: "基礎知識",
    difficulty: "初級",
    estimatedTime: 15,
    targetSkillLevel: "新入社員",
    status: "draft", // No active version yet
    createdAt: "2023-04-01T15:30:00Z",
    description: "社会人としての基本的なビジネスマナーの理解度を確認します。"
  },
];


// Mock data for assessment versions, keyed by assessmentId
export const mockAssessmentVersions: Record<string, AssessmentVersion[]> = {
  "ASS-001": [
    {
      id: "V1", assessmentId: "ASS-001", versionNumber: 1, status: "archived",
      createdAt: "2023-01-10T10:00:00Z", updatedAt: "2023-05-10T10:00:00Z"
    },
    {
      id: "V2", assessmentId: "ASS-001", versionNumber: 2, status: "archived",
      createdAt: "2023-05-15T11:00:00Z", updatedAt: "2024-01-15T11:00:00Z"
    },
    {
      id: "V3", assessmentId: "ASS-001", versionNumber: 3, status: "active",
      createdAt: "2024-01-20T09:00:00Z", updatedAt: "2024-01-25T14:30:00Z"
    },
     {
      id: "V4-draft", assessmentId: "ASS-001", versionNumber: 4, status: "draft",
      createdAt: "2024-07-20T10:00:00Z", updatedAt: "2024-07-20T10:00:00Z"
    },
  ],
  "ASS-002": [
    {
      id: "V1", assessmentId: "ASS-002", versionNumber: 1, status: "archived",
      createdAt: "2023-03-01T14:00:00Z", updatedAt: "2023-07-30T14:00:00Z"
    },
    {
      id: "V2", assessmentId: "ASS-002", versionNumber: 2, status: "active",
      createdAt: "2023-08-01T15:00:00Z", updatedAt: "2023-08-10T16:00:00Z"
    },
  ],
  "ASS-003": [
     {
      id: "V1-draft", assessmentId: "ASS-003", versionNumber: 1, status: "draft",
      createdAt: "2023-04-05T10:00:00Z", updatedAt: "2023-04-05T10:00:00Z"
    },
  ],
  // Add more mock versions for other assessments as needed
};

// Helper function to find basic assessment info by ID
// *** Added export keyword here ***
export const findAssessmentById = (assessmentId: string): AssessmentBaseInfo | undefined => {
  return mockAssessments.find(assessment => assessment.id === assessmentId);
};
