'use client';

import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Coffee, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TimeDisplay from '@/components/ui/time-display';
import { formatTime } from '@/lib/utils/datetime';
import type { Attendance } from '@/schemas';

interface TimeClockCardProps {
  todayAttendance?: Attendance | null;
  isLoading?: boolean;
  loadingAction?: 'clockIn' | 'clockOut' | 'startBreak' | 'endBreak' | null;
  onClockIn?: () => void;
  onClockOut?: () => void;
  onStartBreak?: () => void;
  onEndBreak?: () => void;
}

export default function TimeClockCard({
  todayAttendance,
  isLoading = false,
  loadingAction = null,
  onClockIn,
  onClockOut,
  onStartBreak,
  onEndBreak,
}: TimeClockCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 勤務状態の判定
  const hasClockIn = !!todayAttendance?.clock_in_time;
  const hasClockOut = !!todayAttendance?.clock_out_time;
  const isCurrentlyWorking = hasClockIn && !hasClockOut;

  // 休憩状態の判定
  const activeBreaks = todayAttendance?.break_records || [];
  const isOnBreak = activeBreaks.some((br) => {
    const hasBreakStart = !!br.start;
    const hasBreakEnd = !!br.end;
    return hasBreakStart && !hasBreakEnd;
  });

  // 新しいセッションを開始できるかどうか
  const canStartNewSession = !hasClockIn || hasClockOut;

  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Clock className='w-5 h-5' />
          <span>打刻</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <TimeDisplay />

        {/* 出勤ボタン - 新しいセッションを開始できる場合のみ表示 */}
        {canStartNewSession && (
          <Button
            onClick={onClockIn}
            disabled={isLoading}
            className={`w-full h-12 bg-green-600 hover:bg-green-700 relative overflow-hidden transition-all duration-200 ${
              isLoading && loadingAction === 'clockIn' ? 'animate-pulse shadow-lg' : ''
            }`}
          >
            {isLoading && loadingAction === 'clockIn' ? (
              <>
                <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                出勤中...
              </>
            ) : (
              <>
                <LogIn className='w-5 h-5 mr-2' />
                出勤
              </>
            )}
          </Button>
        )}

        {/* 退勤・休憩ボタン - 現在勤務中の場合のみ表示 */}
        {isCurrentlyWorking && (
          <>
            {!isOnBreak ? (
              <Button
                onClick={onStartBreak}
                disabled={isLoading}
                className={`w-full h-12 bg-orange-200 hover:bg-orange-300 text-orange-800 border-orange-300 transition-all duration-200 ${
                  isLoading && loadingAction === 'startBreak' ? 'animate-pulse shadow-lg' : ''
                }`}
              >
                {isLoading && loadingAction === 'startBreak' ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    休憩開始中...
                  </>
                ) : (
                  <>
                    <Coffee className='w-5 h-5 mr-2' />
                    休憩開始
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={onEndBreak}
                disabled={isLoading}
                className={`w-full h-12 bg-orange-200 hover:bg-orange-300 text-orange-800 border-orange-300 transition-all duration-200 ${
                  isLoading && loadingAction === 'endBreak' ? 'animate-pulse shadow-lg' : ''
                }`}
              >
                {isLoading && loadingAction === 'endBreak' ? (
                  <>
                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                    休憩終了中...
                  </>
                ) : (
                  <>
                    <Coffee className='w-5 h-5 mr-2' />
                    休憩終了
                  </>
                )}
              </Button>
            )}

            {/* 退勤ボタン - 休憩中でも退勤可能 */}
            <Button
              onClick={onClockOut}
              disabled={isLoading}
              className={`w-full h-12 bg-red-600 hover:bg-red-700 transition-all duration-200 ${
                isLoading && loadingAction === 'clockOut' ? 'animate-pulse shadow-lg' : ''
              }`}
            >
              {isLoading && loadingAction === 'clockOut' ? (
                <>
                  <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                  退勤中...
                </>
              ) : (
                <>
                  <LogOut className='w-5 h-5 mr-2' />
                  退勤
                </>
              )}
            </Button>
          </>
        )}

        {/* 自動休憩の説明 */}
        {todayAttendance?.break_records && todayAttendance.break_records.length > 0 && (
          <div className='flex items-center space-x-2 p-3 bg-gray-50 rounded-lg'>
            <Coffee className='text-base w-5 h-5 m-2 text-orange-600 rounded-full bg-white' />
            <div className='text-sm'>
              <div>
                退勤打刻時に
                <br />
                自動で休憩開始・終了が打刻されます
              </div>
              {todayAttendance.break_records.map((breakRecord, index) => (
                <div key={index}>
                  <span className='text-gray-400'>休憩{index + 1}</span>
                  <span className='text-gray-600'>
                    （{breakRecord.start} - {breakRecord.end}）
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
