import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Use Input for display consistency, but make read-only
import { Badge } from '@/components/ui/badge';
import { mockSystemAdmins } from '@/data/mockSystemAdmins'; // Import mock data
import { getPermissionLevelName, getStatusName } from '@/types/system-admin';
import { format } from 'date-fns'; // For formatting dates

// Assume the logged-in user is the first one in the mock data for now
// In a real app, you'd fetch the current user's data
const loggedInAdmin = mockSystemAdmins[0];

const Profile: React.FC = () => {
  if (!loggedInAdmin) {
    return <div className="p-6">管理者情報が見つかりません。</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">プロフィール</h1>

      <Card>
        <CardHeader>
          <CardTitle>{loggedInAdmin.name}</CardTitle>
          <CardDescription>システム管理者アカウント情報</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">氏名</Label>
              <Input id="name" value={loggedInAdmin.name} readOnly disabled className="bg-gray-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" value={loggedInAdmin.email} readOnly disabled className="bg-gray-100" />
            </div>

            {/* Permissions and Status */}
            <div className="space-y-2">
              <Label>権限レベル</Label>
              <div>
                <Badge variant="outline">{getPermissionLevelName(loggedInAdmin.permissionLevel)}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>ステータス</Label>
              <div>
                <Badge variant={loggedInAdmin.status === 'active' ? 'default' : 'secondary'}>
                  {getStatusName(loggedInAdmin.status)}
                </Badge>
              </div>
            </div>

             {/* Timestamps */}
             <div className="space-y-2">
              <Label htmlFor="createdAt">登録日時</Label>
              <Input
                id="createdAt"
                value={format(loggedInAdmin.createdAt, 'yyyy/MM/dd HH:mm')}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastLogin">最終ログイン</Label>
              <Input
                id="lastLogin"
                value={loggedInAdmin.lastLogin ? format(loggedInAdmin.lastLogin, 'yyyy/MM/dd HH:mm') : 'N/A'}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          {/* Placeholder for future actions */}
          {/*
          <div className="pt-4 border-t">
             <h3 className="text-lg font-medium mb-4">アカウント設定</h3>
             <div className="space-x-2">
                <Button variant="outline">メールアドレス変更</Button>
                <Button variant="outline">パスワード変更</Button>
             </div>
          </div>
           */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
