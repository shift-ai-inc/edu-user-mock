import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed DropdownMenu imports as they are no longer needed
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  // Removed MoreHorizontal
  Download,
  FileText,
  Search,
  Filter,
  Plus,
  AlertTriangle, // For expiry warning icon
} from "lucide-react";
import { differenceInDays, parseISO, isBefore, startOfDay, isValid, format } from 'date-fns'; // Import date-fns functions
import { ja } from 'date-fns/locale'; // Import Japanese locale

// --- Mock Data Update ---
const contracts = [
  {
    id: "CON-2023-001",
    companyName: "株式会社テクノロジーズ",
    plan: "エンタープライズ",
    startDate: "2023-04-01",
    endDate: "2025-03-31", // Extended date
    status: "active", // Status will be calculated dynamically
    amount: "¥2,400,000",
    userCount: 500,
  },
  {
    id: "CON-2023-002",
    companyName: "ABCコンサルティング",
    plan: "ビジネス",
    startDate: "2023-05-15",
    endDate: "2024-08-10", // Near expiry (within 30 days from today - adjust if needed)
    status: "active",
    amount: "¥1,200,000",
    userCount: 100,
  },
  {
    id: "CON-2023-003",
    companyName: "グローバルメディア株式会社",
    plan: "スタンダード",
    startDate: "2024-06-01",
    endDate: "2024-07-25", // Very near expiry (within 14 days from today - adjust if needed)
    status: "active",
    amount: "¥600,000",
    userCount: 50,
  },
   {
    id: "CON-2024-004",
    companyName: "スタートアップX",
    plan: "スタンダード",
    startDate: "2024-07-01",
    endDate: "2024-07-15", // Imminent expiry (within 7 days from today - adjust if needed)
    status: "active",
    amount: "¥50,000",
    userCount: 10,
  },
  {
    id: "CON-2022-042",
    companyName: "フューチャーイノベーション",
    plan: "エンタープライズ",
    startDate: "2022-10-01",
    endDate: "2023-09-30", // Expired
    status: "expired",
    amount: "¥2,400,000",
    userCount: 450,
  },
  {
    id: "CON-2022-038",
    companyName: "スマートソリューションズ",
    plan: "ビジネス",
    startDate: "2022-08-15",
    endDate: "2023-08-14", // Expired
    status: "expired",
    amount: "¥1,200,000",
    userCount: 90,
  },
];
// --- End Mock Data Update ---

// --- Date & Status Logic ---
const today = startOfDay(new Date());

const getExpiryStatus = (endDateString: string): { status: string; daysLeft?: number } => {
  try {
    const endDate = startOfDay(parseISO(endDateString));
    if (!isValid(endDate)) return { status: "invalid_date" };

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
  } catch (e) {
    return { status: "invalid_date" };
  }
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
    case "invalid_date":
       return <Badge variant="destructive">無効な日付</Badge>;
    default:
      return <Badge>{statusInfo.status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "無効な日付";
    // Using ja locale for Japanese date format
    return format(date, 'PPP', { locale: ja }); // PPP gives 'yyyy年M月d日'
  } catch (e) {
    return "フォーマットエラー";
  }
};
// --- End Date & Status Logic ---


export default function Contracts() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  // Add state for new contract form (if needed for controlled inputs)
  // const [newContractData, setNewContractData] = useState({ ... });

  // 検索フィルタリング
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new contract (placeholder)
  const handleAddContract = () => {
    // TODO: Get data from dialog inputs and call API
    console.log("Adding new contract...");
    // Example: Get data from refs or state
    // const company = (document.getElementById('company') as HTMLInputElement)?.value;
    // ... get other fields
    setShowAddDialog(false); // Close dialog after submission
    // Show success toast
  };

  // Handle row click navigation
  const handleRowClick = (contractId: string) => {
    navigate(`/contracts/detail/${contractId}`);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">契約管理</h1>
          <p className="text-gray-500 mt-1">企業との契約情報を管理します</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download size={16} />
            エクスポート
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <FileText size={16} />
            レポート
          </Button>
          {/* --- New Contract Dialog --- */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                新規契約
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規契約の追加</DialogTitle>
                <DialogDescription>
                  新しい契約の詳細情報を入力してください
                </DialogDescription>
              </DialogHeader>
              {/* Consider using react-hook-form here for better validation */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    企業名
                  </Label>
                  {/* TODO: Use a Select or Autocomplete for existing companies */}
                  <Input id="company" placeholder="株式会社サンプル" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right">
                    プラン
                  </Label>
                   {/* TODO: Use a Select component */}
                  <Input id="plan" placeholder="スタンダード" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userCount" className="text-right">
                    ユーザー数
                  </Label>
                  <Input id="userCount" type="number" placeholder="50" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    開始日
                  </Label>
                  <Input id="startDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    終了日
                  </Label>
                  <Input id="endDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    契約金額
                  </Label>
                  <Input id="amount" placeholder="¥600,000" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  キャンセル
                </Button>
                {/* TODO: Add validation before submitting */}
                <Button type="submit" onClick={handleAddContract}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
           {/* --- End New Contract Dialog --- */}
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>契約一覧</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="企業名・契約ID・プランで検索..."
                  className="pl-8 w-[300px]" // Increased width
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* TODO: Implement filtering logic */}
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>契約ID</TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>プラン</TableHead>
                <TableHead>ユーザー数</TableHead> {/* Added User Count Header */}
                <TableHead>開始日</TableHead>
                <TableHead>終了日</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>契約金額</TableHead>
                {/* Removed Actions Header */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => {
                  const statusInfo = getExpiryStatus(contract.endDate);
                  return (
                    <TableRow
                      key={contract.id}
                      data-status={statusInfo.status} /* Optional: Add data attribute for potential row styling */
                      onClick={() => handleRowClick(contract.id)} // Add onClick handler
                      className="cursor-pointer hover:bg-gray-50" // Add cursor and hover effect
                    >
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.companyName}</TableCell>
                      <TableCell>{contract.plan}</TableCell>
                      <TableCell>{contract.userCount}</TableCell> {/* Added User Count Cell */}
                      <TableCell>{formatDate(contract.startDate)}</TableCell>
                      <TableCell>{formatDate(contract.endDate)}</TableCell>
                      <TableCell>{getStatusBadge(statusInfo)}</TableCell>
                      <TableCell>{contract.amount}</TableCell>
                      {/* Removed Actions Cell */}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center"> {/* Updated colSpan */}
                    契約が見つかりません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {/* TODO: Add Pagination if needed */}
      </Card>
    </div>
  );
}
