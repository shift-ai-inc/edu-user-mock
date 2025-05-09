import { AssessmentQuestion } from '@/types/assessment-question';

// Mock data for assessment questions, keyed by assessmentId and then versionId
export const mockAssessmentQuestions: Record<string, Record<string, AssessmentQuestion[]>> = {
  "ASS-001": { // リーダーシップ能力診断
    "V1": [
      {
        id: "Q-001-V1-1", assessmentId: "ASS-001", versionId: "V1", order: 1,
        text: "チームの目標達成のために最も重要だと思う要素は何ですか？", type: "single-choice",
        options: [ { id: "opt1", text: "明確な指示" }, { id: "opt2", text: "メンバー間の信頼関係" }, { id: "opt3", text: "個々のスキルアップ" }, { id: "opt4", text: "十分なリソース" } ],
        correctAnswer: "opt2", points: 10, createdAt: "2023-01-10T10:00:00Z", updatedAt: "2023-01-10T10:00:00Z"
      },
      {
        id: "Q-001-V1-2", assessmentId: "ASS-001", versionId: "V1", order: 2,
        text: "困難な状況でチームのモチベーションを維持するために、どのようなアプローチを取りますか？（複数選択可）", type: "multiple-choice",
        options: [ { id: "optA", text: "成功体験を共有する" }, { id: "optB", text: "個別に相談に乗る" }, { id: "optC", text: "目標の再設定を行う" }, { id: "optD", text: "プレッシャーをかける" } ],
        correctAnswer: ["optA", "optB", "optC"], points: 15, createdAt: "2023-01-10T10:05:00Z", updatedAt: "2023-01-10T10:05:00Z"
      },
      {
        id: "Q-001-V1-3", assessmentId: "ASS-001", versionId: "V1", order: 3,
        text: "あなたのリーダーシップスタイルを簡潔に説明してください。", type: "text",
        correctAnswer: undefined, // Text answers usually graded manually
        points: 20, createdAt: "2023-01-10T10:10:00Z", updatedAt: "2023-01-10T10:10:00Z"
      },
    ],
    "V2": [ // Assume V2 has slightly different questions or order
       {
        id: "Q-001-V2-1", assessmentId: "ASS-001", versionId: "V2", order: 1,
        text: "チームの目標達成のために最も重要だと思う要素は何ですか？ (V2)", type: "single-choice",
        options: [ { id: "opt1v2", text: "明確な指示系統" }, { id: "opt2v2", text: "メンバー間の信頼と協力" }, { id: "opt3v2", text: "個々の専門性向上" }, { id: "opt4v2", text: "潤沢な予算" } ],
        correctAnswer: "opt2v2", points: 10, createdAt: "2023-05-15T11:00:00Z", updatedAt: "2023-05-15T11:00:00Z"
      },
       {
        id: "Q-001-V2-2", assessmentId: "ASS-001", versionId: "V2", order: 2,
        text: "あなたのリーダーシップスタイルを簡潔に説明してください。(V2)", type: "text",
        correctAnswer: undefined, points: 15, createdAt: "2023-05-15T11:05:00Z", updatedAt: "2023-05-15T11:05:00Z"
      },
      {
        id: "Q-001-V2-3", assessmentId: "ASS-001", versionId: "V2", order: 3,
        text: "新しいプロジェクトを始める際、最初に行うべきことは何ですか？", type: "single-choice",
        options: [ { id: "optX", text: "メンバーへのタスク割り当て" }, { id: "optY", text: "リスク分析" }, { id: "optZ", text: "目標とスコープの明確化" } ],
        correctAnswer: "optZ", points: 10, createdAt: "2023-05-15T11:10:00Z", updatedAt: "2023-05-15T11:10:00Z"
      },
    ],
     "V3": [ // Assume V3 has more questions
       {
        id: "Q-001-V3-1", assessmentId: "ASS-001", versionId: "V3", order: 1,
        text: "チームの目標達成のために最も重要だと思う要素は何ですか？ (V3)", type: "single-choice",
        options: [ { id: "opt1v3", text: "明確な指示系統" }, { id: "opt2v3", text: "メンバー間の信頼と協力" }, { id: "opt3v3", text: "個々の専門性向上" }, { id: "opt4v3", text: "潤沢な予算" } ],
        correctAnswer: "opt2v3", points: 10, createdAt: "2024-01-20T09:00:00Z", updatedAt: "2024-01-20T09:00:00Z"
      },
       {
        id: "Q-001-V3-2", assessmentId: "ASS-001", versionId: "V3", order: 2,
        text: "あなたのリーダーシップスタイルを簡潔に説明してください。(V3)", type: "text",
        correctAnswer: undefined, points: 15, createdAt: "2024-01-20T09:05:00Z", updatedAt: "2024-01-20T09:05:00Z"
      },
      {
        id: "Q-001-V3-3", assessmentId: "ASS-001", versionId: "V3", order: 3,
        text: "新しいプロジェクトを始める際、最初に行うべきことは何ですか？ (V3)", type: "single-choice",
        options: [ { id: "optXv3", text: "メンバーへのタスク割り当て" }, { id: "optYv3", text: "リスク分析" }, { id: "optZv3", text: "目標とスコープの明確化" } ],
        correctAnswer: "optZv3", points: 10, createdAt: "2024-01-20T09:10:00Z", updatedAt: "2024-01-20T09:10:00Z"
      },
       {
        id: "Q-001-V3-4", assessmentId: "ASS-001", versionId: "V3", order: 4,
        text: "フィードバックを行う際に心がけていることは？（複数選択可）", type: "multiple-choice",
        options: [ { id: "optF1", text: "具体的であること" }, { id: "optF2", text: "人前ではなく個別に行うこと" }, { id: "optF3", text: "ポジティブな点も伝えること" }, { id: "optF4", text: "改善点を明確にすること" } ],
        correctAnswer: ["optF1", "optF2", "optF3", "optF4"], points: 15, createdAt: "2024-01-20T09:15:00Z", updatedAt: "2024-01-20T09:15:00Z"
      },
    ],
  },
  "ASS-002": { // エンジニアスキル評価
    "V1": [
       {
        id: "Q-002-V1-1", assessmentId: "ASS-002", versionId: "V1", order: 1,
        text: "SOLID原則の「L」は何を表しますか？", type: "single-choice",
        options: [ { id: "optS1", text: "単一責任の原則" }, { id: "optS2", text: "オープン/クローズドの原則" }, { id: "optS3", text: "リスコフの置換原則" }, { id: "optS4", text: "インターフェース分離の原則" } ],
        correctAnswer: "optS3", points: 10, createdAt: "2023-03-01T14:00:00Z", updatedAt: "2023-03-01T14:00:00Z"
      },
    ],
    "V2": [
       {
        id: "Q-002-V2-1", assessmentId: "ASS-002", versionId: "V2", order: 1,
        text: "SOLID原則の「L」は何を表しますか？ (V2)", type: "single-choice",
        options: [ { id: "optS1v2", text: "単一責任の原則" }, { id: "optS2v2", text: "オープン/クローズドの原則" }, { id: "optS3v2", text: "リスコフの置換原則" }, { id: "optS4v2", text: "インターフェース分離の原則" } ],
        correctAnswer: "optS3v2", points: 10, createdAt: "2023-08-01T15:00:00Z", updatedAt: "2023-08-01T15:00:00Z"
      },
       {
        id: "Q-002-V2-2", assessmentId: "ASS-002", versionId: "V2", order: 2,
        text: "REST APIの設計において冪等性が重要な理由を説明してください。", type: "text",
        correctAnswer: undefined, points: 15, createdAt: "2023-08-01T15:05:00Z", updatedAt: "2023-08-01T15:05:00Z"
      },
    ],
  },
  // Add more mock questions for other assessments/versions as needed
};

// Helper function to get questions for a specific assessment version
export const getQuestionsForVersion = (assessmentId: string, versionId: string): AssessmentQuestion[] => {
  return mockAssessmentQuestions[assessmentId]?.[versionId] ?? [];
};

// Helper function to find a specific question by ID
export const findQuestionById = (assessmentId: string, versionId: string, questionId: string): AssessmentQuestion | undefined => {
  const questions = getQuestionsForVersion(assessmentId, versionId);
  return questions.find(q => q.id === questionId);
};
