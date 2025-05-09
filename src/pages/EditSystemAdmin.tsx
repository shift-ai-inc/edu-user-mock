import React, { useEffect, useState } from 'react'; // Import useState
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mockSystemAdmins } from '@/data/mockSystemAdmins';
import { SystemAdmin, PermissionLevel, SystemAdminStatus, getPermissionLevelName } from '@/types/system-admin'; // Removed getStatusName as it's not used directly in the form render logic
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react'; // Import Loader2 for loading state

// Define Zod schema for validation (remains the same)
const formSchema = z.object({
  name: z.string().min(1, { message: "氏名は必須です。" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください。" }),
  permissionLevel: z.enum(['super_admin', 'admin', 'read_only'], {
    errorMap: () => ({ message: "権限レベルを選択してください。" }),
  }),
  status: z.enum(['active', 'inactive'], {
    errorMap: () => ({ message: "ステータスを選択してください。" }),
  }),
});

type SystemAdminFormValues = z.infer<typeof formSchema>;

export default function EditSystemAdmin() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for loading and admin data
  const [adminData, setAdminData] = useState<SystemAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SystemAdminFormValues>({
    resolver: zodResolver(formSchema),
    // Default values will be set by form.reset in useEffect
    defaultValues: {
      name: '',
      email: '',
      permissionLevel: undefined,
      status: 'inactive',
    },
  });

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data or find from mock
    const foundAdmin = mockSystemAdmins.find(a => a.id === adminId);

    if (foundAdmin) {
      setAdminData(foundAdmin);
      // Reset form with fetched data
      form.reset({
        name: foundAdmin.name,
        email: foundAdmin.email,
        permissionLevel: foundAdmin.permissionLevel,
        status: foundAdmin.status,
      });
    } else {
      toast({
        title: "エラー",
        description: "指定されたシステム管理者は見つかりませんでした。",
        variant: "destructive",
      });
      navigate('/system-admins'); // Redirect if not found
    }
    setIsLoading(false);
  }, [adminId, form, navigate, toast]); // Dependencies for useEffect

  const onSubmit = (data: SystemAdminFormValues) => {
    if (!adminData) return; // Should not happen if logic is correct

    console.log('Updating system admin:', adminId, data);

    // Simulate API success
    toast({
      title: "成功",
      description: `${data.name} の情報が更新されました。`,
    });

    // Update mock data (for demonstration)
    const index = mockSystemAdmins.findIndex(a => a.id === adminId);
    if (index !== -1) {
      mockSystemAdmins[index] = {
        ...mockSystemAdmins[index], // Keep existing fields like createdAt, lastLogin
        ...data, // Overwrite with form data
      };
    }

    navigate(`/system-admins/detail/${adminId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">読み込み中...</span>
      </div>
    );
  }

  // Admin not found state (should be handled by redirect, but as a fallback)
  if (!adminData) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>エラー</CardTitle></CardHeader>
          <CardContent>
            <p>管理者情報の読み込みに失敗しました。</p>
            <Button onClick={() => navigate('/system-admins')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render form once data is loaded
  return (
    <div className="p-8">
      <Button onClick={() => navigate(`/system-admins/detail/${adminId}`)} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> 詳細に戻る
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>システム管理者編集</CardTitle>
          <CardDescription>「{adminData.name}」の情報を編集します。</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名</FormLabel>
                    <FormControl>
                      <Input placeholder="山田 太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>権限レベル</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} /* Use value instead of defaultValue here */>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="権限レベルを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="super_admin">{getPermissionLevelName('super_admin')}</SelectItem>
                        <SelectItem value="admin">{getPermissionLevelName('admin')}</SelectItem>
                        <SelectItem value="read_only">{getPermissionLevelName('read_only')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">アカウントステータス</FormLabel>
                      <FormDescription>
                        アカウントを有効または無効にします。
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === 'active'}
                        onCheckedChange={(checked) => field.onChange(checked ? 'active' : 'inactive')}
                        aria-readonly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate(`/system-admins/detail/${adminId}`)}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
                  {form.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 更新中...</>
                  ) : (
                    '更新'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
