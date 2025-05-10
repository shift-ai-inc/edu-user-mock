import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Building, Users, Calendar } from 'lucide-react';

// サンプルデータ (本来はAPIから取得)
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
    description: "前期の従業員満足度を測るためのサーベイです。",
    assessmentUsed: "従業員満足度アセスメント v1.2",
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
    description: "現在の組織風土に関する意識調査。",
    assessmentUsed: "組織文化サーベイ v2.0",
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
    description: "リモートワークの運用状況と課題を把握するための調査。",
    assessmentUsed: "リモートワーク環境評価 v1.0",
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
    description: "管理職のマネジメントスキルに関する評価サーベイ。",
    assessmentUsed: "マネジメントスキル診断 v3.1",
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
    description: "1on1ミーティングの効果測定と改善のためのフィードバック収集。",
    assessmentUsed: "1on1効果測定サーベイ v1.0",
  },
];


export default function SurveyDetail() {
  const { surveyId } = useParams<{ surveyId: string }>();
  // surveyId を使用してAPIから詳細データを取得する想定
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return <div className="p-8">サーベイが見つかりません。</div>;
  }

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
    if (targetCount === 0) return 0;
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

  const progress = calculateProgress(survey.respondents, survey.targetCount);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
          <p className="text-gray-500 mt-1">{survey.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600">ID: {survey.id}</span>
            {getStatusBadge(survey.status)}
          </div>
        </div>
        {/* TODO: Add Edit/Action buttons here later */}
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building className="mr-2 h-5 w-5 text-blue-500" />
              対象企業
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{survey.targetCompany}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-red-500" />
              実施期間
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{formatDate(survey.startDate)}</p>
            <p className="text-sm text-gray-500">から</p>
            <p className="text-lg">{formatDate(survey.endDate)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-500" />
              回答状況
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold mb-2">
              {survey.respondents} / {survey.targetCount} 人
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-right text-sm text-gray-500 mt-1">{progress}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>サーベイ詳細情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
             <h3 className="font-semibold text-gray-700">使用アセスメント</h3>
             <p>{survey.assessmentUsed}</p>
           </div>
           {/* TODO: Add more details like reminder settings, target groups etc. */}
           <div>
             <h3 className="font-semibold text-gray-700">リマインダー設定</h3>
             <p className="text-gray-500">未設定</p> {/* Placeholder */}
           </div>
           <div>
             <h3 className="font-semibold text-gray-700">配信対象</h3>
             <p className="text-gray-500">全従業員</p> {/* Placeholder */}
           </div>
        </CardContent>
      </Card>

      {/* TODO: Add sections for Results Overview, Respondent List, Email History etc. */}
       <Card>
        <CardHeader>
          <CardTitle>結果概要</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">サーベイ完了後に表示されます。</p>
        </CardContent>
      </Card>


    </div>
  );
}
