import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Define the validation schema using Zod (updated)
const updateCompanyFormSchema = z.object({
  companyId: z.string(),
  companyName: z.string().min(1, { message: '企業名を入力してください。' }),
  address: z.string().optional(), // Company address (not billing)
  contactInfo: z.string().optional(), // Company contact (not billing)
  // Removed: industry, employeeSize, contractPlan, contractStartDate, contractEndDate, maxUsers, billingInfo (textarea)
  // Added specific billing fields (optional)
  billingContactName: z.string().optional(),
  billingContactEmail: z.string().email({ message: '有効なメールアドレスを入力してください。' }).optional().or(z.literal('')), // Allow empty string
  billingAddress: z.string().optional(),
  billingNotes: z.string().optional(),
  // Admin info remains
  adminName: z.string().optional(),
  adminEmail: z.string().email({ message: '有効なメールアドレスを入力してください。' }).optional().or(z.literal('')), // Allow empty string
  isActive: z.boolean().default(true),
});

type UpdateCompanyFormValues = z.infer<typeof updateCompanyFormSchema>;

// Placeholder for fetching company data - replace with actual API call
const fetchCompanyData = async (companyId: string): Promise<Partial<UpdateCompanyFormValues>> => {
  console.log(`Fetching data for company ID: ${companyId}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return mock data - replace with actual fetched data (updated structure)
  return {
    companyId: companyId,
    companyName: `株式会社サンプル ${companyId}`,
    address: '東京都千代田区サンプル1-1-1', // Company address
    contactInfo: '03-1234-5678', // Company contact
    // Removed: industry, employeeSize, contractPlan, contractStartDate, contractEndDate, maxUsers
    billingContactName: '経理 花子',
    billingContactEmail: 'keiri@sample.com',
    billingAddress: '〒100-0001 東京都千代田区丸の内1-1-1',
    billingNotes: '請求書はPDFで送付希望',
    adminName: '管理者 太郎',
    adminEmail: 'admin@example.com',
    isActive: true,
  };
};


export default function UpdateCompany() {
  const { companyId } = useParams<{ companyId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  // Removed: initialMaxUsers, showMaxUsersConfirm
  const [initialIsActive, setInitialIsActive] = useState<boolean | undefined>(undefined);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const form = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanyFormSchema),
    defaultValues: { // Initialize with empty/default values (updated)
      companyId: companyId,
      companyName: '',
      address: '',
      contactInfo: '',
      // Removed fields
      billingContactName: '',
      billingContactEmail: '',
      billingAddress: '',
      billingNotes: '',
      adminName: '',
      adminEmail: '',
      isActive: true,
    },
    mode: 'onChange',
  });

  // Removed: watchedMaxUsers
  const watchedIsActive = form.watch('isActive');

  // Fetch existing data on component mount
  useEffect(() => {
    if (!companyId) {
        toast({ title: "エラー", description: "企業IDが見つかりません。", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCompanyData(companyId);
        form.reset(data); // Populate form with fetched data
        // Removed: setInitialMaxUsers(data.maxUsers);
        setInitialIsActive(data.isActive); // Store initial value
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        toast({ title: "データ取得エラー", description: "企業情報の読み込みに失敗しました。", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [companyId, form]);

  // Removed: maxUsersChangeRequiresConfirm logic

  // Check if deactivation requires confirmation
  const deactivateRequiresConfirm = initialIsActive === true && watchedIsActive === false;

  const handleFormSubmit = (data: UpdateCompanyFormValues) => {
    // Removed: maxUsers confirmation check
    if (deactivateRequiresConfirm && !showDeactivateConfirm) {
      setShowDeactivateConfirm(true); // Show deactivation confirmation dialog
      return; // Stop submission until confirmed
    }

    // Reset confirmation flags if checks passed or weren't needed
    // Removed: setShowMaxUsersConfirm(false);
    setShowDeactivateConfirm(false);

    // Proceed with the actual submission logic
    submitData(data);
  };

  const submitData = (data: UpdateCompanyFormValues) => {
    // TODO: Implement API call to update the company data
    console.log("Submitting updated data:", data);
    toast({
      title: '企業情報が更新されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    // Update initial values after successful submission
    // Removed: setInitialMaxUsers(data.maxUsers);
    setInitialIsActive(data.isActive);
    // Optionally redirect or give further feedback
  };

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>; // Or a Skeleton loader
  }

  if (!companyId) {
     return <div className="p-8 text-red-600">企業IDが指定されていません。</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">企業情報更新 ({form.getValues('companyName') || companyId})</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 bg-white p-6 shadow rounded-lg">
          {/* Basic Info Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4">基本情報</h3>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>企業名</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>企業住所</FormLabel>
                <FormControl><Input placeholder="例: 東京都千代田区..." {...field} /></FormControl>
                <FormDescription>（企業の代表住所など）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>企業連絡先</FormLabel>
                <FormControl><Input placeholder="例: 03-xxxx-xxxx" {...field} /></FormControl>
                 <FormDescription>（企業の代表連絡先など）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Removed: Industry, Employee Size */}

          {/* Removed Contract Info Section */}

          {/* Billing Info Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">請求情報</h3>
           <FormField
            control={form.control}
            name="billingContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>請求先 担当者名</FormLabel>
                <FormControl><Input placeholder="例: 経理 太郎" {...field} /></FormControl>
                <FormDescription>（任意）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingContactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>請求先 メールアドレス</FormLabel>
                <FormControl><Input type="email" placeholder="例: keiri@example.com" {...field} /></FormControl>
                 <FormDescription>（任意）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>請求先 住所</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="例: 〒100-0000 東京都千代田区..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                 <FormDescription>（任意）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>請求に関する備考</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="請求書送付に関する特記事項など"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>（任意）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Admin Info Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">管理者情報</h3>
           <FormField
            control={form.control}
            name="adminName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>代表管理者名</FormLabel>
                <FormControl><Input placeholder="例: 管理者 太郎" {...field} /></FormControl>
                <FormDescription>（このシステムを利用する企業の代表管理者）</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>代表管理者メールアドレス</FormLabel>
                <FormControl><Input type="email" placeholder="例: admin@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account Status Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">アカウントステータス</h3>
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    アカウント有効
                  </FormLabel>
                  <FormDescription>
                    アカウントが無効の場合、関連するユーザーはログインできなくなります。
                  </FormDescription>
                   {deactivateRequiresConfirm && (
                     <p className="text-sm font-medium text-red-600 mt-1">
                       アカウントを無効化すると、関連ユーザーがアクセスできなくなります。
                     </p>
                   )}
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Confirmation Dialogs */}
          {/* Removed Max Users Confirmation */}

          {/* Deactivation Confirmation */}
          <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>アカウント無効化の確認</AlertDialogTitle>
                <AlertDialogDescription>
                  アカウントを無効にすると、この企業に所属するすべてのユーザーがシステムにアクセスできなくなります。本当に無効化しますか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => form.setValue('isActive', true)}>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => submitData(form.getValues())}
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  無効化を確認して続行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
            {form.formState.isSubmitting ? '更新中...' : '企業情報を更新'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
