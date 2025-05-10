import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { Label } from '@/components/ui/label'; // Import Label
import { ArrowLeft } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast'; // Import toast

// --- Available Permissions Definition ---
const AVAILABLE_PERMISSIONS = {
  overallAdmin: "全体管理権限",
  assessmentAdmin: "アセスメント管理権限",
  userAdmin: "ユーザー管理権限", // Assuming this means managing users within the company scope
  analysisView: "分析結果閲覧権限",
  // Add more permissions as needed
};
type PermissionKey = keyof typeof AVAILABLE_PERMISSIONS;

// --- Mock Data (Updated with permissions) ---
// NOTE: In a real app, this data structure and fetching would be different.
// We'll manage the state locally for this mock implementation.
const initialMockAdmins = [
  { id: 'adm001', companyId: 1, companyName: "株式会社テクノロジー", name: "田中 太郎", email: "tanaka.taro@tech.co.jp", role: "管理者", lastLogin: "2024-07-10T10:30:00Z", status: "アクティブ", permissions: { overallAdmin: true, assessmentAdmin: true, userAdmin: true, analysisView: true } },
  { id: 'adm002', companyId: 1, companyName: "株式会社テクノロジー", name: "鈴木 一郎", email: "suzuki.ichiro@tech.co.jp", role: "担当者", lastLogin: "2024-07-09T15:00:00Z", status: "アクティブ", permissions: { overallAdmin: false, assessmentAdmin: true, userAdmin: false, analysisView: true } },
  { id: 'adm003', companyId: 2, companyName: "グローバル商事", name: "佐藤 花子", email: "sato.hanako@global.com", role: "管理者", lastLogin: "2024-07-11T09:00:00Z", status: "アクティブ", permissions: { overallAdmin: true, assessmentAdmin: true, userAdmin: true, analysisView: true } },
  { id: 'adm004', companyId: 3, companyName: "未来建設", name: "高橋 健太", email: "takahashi.kenta@mirai.co.jp", role: "管理者", lastLogin: "2024-06-20T11:00:00Z", status: "非アクティブ", permissions: { overallAdmin: false, assessmentAdmin: false, userAdmin: false, analysisView: false } },
  { id: 'adm005', companyId: 2, companyName: "グローバル商事", name: "伊藤 次郎", email: "ito.jiro@global.com", role: "担当者", lastLogin: null, status: "アクティブ", permissions: { overallAdmin: false, assessmentAdmin: false, userAdmin: true, analysisView: false } },
  { id: 'adm006', companyId: 4, companyName: "エコソリューションズ", name: "渡辺 直美", email: "watanabe.naomi@eco.jp", role: "管理者", lastLogin: "2024-07-01T14:25:00Z", status: "アクティブ", permissions: { overallAdmin: true, assessmentAdmin: true, userAdmin: false, analysisView: true } },
  { id: 'adm007', companyId: 1, companyName: "株式会社テクノロジー", name: "山本 三郎", email: "yamamoto.saburo@tech.co.jp", role: "担当者", lastLogin: "2024-05-15T08:10:00Z", status: "非アクティブ", permissions: { overallAdmin: false, assessmentAdmin: false, userAdmin: false, analysisView: false } },
  { id: 'adm008', companyId: 3, companyName: "未来建設", name: "中村 美咲", email: "nakamura.misaki@mirai.co.jp", role: "担当者", lastLogin: "2024-07-10T18:00:00Z", status: "アクティブ", permissions: { overallAdmin: false, assessmentAdmin: true, userAdmin: false, analysisView: true } },
];

// Type for permissions object
type Permissions = {
  overallAdmin: boolean;
  assessmentAdmin: boolean;
  userAdmin: boolean;
  analysisView: boolean;
};

// Updated Admin type
type Admin = typeof initialMockAdmins[0];

// --- Helper Functions ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'ログインなし';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '無効な日付';
    return format(date, 'yyyy/MM/dd HH:mm', { locale: ja });
  } catch (e) {
    return 'フォーマットエラー';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "アクティブ": return "bg-green-100 text-green-800 border-green-300";
    case "非アクティブ": return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};


