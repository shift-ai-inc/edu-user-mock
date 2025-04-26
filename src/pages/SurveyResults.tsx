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
  type ChartConfig, // Import ChartConfig type
} from '@/components/ui/chart'; // Ensure ChartConfig is exported from chart.tsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Mock data for survey results
const surveyData = {
  id: 'survey123',
  title: 'Customer Satisfaction Survey',
  description: 'Results from the Q2 customer satisfaction survey.',
  questions: [
    {
      id: 'q1',
      text: 'How satisfied were you with our product?',
      type: 'multiple-choice',
      results: [
        { answer: 'Very Satisfied', count: 150 },
        { answer: 'Satisfied', count: 250 },
        { answer: 'Neutral', count: 50 },
        { answer: 'Unsatisfied', count: 30 },
        { answer: 'Very Unsatisfied', count: 20 },
      ],
    },
    {
      id: 'q2',
      text: 'How likely are you to recommend our product to a friend?',
      type: 'rating', // Assuming a scale, let's represent with a chart
      results: [
        { answer: '1 (Not Likely)', count: 15 },
        { answer: '2', count: 25 },
        { answer: '3', count: 60 },
        { answer: '4', count: 150 },
        { answer: '5 (Very Likely)', count: 250 },
      ],
    },
    {
      id: 'q3',
      text: 'What features would you like to see improved? (Top 5)',
      type: 'open-text', // Display as a table for common themes
      results: [
        { answer: 'User Interface', count: 120 },
        { answer: 'Performance Speed', count: 95 },
        { answer: 'Mobile App Experience', count: 80 },
        { answer: 'Reporting Features', count: 65 },
        { answer: 'Integration Options', count: 50 },
      ],
    },
  ],
  totalRespondents: 500,
};

const chartConfig = {
  count: {
    label: 'Count',
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
            {surveyData.description} (Total Respondents: {surveyData.totalRespondents})
          </CardDescription>
        </CardHeader>
      </Card>

      {surveyData.questions.map((question, index) => (
        <Card key={question.id} className="mb-6">
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
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
                    // tickFormatter={(value) => value.slice(0, 15) + (value.length > 15 ? '...' : '')} // Shorten labels if needed
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
                    <TableHead>Common Theme / Answer</TableHead>
                    <TableHead className="text-right">Count</TableHead>
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
              <p>Unsupported question type for results display.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SurveyResults;
