import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const mockPermissionLevels = [
  { id: "super_admin", name: "スーパー管理者" },
  { id: "admin", name: "管理者" },
  { id: "read_only", name: "読み取り専用" },
];

const mockOperationalPermissions = [
  { id: "manage_system_admins", label: "システム管理者管理" },
  { id: "manage_companies", label: "企業管理" },
  { id: "manage_company_admins", label: "企業管理者管理" },
  { id: "manage_contracts", label: "契約管理" },
  { id: "manage_assessments", label: "アセスメント管理" },
  { id: "manage_surveys", label: "アンケート管理" },
  { id: "view_reports", label: "レポート閲覧" },
  { id: "manage_settings", label: "システム設定" },
];

// --- Validation Schema ---
const addSystemAdminFormSchema = z.object({
  name: z.string().min(1, { message: '氏名を入力してください。' }),
  email: z.string()
    .min(1, { message: 'メールアドレスを入力してください。' })
    .email({ message: '有効なメールアドレスを入力してください。' }),
  // TODO: Add async validation for email uniqueness via API call
  permissionLevel: z.string().min(1, { message: '権限レベルを選択してください。' }),
  detailedPermissions: z.array(z.string()).refine((value) => value.length > 0, {
    message: '少なくとも1つの操作権限を選択してください。',
  }),
});

type AddSystemAdminFormValues = z.infer<typeof addSystemAdminFormSchema>;

// --- Default Values ---
const defaultValues: Partial<AddSystemAdminFormValues> = {
  name: '',
  email: '',
  permissionLevel: '',
  detailedPermissions: [],
};

// --- Component ---
export default function AddSystemAdmin() {
  const navigate = useNavigate();
  const form = useForm<AddSystemAdminFormValues>({
    resolver: zodResolver(addSystemAdminFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: AddSystemAdminFormValues) {
    // TODO: Implement API call to save the new system admin data
    // TODO: Perform email duplication check before submitting
    console.log(data);
    toast({
      title: 'システム管理者情報が送信されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    // Optionally navigate back to the list page after successful submission
    // navigate('/system-admins');
    // Or reset the form
    // form.reset();
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">新規システム管理者登録</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 shadow rounded-lg max-w-2xl mx-auto">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>氏名</FormLabel>
                <FormControl>
                  <Input placeholder="例: 管理 太郎" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="例: admin.taro@example-system.com" {...field} />
                </FormControl>
                <FormDescription>
                  ログインに使用します。他の管理者と重複しないものを設定してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permission Level */}
          <FormField
            control={form.control}
            name="permissionLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>権限レベル</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="権限レベルを選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockPermissionLevels.map(level => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  基本的な権限セットを選択します。詳細は下記で設定可能です。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Detailed Operational Permissions */}
          <FormField
            control={form.control}
            name="detailedPermissions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">詳細な操作権限</FormLabel>
                  <FormDescription>
                    この管理者が実行できる操作を選択してください（複数選択可）。
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4"> {/* Layout checkboxes */}
                  {mockOperationalPermissions.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="detailedPermissions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value ?? []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage /> {/* Show validation message for the array */}
              </FormItem>
            )}
          />


          <div className="flex justify-end space-x-2">
             <Button type="button" variant="outline" onClick={() => navigate('/system-admins')}>
               キャンセル
             </Button>
             <Button type="submit">システム管理者を登録</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
