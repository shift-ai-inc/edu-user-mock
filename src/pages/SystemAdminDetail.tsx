import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSystemAdmins } from '@/data/mockSystemAdmins'; // Import mock data
import { SystemAdmin, getPermissionLevelName, getStatusName } from '@/types/system-admin'; // Import type and helpers
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react'; // Import Pencil icon
import { Badge } from '@/components/ui/badge';

export default function SystemAdminDetail() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  // TODO: Replace with actual API call to fetch admin details by ID
  const admin = mockSystemAdmins.find(a => a.id === adminId);

  if (!admin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定されたシステム管理者は見つかりませんでした。</p>
            <Button onClick={() => navigate('/system-admins')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return 'N/A';
    return date.toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-8">
      <Button onClick={() => navigate('/system-admins')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> システム管理者一覧に戻る
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{admin.name}</CardTitle>
              <CardDescription>{admin.email}</CardDescription>
            </div>
             {/* Add Edit button */}
            <Button variant="outline" onClick={() => navigate(`/system-admins/edit/${adminId}`)}>
              <Pencil className="mr-2 h-4 w-4" /> 編集
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">権限レベル</h4>
              <p>{getPermissionLevelName(admin.permissionLevel)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">ステータス</h4>
              <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                {getStatusName(admin.status)}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-1">最終ログイン</h4>
              <p>{formatDate(admin.lastLogin)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">登録日時</h4>
              <p>{formatDate(admin.createdAt)}</p>
            </div>
          </div>
          {/* TODO: Add section for detailed permissions if applicable */}
          {/* <div className="mt-6">
            <h4 className="font-semibold mb-2">詳細権限</h4>
            <p>ここに詳細な権限リストが表示されます...</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
