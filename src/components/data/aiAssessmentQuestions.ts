// AI適性アセスメント用IRTパラメータ付き設問サンプル
export interface AIItem {
  id: string;
  text: string;
  a: number; // 識別力
  b: number; // 難易度
  c: number; // 当て推量
  options: { id: string; text: string }[];
  correctAnswer: string;
}

export const aiAssessmentQuestions: AIItem[] = [
  {
    id: "Q1",
    text: "AIとは何の略称ですか？",
    a: 1.2,
    b: -1.0,
    c: 0.2,
    options: [
      { id: "A", text: "Artificial Intelligence" },
      { id: "B", text: "Automatic Integration" },
      { id: "C", text: "Advanced Interface" },
      { id: "D", text: "Analog Input" },
    ],
    correctAnswer: "A",
  },
  {
    id: "Q2",
    text: "機械学習と深層学習の違いを説明してください。",
    a: 1.0,
    b: 0.0,
    c: 0.25,
    options: [
      {
        id: "A",
        text: "機械学習はルールベース、深層学習はニューラルネットワークを用いる",
      },
      { id: "B", text: "両者は同じ意味である" },
      { id: "C", text: "深層学習は機械学習の一分野である" },
      { id: "D", text: "機械学習は画像認識専用である" },
    ],
    correctAnswer: "C",
  },
  // ...（必要に応じて追加。50問例はIRT_CAT.md参照）
];