export default function CompanyAdminDetail() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();

  // Use state to manage mock data locally for updates
  const [mockAdmins, setMockAdmins] = useState<Admin[]>(initialMockAdmins);
  const admin = mockAdmins.find(a => a.id === adminId);

  // State for managing the permissions being edited
  const [editablePermissions, setEditablePermissions] = useState<Permissions>({
    overallAdmin: false,
    assessmentAdmin: false,
    userAdmin: false,
    analysisView: false
  });

  // Initialize editable permissions when admin data is loaded/found
  useEffect(() => {
    if (admin) {
      // Ensure all available permissions have a defined boolean value
      const initialPermissions: Permissions = {
        overallAdmin: false,
        assessmentAdmin: false,
        userAdmin: false,
        analysisView: false
      };
      Object.keys(AVAILABLE_PERMISSIONS).forEach(key => {
        initialPermissions[key as PermissionKey] = !!admin.permissions?.[key as PermissionKey];
      });
      setEditablePermissions(initialPermissions);
    }
  }, [admin]);

  const handlePermissionChange = (permissionKey: PermissionKey, checked: boolean) => {
    setEditablePermissions(prev => {
      const updated = { ...prev };
      updated[permissionKey] = checked;
      return updated;
    });
  };

  const handleSaveChanges = () => {
    if (!admin) return;

    const originalPermissions = admin.permissions;
    const changes: string[] = [];

    // --- Simulate History Logging & Prepare Update ---
    console.log(`--- Permission Change History Simulation (Admin ID: ${admin.id}) ---`);
    console.log(`Changed By: SystemAdmin (Placeholder) at ${new Date().toISOString()}`);

    const updatedPermissions: Permissions = { ...editablePermissions };

    Object.keys(AVAILABLE_PERMISSIONS).forEach(key => {
        const pKey = key as PermissionKey;
        const originalValue = !!originalPermissions?.[pKey];
        const newValue = !!updatedPermissions[pKey];
        if (originalValue !== newValue) {
            const changeDesc = `${AVAILABLE_PERMISSIONS[pKey]}: ${originalValue ? '有効' : '無効'} -> ${newValue ? '有効' : '無効'}`;
            changes.push(changeDesc);
            console.log(`- ${changeDesc}`);
        }
    });

    if (changes.length === 0) {
        toast({
            title: "変更なし",
            description: "権限に変更はありませんでした。",
            variant: "default",
        });
        return;
    }

    // --- Update Mock Data State ---
    setMockAdmins(prevAdmins =>
      prevAdmins.map(a =>
        a.id === adminId ? { ...a, permissions: updatedPermissions } : a
      )
    );

    // --- Simulate Email Notification ---
    console.log(`--- Email Notification Simulation ---`);
    console.log(`To: ${admin.email}`);
    console.log(`Subject: 権限が変更されました`);
    console.log(`Body: ${admin.name}様の権限がシステム管理者によって変更されました。\n変更内容:\n${changes.join('\n')}`);
    console.log(`---------------------------------`);


    // --- Show Success Toast ---
    toast({
      title: "権限を更新しました",
      description: `${admin.name} の権限が正常に保存されました。`,
      variant: "default", 
    });

    // Optionally, refetch data or confirm save in a real app
  };


  if (!admin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定された企業管理者は見つかりませんでした。</p>
            <Button onClick={() => navigate('/company-admins')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Button onClick={() => navigate('/company-admins')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> 企業管理者一覧に戻る
      </Button>

      {/* Admin Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{admin.name}</CardTitle>
              <CardDescription>{admin.email}</CardDescription>
            </div>
            {/* TODO: Add Edit button for basic info later */}
            {/* <Button variant="outline">編集</Button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">所属企業</h4>
              <p>{admin.companyName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">権限レベル</h4>
              <p>{admin.role}</p> {/* Keep the general role */}
            </div>
            <div>
              <h4 className="font-semibold mb-1">ステータス</h4>
              <Badge variant="outline" className={"border " + getStatusBadgeClass(admin.status)}>
                {admin.status}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-1">最終ログイン</h4>
              <p>{formatDate(admin.lastLogin)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>権限管理</CardTitle>
          <CardDescription>この管理者に付与する権限を選択してください。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(AVAILABLE_PERMISSIONS).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`perm-${key}`}
                checked={!!editablePermissions[key as PermissionKey]}
                onCheckedChange={(checked) => handlePermissionChange(key as PermissionKey, !!checked)}
              />
              <Label htmlFor={`perm-${key}`} className="font-normal">
                {label}
              </Label>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>権限を保存</Button>
        </CardFooter>
      </Card>

      {/* TODO: Add section for permission change history */}
      {/* <Card>
        <CardHeader>
          <CardTitle>権限変更履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ここに権限変更の履歴が表示されます...</p>
           Render history table/list here
        </CardContent>
      </Card> */}
    </div>
  );
}
