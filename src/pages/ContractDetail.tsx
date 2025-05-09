import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO, isBefore, startOfDay, isValid, format } from 'date-fns';
import { ja } from 'date-fns/locale';

// --- Mock Data (Should ideally be imported from a shared location) ---
const contracts = [
  {
    id: "CON-2023-001",
    companyName: "株式会社テクノロジーズ",
    plan: "エンタープライズ",
    startDate: "2023-04-01",
    endDate: "2025-03-31",
    status: "active", // Status will be calculated dynamically
    amount: "¥2,400,000",
    userCount: 500,
    notes: "年間契約、自動更新オプション付き。",
    contactPerson: "山田 太郎 (yamada.taro@tech.co.jp)",
  },
  {
    id: "CON-2023-002",
    companyName: "ABCコンサルティング",
    plan: "ビジネス",
    startDate: "2023-05-15",
    endDate: "2024-08-10",
    status: "active",
    amount: "¥1,200,000",
    userCount: 100,
    notes: "ユーザー数上限に注意。",
    contactPerson: "鈴木 次郎 (suzuki.jiro@abc.com)",
  },
  {
    id: "CON-2023-003",
    companyName: "グローバルメディア株式会社",
    plan: "スタンダード",
    startDate: "2024-06-01",
    endDate: "2024-07-25",
    status: "active",
    amount: "¥600,000",
    userCount: 50,
    notes: "短期契約、更新意思確認要。",
    contactPerson: "佐藤 花子 (sato.hanako@globalmedia.jp)",
  },
   {
    id: "CON-2024-004",
    companyName: "スタートアップX",
    plan: "スタンダード",
    startDate: "2024-07-01",
    endDate: "2024-07-15",
    status: "active",
    amount: "¥50,000",
    userCount: 10,
    notes: "トライアルからの移行。",
    contactPerson: "田中 一郎 (tanaka.ichiro@startupx.io)",
  },
  {
    id: "CON-2022-042",
    companyName: "フューチャーイノベーション",
    plan: "エンタープライズ",
    startDate: "2022-10-01",
    endDate: "2023-09-30",
    status: "expired",
    amount: "¥2,400,000",
    userCount: 450,
    notes: "契約終了済み。",
    contactPerson: "高橋 健太 (takahashi.kenta@future-inn.com)",
  },
  {
    id: "CON-2022-038",
    companyName: "スマートソリューションズ",
    plan: "ビジネス",
    startDate: "2022-08-15",
    endDate: "2023-08-14",
    status: "expired",
    amount: "¥1,200,000",
    userCount: 90,
    notes: "契約終了済み、再契約交渉中。",
    contactPerson: "伊藤 美咲 (ito.misaki@smartsol.jp)",
  },
];

type Contract = typeof contracts[0];

// --- Helper Functions (Should ideally be imported from a shared location) ---
const today = startOfDay(new Date());

const getExpiryStatus = (endDateString: string): { status: string; daysLeft?: number } => {
  const endDate = startOfDay(parseISO(endDateString));
  const daysDiff = differenceInDays(endDate, today);

  if (isBefore(endDate, today)) {
    return { status: "expired" };
  }
  if (daysDiff <= 7) {
    return { status: "expiring-7", daysLeft: daysDiff };
  }
  if (daysDiff <= 14) {
    return { status: "expiring-14", daysLeft: daysDiff };
  }
  if (daysDiff <= 30) {
    return { status: "expiring-30", daysLeft: daysDiff };
  }
  return { status: "active" };
};

const getStatusBadge = (statusInfo: { status: string; daysLeft?: number }) => {
  switch (statusInfo.status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 border border-green-300">有効</Badge>;
    case "expiring-7":
      return <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1"><AlertTriangle size={12} /> 残り{statusInfo.daysLeft}日</Badge>;
    case "expiring-14":
      return <Badge className="bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1"><AlertTriangle size={12} /> 残り{statusInfo.daysLeft}日</Badge>;
    case "expiring-30":
      return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1"><AlertTriangle size={12} /> 残り{statusInfo.daysLeft}日</Badge>;
    case "expired":
      return <Badge className="bg-gray-100 text-gray-800 border border-gray-300">期限切れ</Badge>;
    default:
      return <Badge>{statusInfo.status}</Badge>;
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '無効な日付';
    // Using ja locale for Japanese date format
    return format(date, 'PPP', { locale: ja }); // PPP gives 'yyyy年M月d日'
  } catch (e) {
    return 'フォーマットエラー';
  }
};

export default function ContractDetail() {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  // TODO: Replace with actual API call to fetch contract details by ID
  const contract = contracts.find(c => c.id === contractId);

  if (!contract) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定された契約は見つかりませんでした。</p>
            <Button onClick={() => navigate('/contracts')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getExpiryStatus(contract.endDate);

  return (
    <div className="p-8">
      <Button onClick={() => navigate('/contracts')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> 契約一覧に戻る
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">契約詳細: {contract.id}</CardTitle>
              <CardDescription>企業名: {contract.companyName}</CardDescription>
            </div>
            {/* TODO: Add Edit button later */}
            {/* <Button variant="outline">編集</Button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">プラン</h4>
              <p>{contract.plan}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">ステータス</h4>
              {getStatusBadge(statusInfo)}
            </div>
            <div>
              <h4 className="font-semibold mb-1">契約開始日</h4>
              <p>{formatDate(contract.startDate)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">契約終了日</h4>
              <p>{formatDate(contract.endDate)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">契約金額</h4>
              <p>{contract.amount}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">ユーザー数</h4>
              <p>{contract.userCount}</p>
            </div>
             <div>
              <h4 className="font-semibold mb-1">担当者連絡先</h4>
              <p>{contract.contactPerson || '未設定'}</p>
            </div>
          </div>
           <div className="mt-4">
              <h4 className="font-semibold mb-1">備考</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{contract.notes || 'なし'}</p>
            </div>

          {/* TODO: Add section for contract history or related documents */}
          {/* <div className="mt-6">
            <h4 className="font-semibold mb-2">契約履歴</h4>
            <p>ここに契約更新履歴などが表示されます...</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
