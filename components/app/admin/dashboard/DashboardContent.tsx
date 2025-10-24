'use client';

import {
  AlertCircle,
  CircleDollarSign,
  Clock,
  Scan,
  Square,
  SquareCheck,
  Users,
  ArrowDownToLineIcon,
} from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMock } from '@/contexts/mock-context';
import { toFullWidthNumber } from '@/lib/utils/common';
import { formatDateWithDayOfWeek, getCurrentMonthDate } from '@/lib/utils/datetime';

import StatusAlert from '../StatusAlert';

import Graph from './Graph';

export default function DashboardContent() {
  const { payrolls, users, companies } = useMock();
  const [selectedPeriod, setSelectedPeriod] = useState<
    '3years' | '1year' | '6months' | '3months' | '1month'
  >('1year');

  // 期間に応じたデータをフィルタリング
  const getFilteredData = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (selectedPeriod) {
      case '3years':
        cutoffDate.setFullYear(now.getFullYear() - 3);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '1month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
    }

    return payrolls.filter((payroll) => {
      const payrollDate = new Date(payroll.payroll_date);
      return payrollDate >= cutoffDate;
    });
  };

  // 月ごとのデータを集計
  const getMonthlyData = () => {
    const filteredData = getFilteredData();
    const monthlyMap = new Map<
      string,
      {
        month: string;
        totalSalary: number;
        normalHours: number;
        overtimeHours: number;
        count: number;
      }
    >();

    filteredData.forEach((payroll) => {
      const payrollDate = new Date(payroll.payroll_date);
      const monthKey = `${payrollDate.getFullYear()}年${payrollDate.getMonth() + 1}月`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          totalSalary: 0,
          normalHours: 0,
          overtimeHours: 0,
          count: 0,
        });
      }

      const data = monthlyMap.get(monthKey)!;
      data.totalSalary += payroll.net_payment;
      data.normalHours += payroll.attendance_data.actual_working_hours.normal_work;
      data.overtimeHours += payroll.attendance_data.actual_working_hours.overtime_hours;
      data.count += 1;
    });

    return Array.from(monthlyMap.values()).sort((a, b) => {
      const aYear = parseInt(a.month.split('年')[0]);
      const aMonth = parseInt(a.month.split('年')[1].split('月')[0]);
      const bYear = parseInt(b.month.split('年')[0]);
      const bMonth = parseInt(b.month.split('年')[1].split('月')[0]);
      return aYear - bYear || aMonth - bMonth;
    });
  };

  const monthlyData = getMonthlyData();

  return (
    <div className='space-y-6'>
      <StatusAlert />

      {/* サマリー */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>総従業員数</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {toFullWidthNumber(users.length)}人
                </p>
              </div>
              <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                <Users className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>従業員による勤怠の未確認</p>
                <p className='text-2xl font-bold text-red-600'>
                  {toFullWidthNumber(payrolls.filter((p) => !p.is_checked_by_member).length)}人
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-4 border-red-400'>
                <AlertCircle className='w-6 h-6 text-red-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>今月の締め日</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatDateWithDayOfWeek(
                    getCurrentMonthDate(companies[0].payroll_settings.payroll_cutoff_day)
                  ).replace(/^\d{4}年/, '')}
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <Clock className='w-6 h-6 text-red-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>支払日</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatDateWithDayOfWeek(
                    getCurrentMonthDate(companies[0].payroll_settings.payroll_payment_day)
                  ).replace(/^\d{4}年/, '')}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-400'>
                <ArrowDownToLineIcon className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
      </div>
      {/* サマリー（給与管理のステータス） */}
      <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
        <CardHeader>
          <CardTitle>ステータス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>未処理の件数</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {toFullWidthNumber(payrolls.filter((p) => p.status === '未処理').length)}件
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                    <Scan className='w-6 h-6 text-red-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>承認待ちの件数</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {toFullWidthNumber(payrolls.filter((p) => p.status === '承認待ち').length)}件
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center'>
                    <Square className='w-6 h-6 text-yellow-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>承認済みの件数</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {toFullWidthNumber(payrolls.filter((p) => p.status === '承認済み').length)}件
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                    <SquareCheck className='w-6 h-6 text-green-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>支払完了の件数</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {toFullWidthNumber(payrolls.filter((p) => p.status === '支払完了').length)}件
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <CircleDollarSign className='w-6 h-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <Graph
        monthlyData={monthlyData}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    </div>
  );
}
