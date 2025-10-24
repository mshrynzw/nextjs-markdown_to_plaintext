'use client';

import React, { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  formatTime,
  formatDateWithDayOfWeek,
  formatMinutesToHoursMinutes,
} from '@/lib/utils/datetime';
import type { Attendance } from '@/schemas';

interface ClockHistoryCardProps {
  todayAttendance?: Attendance | null;
  attendanceRecords?: Attendance[];
  currentUserId?: string;
  onRefreshAction?: () => void;
  onCsvExport?: () => void;
}

export default function ClockHistoryCard({
  todayAttendance,
  attendanceRecords = [],
  currentUserId,
  onRefreshAction: _onRefreshAction,
  onCsvExport: _onCsvExport,
}: ClockHistoryCardProps) {
  const [activeTab, setActiveTab] = useState('today');

  // 今日の打刻記録を取得
  const today = new Date().toISOString().split('T')[0];

  // 今日の打刻記録を表示
  const renderTodayRecords = () => {
    if (!todayAttendance) {
      return (
        <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
          <Clock className='w-16 h-16 mb-4 text-gray-300' />
          <p className='text-sm'>今日の打刻記録はありません</p>
        </div>
      );
    }

    return (
      <div className='space-y-3'>
        <div className='p-3 bg-gray-50 rounded-lg'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm font-medium text-gray-600'>今日の勤怠記録</span>
            <span className='text-xs text-gray-500'>
              {formatDateWithDayOfWeek(
                todayAttendance.clock_in_time || todayAttendance.clock_out_time
              )}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <div className='text-xs text-gray-500 mb-1'>出勤時刻</div>
              <div className='text-sm font-medium'>
                {todayAttendance.clock_in_time
                  ? formatTime(todayAttendance.clock_in_time)
                  : '--:--'}
              </div>
            </div>
            <div>
              <div className='text-xs text-gray-500 mb-1'>退勤時刻</div>
              <div className='text-sm font-medium'>
                {todayAttendance.clock_out_time
                  ? formatTime(todayAttendance.clock_out_time)
                  : '--:--'}
              </div>
            </div>
          </div>

          {/* 休憩記録 */}
          {todayAttendance.break_records && todayAttendance.break_records.length > 0 && (
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <div className='text-xs text-gray-500 mb-2'>休憩記録</div>
              <div className='space-y-1'>
                {todayAttendance.break_records.map((breakRecord, breakIndex: number) => (
                  <div key={breakIndex} className='flex justify-between text-xs'>
                    <span className='text-gray-600'>休憩{breakIndex + 1}</span>
                    <span className='text-gray-800'>
                      {breakRecord.start} - {breakRecord.end || '進行中'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 過去履歴を表示
  const renderPastRecords = () => {
    const pastRecords = attendanceRecords
      .filter((record) => {
        // 現在のユーザーのデータのみをフィルタリング
        if (currentUserId && record.user_id !== currentUserId) return false;
        return record.work_date !== today;
      })
      .sort((a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime())
      .slice(0, 10); // 最新10件のみ表示

    if (pastRecords.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
          <Clock className='w-16 h-16 mb-4 text-gray-300' />
          <p className='text-sm'>過去の打刻記録はありません</p>
        </div>
      );
    }

    return (
      <div className='space-y-3'>
        {pastRecords.map((record) => (
          <div key={record.id} className='p-3 bg-gray-50 rounded-lg'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-medium text-gray-600'>
                {formatDateWithDayOfWeek(record.work_date)}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  record.status === 'normal'
                    ? 'bg-green-100 text-green-800'
                    : record.status === 'late'
                      ? 'bg-yellow-100 text-yellow-800'
                      : record.status === 'early_leave'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                }`}
              >
                {record.status === 'normal'
                  ? '正常'
                  : record.status === 'late'
                    ? '遅刻'
                    : record.status === 'early_leave'
                      ? '早退'
                      : '欠勤'}
              </span>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-xs text-gray-500 mb-1'>出勤時刻</div>
                <div className='text-sm font-medium'>
                  {record.clock_in_time ? formatTime(record.clock_in_time) : '--:--'}
                </div>
              </div>
              <div>
                <div className='text-xs text-gray-500 mb-1'>退勤時刻</div>
                <div className='text-sm font-medium'>
                  {record.clock_out_time ? formatTime(record.clock_out_time) : '--:--'}
                </div>
              </div>
            </div>

            {record.actual_work_minutes && (
              <div className='mt-2 pt-2 border-t border-gray-200'>
                <div className='flex justify-between text-xs'>
                  <span className='text-gray-500'>勤務時間</span>
                  <span className='text-gray-800'>
                    {formatMinutesToHoursMinutes(Math.floor(record.actual_work_minutes))}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center space-x-2'>
            <Clock className='w-5 h-5' />
            <span>打刻履歴</span>
          </CardTitle>
          <ChevronDown className='w-4 h-4 text-gray-400' />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='today'>今日</TabsTrigger>
            <TabsTrigger value='past'>過去履歴</TabsTrigger>
          </TabsList>

          <TabsContent value='today' className='mt-4'>
            {renderTodayRecords()}
          </TabsContent>

          <TabsContent value='past' className='mt-4'>
            {renderPastRecords()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
