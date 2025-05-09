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
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { toast } from '@/hooks/use-toast'; // Corrected import path to hooks directory
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
// Reusing mock companies from the list page for consistency
const mockCompanies = [
  { id: "1", name: "株式会社テクノロジー" },
  { id: "2", name: "グローバル商事" },
  { id: "3", name: "未来建設" },
  { id: "4", name: "エコソリューションズ" },
];

const mockRoles = [
  { id: "admin", name: "管理者" },
  { id: "staff", name: "担当者" },
  // Add other roles as needed
];

const mockDepartments = [
  { id: "dev", label: "開発部" },
  { id: "sales", label: "営業部" },
  { id: "hr", label: "人事部" },
  { id: "marketing", label: "マーケティング部" },
];

// --- Validation Schema ---
const addAdminFormSchema = z.object({
  name: z.string().min(1, { message: '氏名を入力してください。' }),
  email: z.string()
    .min(1, { message: 'メールアドレスを入力してください。' })
    .email({ message: '有効なメールアドレスを入力してください。' }),
  // TODO: Add async validation for email uniqueness via API call
  companyId: z.string().min(1, { message: '所属企業を選択してください。' }),
  role: z.string().min(1, { message: '権限レベルを選択してください。' }),
  departments: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: '少なくとも1つの部署を選択してください。', // Optional: make it required
  }).optional(), // Make the whole array optional if needed, or remove .optional()
});

type AddAdminFormValues = z.infer<typeof addAdminFormSchema>;

// --- Default Values ---
const defaultValues: Partial<AddAdminFormValues> = {
  name: '',
  email: '',
  companyId: '',
  role: '',
  departments: [],
};

// --- Component ---
export default function AddCompanyAdmin() {
  const navigate = useNavigate();
  const form = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: AddAdminFormValues) {
    // TODO: Implement API call to save the new admin data
    // TODO: Perform email duplication check before submitting
    console.log(data);
    toast({
      title: '管理者情報が送信されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    // Optionally navigate back to the list page after successful submission
    // navigate('/company-admins');
    // Or reset the form
    // form.reset();
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">新規企業管理者登録</h2>
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
                  <Input placeholder="例: 山田 太郎" {...field} />
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
                  <Input type="email" placeholder="例: yamada.taro@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  ログインに使用します。他の管理者と重複しないものを設定してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company */}
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>所属企業</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="企業を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockCompanies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>権限レベル</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="権限を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departments */}
          <FormField
            control={form.control}
            name="departments"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">担当部署/グループ</FormLabel>
                  <FormDescription>
                    アクセスを許可する部署/グループを選択してください（複数選択可）。
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4"> {/* Layout checkboxes */}
                  {mockDepartments.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="departments"
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
             <Button type="button" variant="outline" onClick={() => navigate('/company-admins')}>
               キャンセル
             </Button>
             <Button type="submit">管理者を登録</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
