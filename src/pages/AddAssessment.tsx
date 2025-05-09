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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// --- Mock Data (Extend as needed) ---
const assessmentCategories = [
  { id: "ability", name: "能力診断" },
  { id: "skill", name: "スキル評価" },
  { id: "organization", name: "組織診断" },
  { id: "aptitude", name: "適性検査" },
  { id: "compliance", name: "コンプライアンス理解度" },
];

const difficultyLevels = [
  { id: "easy", name: "易しい" },
  { id: "medium", name: "普通" },
  { id: "hard", name: "難しい" },
];

const targetSkillLevels = [
  { id: "beginner", name: "初級者" },
  { id: "intermediate", name: "中級者" },
  { id: "advanced", name: "上級者" },
  { id: "expert", name: "エキスパート" },
];

// --- Validation Schema ---
const addAssessmentFormSchema = z.object({
  title: z.string().min(1, { message: 'アセスメント名を入力してください。' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'カテゴリを選択してください。' }),
  difficulty: z.string().min(1, { message: '難易度を選択してください。' }),
  estimatedTime: z.coerce // Use coerce for number conversion
    .number({ invalid_type_error: '数値を入力してください。' })
    .min(1, { message: '1以上の数値を入力してください。' })
    .positive({ message: '正の数値を入力してください。' }),
  targetSkillLevel: z.string().min(1, { message: '対象スキルレベルを選択してください。' }),
  status: z.enum(['draft', 'published'], {
    required_error: 'ステータスを選択してください。',
  }),
  // version: z.number().int().positive().default(1), // Add version later if needed
});

type AddAssessmentFormValues = z.infer<typeof addAssessmentFormSchema>;

// --- Default Values ---
const defaultValues: Partial<AddAssessmentFormValues> = {
  title: '',
  description: '',
  category: '',
  difficulty: '',
  estimatedTime: undefined, // Initialize as undefined for placeholder
  targetSkillLevel: '',
  status: 'draft', // Default to draft
};

// --- Component ---
export default function AddAssessment() {
  const navigate = useNavigate();
  const form = useForm<AddAssessmentFormValues>({
    resolver: zodResolver(addAssessmentFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: AddAssessmentFormValues) {
    // TODO: Implement API call to save the new assessment data
    // For now, just log and show a toast
    const assessmentData = {
      ...data,
      version: 1, // Add version number manually for now
      createdAt: new Date().toISOString().split('T')[0], // Add creation date
      questions: 0, // Initial question count
      companies: 0, // Initial company usage count
    };
    console.log(assessmentData);
    toast({
      title: 'アセスメント情報が送信されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(assessmentData, null, 2)}</code>
        </pre>
      ),
    });
    // TODO: Navigate to the assessment detail/edit page after creation
    // navigate(`/assessments/edit/${newAssessmentId}`); // Example
    // For now, navigate back to the list
    navigate('/assessments');
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        新規アセスメント作成
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>アセスメント情報</CardTitle>
          <CardDescription>
            新しいアセスメントの基本情報を設定します。設問は後で追加・編集できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>アセスメント名</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 新入社員向けビジネスマナー診断" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="アセスメントの目的、対象者、内容などを記述します。"
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>カテゴリ</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="カテゴリを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {assessmentCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Difficulty */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>難易度</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="難易度を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyLevels.map(level => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Estimated Time */}
                <FormField
                  control={form.control}
                  name="estimatedTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>想定所要時間 (分)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="例: 30" {...field} />
                      </FormControl>
                      <FormDescription>
                        受験者が完了するまでのおおよその時間（分単位）。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Skill Level */}
                <FormField
                  control={form.control}
                  name="targetSkillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>対象スキルレベル</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="対象スキルレベルを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {targetSkillLevels.map(level => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>ステータス</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="draft" />
                          </FormControl>
                          <FormLabel className="font-normal">下書き</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="published" />
                          </FormControl>
                          <FormLabel className="font-normal">公開</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                     <FormDescription>
                      「下書き」は管理者のみ閲覧可能。「公開」すると企業に提供可能になります。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                 <Button type="button" variant="outline" onClick={() => navigate('/assessments')}>
                   キャンセル
                 </Button>
                 <Button type="submit">アセスメントを作成</Button>
                 {/* Add "Save and Add Questions" button later */}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
