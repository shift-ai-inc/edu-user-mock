import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Mock data for survey results - with some translations
const surveyData = {
  id: 'survey123',
  title: '顧客満足度調査 結果',
  description: 'Q2顧客満足度調査の結果です。',
  questions: [
    {
      id: 'q1',
      text: '当社の製品にどの程度満足されましたか？',
      type: 'multiple-choice',
      results: [
        { answer: '非常に満足', count: 150 },
        { answer: '満足', count: 250 },
        { answer: '普通', count: 50 },
        { answer: '不満', count: 30 },
        { answer: '非常に不満', count: 20 },
      ],
    },
    {
      id: 'q2',
      text: '当社の製品を友人に薦める可能性はどのくらいですか？',
      type: 'rating',
      results: [
        { answer: '1 (低い)', count: 15 },
        { answer: '2', count: 25 },
        { answer: '3', count: 60 },
        { answer: '4', count: 150 },
        { answer: '5 (高い)', count: 250 },
      ],
    },
    {
      id: 'q3',
      text: '改善してほしい機能は何ですか？ (上位5件)',
      type: 'open-text',
      results: [
        { answer: 'ユーザーインターフェース', count: 120 },
        { answer: '処理速度', count: 95 },
        { answer: 'モバイルアプリ体験', count: 80 },
        { answer: 'レポート機能', count: 65 },
        { answer: '連携オプション', count: 50 },
      ],
    },
  ],
  totalRespondents: 500,
};

const chartConfig = {
  count: {
    label: '回答数', // Translated
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const SurveyResults: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{surveyData.title}</CardTitle>
          <CardDescription>
            {surveyData.description} (総回答者数: {surveyData.totalRespondents}名)
          </CardDescription>
        </CardHeader>
      </Card>

      {surveyData.questions.map((question, index) => (
        <Card key={question.id} className="mb-6">
          <CardHeader>
            <CardTitle>質問 {index + 1}</CardTitle>
            <CardDescription>{question.text}</CardDescription>
          </CardHeader>
          <CardContent>
            {question.type === 'multiple-choice' || question.type === 'rating' ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart
                  accessibilityLayer
                  data={question.results}
                  margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="answer"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? '...' : '')}
                  />
                   <YAxis />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : question.type === 'open-text' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>主なテーマ・回答</TableHead>
                    <TableHead className="text-right">回答数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {question.results.map((result) => (
                    <TableRow key={result.answer}>
                      <TableCell>{result.answer}</TableCell>
                      <TableCell className="text-right">{result.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>この質問タイプの表示はサポートされていません。</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurveyResults;
