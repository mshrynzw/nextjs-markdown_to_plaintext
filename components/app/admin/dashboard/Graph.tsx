'use client';

import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumberWithCommas } from '@/lib/utils/common';
interface MonthlyData {
  month: string;
  totalSalary: number;
  normalHours: number;
  overtimeHours: number;
  count: number;
}

interface GraphProps {
  monthlyData: MonthlyData[];
  selectedPeriod: '3years' | '1year' | '6months' | '3months' | '1month';
  onPeriodChange: (period: '3years' | '1year' | '6months' | '3months' | '1month') => void;
}

export default function Graph({ monthlyData, selectedPeriod, onPeriodChange }: GraphProps) {
  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle>給与・勤務時間分析</CardTitle>
        <div className='flex gap-2 pt-4 pb-2 overflow-x-auto'>
          {/* 期間選択ボタン */}
          <div className='flex gap-1'>
            <Button
              variant={selectedPeriod === '3years' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPeriodChange('3years')}
            >
              直近3年
            </Button>
            <Button
              variant={selectedPeriod === '1year' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPeriodChange('1year')}
            >
              直近1年
            </Button>
            <Button
              variant={selectedPeriod === '6months' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPeriodChange('6months')}
            >
              直近半年
            </Button>
            <Button
              variant={selectedPeriod === '3months' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPeriodChange('3months')}
            >
              直近3ヶ月
            </Button>
            <Button
              variant={selectedPeriod === '1month' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPeriodChange('1month')}
            >
              直近1ヶ月
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='w-full h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart data={monthlyData}>
              <XAxis dataKey='month' />
              <YAxis yAxisId='left' label={{ value: '時間', angle: 0, position: 'bottom' }} />
              <YAxis
                yAxisId='right'
                orientation='right'
                label={{ value: '円', angle: 0, position: 'bottom' }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'totalSalary') {
                    return [`${formatNumberWithCommas(value)}円`, '給与合計'];
                  } else if (name === 'normalHours') {
                    return [`${formatNumberWithCommas(Math.round(value))}時間`, '通常勤務時間'];
                  } else if (name === 'overtimeHours') {
                    return [`${formatNumberWithCommas(Math.round(value))}時間`, '残業時間'];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId='left' dataKey='normalHours' fill='#82ca9d' name='通常勤務時間' />
              <Bar yAxisId='left' dataKey='overtimeHours' fill='#ffc658' name='残業時間' />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='totalSalary'
                stroke='#3b82f6'
                strokeWidth={2}
                name='給与合計'
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
