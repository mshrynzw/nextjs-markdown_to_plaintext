'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';

import { useMock } from '@/contexts/mock-context';
import StatsCard from '@/components/ui/stats-card';
import type { Attendance } from '@/schemas';
import { formatDateWithMonthDayWeekday, getJSTDateString } from '@/lib/utils/datetime';

import TimeClockCard from './TimeClockCard';
import ClockHistoryCard from './ClockHistoryCard';
import NotificationsCard from './NotificationsCard';
import NewChatsCard from './NewChatsCard';
import WorkStatusCard from './WorkStatusCard';

export default function DashboardContent() {
  const { user, attendances, notifications, companies } = useMock();
  const [isClient, setIsClient] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<
    'clockIn' | 'clockOut' | 'startBreak' | 'endBreak' | null
  >(null);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 今日の勤怠データを取得
  useEffect(() => {
    if (!isClient || !user) return;

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendances.find((record) => record.work_date === today);
    setTodayAttendance(todayRecord || null);
  }, [isClient, user, attendances]);

  // 締め日ベースの出勤日数計算
  const getPayrollPeriod = () => {
    if (!isClient || !companies[0]?.payroll_settings?.payroll_cutoff_day) {
      return { currentStart: '', currentEnd: '', previousStart: '', previousEnd: '' };
    }

    const cutoffDay = companies[0].payroll_settings.payroll_cutoff_day;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 今月の締め日を設定
    const currentPayrollEnd = new Date(currentYear, currentMonth, cutoffDay);
    const currentPayrollStart = new Date(currentYear, currentMonth - 1, cutoffDay + 1);

    // 前期間の締め日を設定
    const previousPayrollEnd = new Date(currentYear, currentMonth - 1, cutoffDay);
    const previousPayrollStart = new Date(currentYear, currentMonth - 2, cutoffDay + 1);

    return {
      currentStart: getJSTDateString(currentPayrollStart),
      currentEnd: getJSTDateString(currentPayrollEnd),
      previousStart: getJSTDateString(previousPayrollStart),
      previousEnd: getJSTDateString(previousPayrollEnd),
    };
  };

  const payrollPeriod = getPayrollPeriod();

  // 今期間の出勤記録（前回の締め日翌日から昨日まで）- 現在のユーザーのみ
  const currentPeriodRecords = isClient
    ? attendances.filter((r) => {
        if (!r.work_date || !user) return false;
        return (
          r.user_id === user.id &&
          r.work_date >= payrollPeriod.currentStart &&
          r.work_date <= payrollPeriod.currentEnd
        );
      })
    : [];

  // 前期間の出勤記録 - 現在のユーザーのみ
  const previousPeriodRecords = isClient
    ? attendances.filter((r) => {
        if (!r.work_date || !user) return false;
        return (
          r.user_id === user.id &&
          r.work_date >= payrollPeriod.previousStart &&
          r.work_date <= payrollPeriod.previousEnd
        );
      })
    : [];

  // デバッグ用ログ（開発時のみ）
  if (isClient && process.env.NODE_ENV === 'development') {
    console.log('締め日ベースの期間計算:', {
      cutoffDay: companies[0]?.payroll_settings?.payroll_cutoff_day,
      payrollPeriod,
      currentPeriodCount: currentPeriodRecords.length,
      previousPeriodCount: previousPeriodRecords.length,
      currentPeriodDates: currentPeriodRecords.map((r) => r.work_date).slice(0, 5),
      previousPeriodDates: previousPeriodRecords.map((r) => r.work_date).slice(0, 5),
    });
  }

  // 変化率計算関数
  const calculateChangeRate = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  };

  // 出勤日数：1日2回以上出勤している場合は1日としてカウント
  const uniqueWorkDays = new Set(currentPeriodRecords.map((r) => r.work_date)).size;
  const previousUniqueWorkDays = new Set(previousPeriodRecords.map((r) => r.work_date)).size;
  const workDaysChange = calculateChangeRate(uniqueWorkDays, previousUniqueWorkDays);

  // 出勤日数の表示用文字列
  const workDaysDisplayText = isClient
    ? `出勤日数（${formatDateWithMonthDayWeekday(payrollPeriod.currentStart)}～${formatDateWithMonthDayWeekday(payrollPeriod.currentEnd)}）`
    : '出勤日数';

  // 残業時間の表示用文字列
  const overtimeDisplayText = isClient
    ? `残業時間（${formatDateWithMonthDayWeekday(payrollPeriod.currentStart)}～${formatDateWithMonthDayWeekday(payrollPeriod.currentEnd)}）`
    : '残業時間';

  // 残業時間：attendancesテーブルから取得
  const totalOvertimeMinutes = currentPeriodRecords.reduce(
    (sum, r) => sum + (r.overtime_minutes || 0),
    0
  );
  const overtimeHoursValue = totalOvertimeMinutes > 0 ? totalOvertimeMinutes / 60 : 0;
  const overtimeHours = overtimeHoursValue.toFixed(1);

  const previousTotalOvertimeMinutes = previousPeriodRecords.reduce(
    (sum, r) => sum + (r.overtime_minutes || 0),
    0
  );
  const previousOvertimeHours = Math.round((previousTotalOvertimeMinutes / 60) * 10) / 10;
  const overtimeChange = calculateChangeRate(overtimeHoursValue, previousOvertimeHours);

  // デバッグ用ログ（開発時のみ）
  if (isClient && process.env.NODE_ENV === 'development') {
    console.log('残業時間計算:', {
      currentPeriodOvertimeMinutes: totalOvertimeMinutes,
      currentPeriodOvertimeHours: overtimeHoursValue,
      previousPeriodOvertimeMinutes: previousTotalOvertimeMinutes,
      previousPeriodOvertimeHours: previousOvertimeHours,
      overtimeChange,
    });
  }

  // 申請中の件数（ハードコーディング）
  const pendingRequests = 0;

  // 打刻処理関数（モック実装）
  const handleClockIn = async () => {
    if (!user) return;

    setIsLoading(true);
    setLoadingAction('clockIn');

    // モック処理：2秒待機
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 今日の勤怠データを更新
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const newAttendance: Attendance = {
      id: `attendance_${user.id}_${today}`,
      user_id: user.id,
      work_date: today,
      work_type_id: '0',
      clock_in_time: now,
      clock_out_time: undefined,
      break_records: [],
      actual_work_minutes: 0,
      overtime_minutes: 0,
      late_minutes: 0,
      early_leave_minutes: 0,
      status: 'normal',
      attendance_status_id: undefined,
      auto_calculated: true,
      description: '正常',
      approved_by: undefined,
      approved_at: undefined,
      created_at: now,
      updated_at: now,
    };

    setTodayAttendance(newAttendance);
    setIsLoading(false);
    setLoadingAction(null);
  };

  const handleClockOut = async () => {
    if (!todayAttendance) return;

    setIsLoading(true);
    setLoadingAction('clockOut');

    // モック処理：2秒待機
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 退勤時刻を更新
    const now = new Date().toISOString();
    const updatedAttendance: Attendance = {
      ...todayAttendance,
      clock_out_time: now,
    };

    setTodayAttendance(updatedAttendance);
    setIsLoading(false);
    setLoadingAction(null);
  };

  const handleStartBreak = async () => {
    setIsLoading(true);
    setLoadingAction('startBreak');

    // モック処理：1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setLoadingAction(null);
  };

  const handleEndBreak = async () => {
    setIsLoading(true);
    setLoadingAction('endBreak');

    // モック処理：1秒待機
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setLoadingAction(null);
  };

  return (
    <div className='space-y-6'>
      {/* 統計カード - デスクトップのみ */}
      <div className='hidden lg:grid gap-4 mb-6 lg:grid-cols-3'>
        <StatsCard
          title={workDaysDisplayText}
          value={`${uniqueWorkDays}日`}
          change={workDaysChange}
          icon={<Calendar className='w-6 h-6' />}
        />
        <StatsCard
          title={overtimeDisplayText}
          value={`${overtimeHours}時間`}
          change={overtimeChange}
          icon={<Clock className='w-6 h-6' />}
        />
        <StatsCard
          title='申請中'
          value={`${pendingRequests}件`}
          icon={<FileText className='w-6 h-6' />}
        />
      </div>

      {/* モバイル用レイアウト: 打刻、打刻履歴、統計の順 */}
      <div className='block lg:hidden space-y-6'>
        {/* Time Clock */}
        <TimeClockCard
          todayAttendance={todayAttendance}
          isLoading={isLoading}
          loadingAction={loadingAction}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
          onStartBreak={handleStartBreak}
          onEndBreak={handleEndBreak}
        />

        {/* Clock History */}
        <ClockHistoryCard
          todayAttendance={todayAttendance}
          attendanceRecords={attendances}
          currentUserId={user?.id}
        />

        {/* 統計カード - モバイル用 */}
        <div className='grid grid-cols-1 gap-4'>
          <StatsCard
            title={workDaysDisplayText}
            value={`${uniqueWorkDays}日`}
            change={workDaysChange}
            icon={<Calendar className='w-6 h-6' />}
          />
          <StatsCard
            title={overtimeDisplayText}
            value={overtimeHours}
            change={overtimeChange}
            icon={<Clock className='w-6 h-6' />}
          />
          <StatsCard
            title='申請中'
            value={`${pendingRequests}件`}
            icon={<FileText className='w-6 h-6' />}
          />
        </div>
      </div>

      {/* デスクトップ用レイアウト: 従来通りの2カラム */}
      <div className='hidden lg:grid lg:grid-cols-2 gap-6'>
        {/* Time Clock */}
        <TimeClockCard
          todayAttendance={todayAttendance}
          isLoading={isLoading}
          loadingAction={loadingAction}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
          onStartBreak={handleStartBreak}
          onEndBreak={handleEndBreak}
        />

        {/* Clock History */}
        <ClockHistoryCard
          todayAttendance={todayAttendance}
          attendanceRecords={attendances}
          currentUserId={user?.id}
        />
      </div>

      {/* Notifications */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <div className='block lg:hidden h-full'>
          <NewChatsCard />
        </div>

        <NotificationsCard notifications={notifications} />

        <div className='hidden lg:block h-full'>
          <NewChatsCard />
        </div>
      </div>

      {/* Today's Status */}
      <WorkStatusCard todayAttendance={todayAttendance} showOvertime={true} />
    </div>
  );
}
