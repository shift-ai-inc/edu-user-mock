import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { toast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { AssessmentQuestionFormData } from '@/types/assessment-question'; // Import form data type

// --- Validation Schema ---
const questionOptionSchema = z.object({
  text: z.string().min(1, { message: '選択肢テキストを入力してください。' }),
});

const addQuestionFormSchema = z.object({
  text: z.string().min(1, { message: '設問テキストを入力してください。' }),
  type: z.enum(['single-choice', 'multiple-choice', 'text'], {
    required_error: '設問タイプを選択してください。',
  }),
  options: z.array(questionOptionSchema).optional(), // Optional for text type
  // Correct answer validation depends on the type, handled conditionally
  correctAnswerSingle: z.string().optional(), // Index as string for single-choice RadioGroup
  correctAnswerMultiple: z.array(z.string()).optional(), // Array of indexes for multiple-choice Checkbox
  correctAnswerText: z.string().optional(), // Text answer
  points: z.coerce // Use coerce for number conversion
    .number({ invalid_type_error: '数値を入力してください。' })
    .min(0, { message: '0以上の数値を入力してください。' }) // Allow 0 points
    .int({ message: '整数を入力してください。' }),
}).refine(data => {
    // Require options for choice types
    if ((data.type === 'single-choice' || data.type === 'multiple-choice') && (!data.options || data.options.length < 2)) {
      return false;
    }
    return true;
  }, {
    message: '選択肢タイプの設問には少なくとも2つの選択肢が必要です。',
    path: ['options'], // Point error to options field
  })
  .refine(data => {
    // Require correct answer for choice types
    if (data.type === 'single-choice' && (data.correctAnswerSingle === undefined || data.correctAnswerSingle === '')) {
        return false;
    }
    return true;
  }, {
      message: '単一選択タイプの設問には正解を選択してください。',
      path: ['correctAnswerSingle'],
  })
 .refine(data => {
    if (data.type === 'multiple-choice' && (!data.correctAnswerMultiple || data.correctAnswerMultiple.length === 0)) {
        return false;
    }
    return true;
  }, {
      message: '複数選択タイプの設問には少なくとも1つの正解を選択してください。',
      path: ['correctAnswerMultiple'],
  });
// We don't strictly require correctAnswerText as it might be manually graded

type AddQuestionFormValues = z.infer<typeof addQuestionFormSchema>;

// --- Component ---
export default function AddAssessmentQuestion() {
  const navigate = useNavigate();
  const { assessmentId, versionId } = useParams<{ assessmentId: string; versionId: string }>();

  const form = useForm<AddQuestionFormValues>({
    resolver: zodResolver(addQuestionFormSchema),
    defaultValues: {
      text: '',
      type: undefined, // Start with no type selected
      options: [{ text: '' }, { text: '' }], // Start with two empty options
      correctAnswerSingle: undefined,
      correctAnswerMultiple: [],
      correctAnswerText: '',
      points: 10, // Default points
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const questionType = form.watch('type');

  function onSubmit(data: AddQuestionFormValues) {
    if (!assessmentId || !versionId) return;

    // Map form data to the structure expected by the backend/mock data
    const questionData: Partial<AssessmentQuestionFormData> & { assessmentId: string; versionId: string } = {
      assessmentId,
      versionId,
      text: data.text,
      type: data.type,
      points: data.points,
    };

    if (data.type === 'single-choice' || data.type === 'multiple-choice') {
      questionData.options = data.options;
      if (data.type === 'single-choice') {
        // Assuming correctAnswerSingle stores the index '0', '1', etc.
        questionData.correctAnswer = data.options?.[parseInt(data.correctAnswerSingle || '-1', 10)]?.text; // Store text for simplicity now
      } else {
         // Assuming correctAnswerMultiple stores indexes '0', '1', etc.
        questionData.correctAnswer = data.correctAnswerMultiple
            ?.map(indexStr => data.options?.[parseInt(indexStr, 10)]?.text)
            .filter(text => text !== undefined) as string[];
      }
    } else if (data.type === 'text') {
      questionData.correctAnswer = data.correctAnswerText || undefined; // Store text answer if provided
    }

    // TODO: Implement API call to add the question
    console.log("Adding question:", questionData);

    toast({
      title: '設問が追加されました',
      description: `アセスメント ${assessmentId} (Version ${versionId}) に新しい設問が追加されました。`,
      variant: "default",
    });

    // Navigate back to the assessment detail page
    navigate(`/assessments/detail/${assessmentId}`);
  }

  const handleBack = () => {
     navigate(`/assessments/detail/${assessmentId}`);
  }

  return (
    <div className="p-8">
      <Button onClick={handleBack} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> アセスメント詳細に戻る
      </Button>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        新規設問追加 (アセスメント: {assessmentId} / バージョン: {versionId})
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>設問情報</CardTitle>
          <CardDescription>
            新しい設問の詳細を入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Question Text */}
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>設問テキスト</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="例: チームの目標達成のために最も重要だと思う要素は何ですか？"
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Question Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>設問タイプ</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          // Reset options/answers when type changes
                          form.reset({
                            ...form.getValues(), // keep other values
                            type: value as any,
                            options: value === 'text' ? [] : [{ text: '' }, { text: '' }],
                            correctAnswerSingle: undefined,
                            correctAnswerMultiple: [],
                            correctAnswerText: '',
                          });
                        }} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="タイプを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single-choice">単一選択</SelectItem>
                          <SelectItem value="multiple-choice">複数選択</SelectItem>
                          <SelectItem value="text">テキスト入力</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Points */}
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>配点</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="例: 10" {...field} />
                      </FormControl>
                      <FormDescription>
                        この設問の配点（整数）。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Options (Conditional) */}
              {(questionType === 'single-choice' || questionType === 'multiple-choice') && (
                <div className="space-y-4 rounded-md border p-4">
                   <FormLabel>選択肢と正解</FormLabel>
                   <FormDescription>
                     {questionType === 'single-choice' ? '選択肢を入力し、正解を1つ選択してください。' : '選択肢を入力し、正解を1つ以上選択してください。'}
                   </FormDescription>
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field: optionField }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Input placeholder={`選択肢 ${index + 1}`} {...optionField} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 2} // Prevent removing below 2 options
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ text: '' })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    選択肢を追加
                  </Button>
                   <FormMessage>{form.formState.errors.options?.message || form.formState.errors.options?.root?.message}</FormMessage>

                  {/* Correct Answer Selection */}
                  {questionType === 'single-choice' && fields.length > 0 && (
                     <FormField
                        control={form.control}
                        name="correctAnswerSingle"
                        render={({ field }) => (
                          <FormItem className="space-y-3 pt-4">
                            <FormLabel>正解の選択肢</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                {fields.map((item, index) => (
                                  <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={index.toString()} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {form.watch(`options.${index}.text`) || `選択肢 ${index + 1}`}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  )}

                  {questionType === 'multiple-choice' && fields.length > 0 && (
                     <FormField
                        control={form.control}
                        name="correctAnswerMultiple"
                        render={() => ( // Note: We use form.setValue inside Checkbox onChange
                          <FormItem className="pt-4">
                             <div className="mb-4">
                                <FormLabel className="text-base">正解の選択肢 (複数選択可)</FormLabel>
                             </div>
                            {fields.map((item, index) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name={`correctAnswerMultiple`} // Bind to the array
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(index.toString())}
                                          onCheckedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            if (checked) {
                                               field.onChange([...currentValues, index.toString()]);
                                            } else {
                                               field.onChange(
                                                currentValues.filter(
                                                  (value) => value !== index.toString()
                                                )
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                         {form.watch(`options.${index}.text`) || `選択肢 ${index + 1}`}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  )}

                </div>
              )}

              {/* Correct Answer Text (Conditional) */}
              {questionType === 'text' && (
                <FormField
                  control={form.control}
                  name="correctAnswerText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>正解テキスト (任意)</FormLabel>
                      <FormControl>
                        <Input placeholder="システムによる自動採点を行う場合の正解テキスト" {...field} />
                      </FormControl>
                      <FormDescription>
                        自由記述問題の正解テキスト。空欄の場合は手動採点が必要です。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}


              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? '保存中...' : '設問を追加'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
