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
import { toast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// --- Mock Data (Same as AddAssessment, plus find function) ---
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

// Mock Assessment Type (Simplified for form)
interface AssessmentFormData {
  id: string;
  title: string;
  description?: string;
  category: string; // Use category ID
  difficulty: string; // Use difficulty ID
  estimatedTime: number;
  targetSkillLevel: string; // Use skill level ID
  status: 'draft' | 'published' | 'archived'; // Include archived
}

// Mock function to find assessment by ID (replace with API call)
const findAssessmentByIdForEdit = (id: string): AssessmentFormData | undefined => {
  const assessments: AssessmentFormData[] = [
    { id: "ASS-001", title: "リーダーシップ能力診断", category: "ability", difficulty: "medium", estimatedTime: 60, targetSkillLevel: "intermediate", status: "published", description: "リーダーとしての潜在能力と現在のスキルセットを評価します。" },
    { id: "ASS-002", title: "エンジニアスキル評価", category: "skill", difficulty: "hard", estimatedTime: 90, targetSkillLevel: "advanced", status: "published", description: "ソフトウェアエンジニア向けの技術スキル評価。" },
    { id: "ASS-003", title: "組織文化サーベイ", category: "organization", difficulty: "easy", estimatedTime: 30, targetSkillLevel: "beginner", status: "published", description: "組織の文化や従業員のエンゲージメントを測定します。" },
    { id: "ASS-004", title: "マネジメントスキル診断", category: "ability", difficulty: "medium", estimatedTime: 50, targetSkillLevel: "intermediate", status: "draft", description: "" },
    { id: "ASS-005", title: "コミュニケーション適性テスト", category: "aptitude", difficulty: "easy", estimatedTime: 25, targetSkillLevel: "beginner", status: "archived", description: "職場におけるコミュニケーションスタイルを評価します。" },
  ];
  return assessments.find(assessment => assessment.id === id);
};


// --- Validation Schema (Allow 'archived' status) ---
const editAssessmentFormSchema = z.object({
  title: z.string().min(1, { message: 'アセスメント名を入力してください。' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'カテゴリを選択してください。' }),
  difficulty: z.string().min(1, { message: '難易度を選択してください。' }),
  estimatedTime: z.coerce // Use coerce for number conversion
    .number({ invalid_type_error: '数値を入力してください。' })
    .min(1, { message: '1以上の数値を入力してください。' })
    .positive({ message: '正の数値を入力してください。' }),
  targetSkillLevel: z.string().min(1, { message: '対象スキルレベルを選択してください。' }),
  status: z.enum(['draft', 'published', 'archived'], { // Added 'archived'
    required_error: 'ステータスを選択してください。',
  }),
});

type EditAssessmentFormValues = z.infer<typeof editAssessmentFormSchema>;

// --- Component ---
export default function EditAssessment() {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [assessmentData, setAssessmentData] = useState<AssessmentFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EditAssessmentFormValues>({
    resolver: zodResolver(editAssessmentFormSchema),
    mode: 'onChange',
    // Default values will be set by useEffect
  });

  useEffect(() => {
    if (assessmentId) {
      setIsLoading(true);
      // Simulate API call
      const data = findAssessmentByIdForEdit(assessmentId);
      if (data) {
        setAssessmentData(data);
        // Set form values after data is fetched
        form.reset({
          title: data.title,
          description: data.description || '',
          category: data.category,
          difficulty: data.difficulty,
          estimatedTime: data.estimatedTime,
          targetSkillLevel: data.targetSkillLevel,
          status: data.status,
        });
      } else {
        // Handle assessment not found
        toast({
          title: "エラー",
          description: "アセスメントが見つかりませんでした。",
          variant: "destructive",
        });
        navigate('/assessments');
      }
      setIsLoading(false);
    } else {
      navigate('/assessments'); // Redirect if no ID
    }
  }, [assessmentId, navigate, form]);


  function onSubmit(data: EditAssessmentFormValues) {
    if (!assessmentId) return;
    // TODO: Implement API call to update the assessment data
    console.log("Updating assessment:", assessmentId, data);
    toast({
      title: 'アセスメント情報が更新されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify({ id: assessmentId, ...data }, null, 2)}</code>
        </pre>
      ),
      variant: "default",
    });
    // Navigate back to the detail page or list page after update
    navigate(`/assessments/detail/${assessmentId}`);
  }

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>; // Or a spinner component
  }

  if (!assessmentData) {
     // This case should ideally be handled by the useEffect redirect, but added for safety
     return <div className="p-8">アセスメントが見つかりません。</div>;
  }

  return (
    <div className="p-8">
       <Button onClick={() => navigate(`/assessments/detail/${assessmentId}`)} variant="outline" className="mb-6">
         <ArrowLeft className="mr-2 h-4 w-4" /> 詳細に戻る
       </Button>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        アセスメント編集: {assessmentData.title} ({assessmentData.id})
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>アセスメント基本情報</CardTitle>
          <CardDescription>
            アセスメントの基本情報を編集します。設問の編集は詳細画面のバージョン管理から行います。
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                        value={field.value} // Use value here for controlled component
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
                         <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="archived" />
                          </FormControl>
                          <FormLabel className="font-normal">アーカイブ</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                     <FormDescription>
                      アセスメント全体のステータスを設定します。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                 <Button type="button" variant="outline" onClick={() => navigate(`/assessments/detail/${assessmentId}`)}>
                   キャンセル
                 </Button>
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? '保存中...' : '変更を保存'}
                 </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
