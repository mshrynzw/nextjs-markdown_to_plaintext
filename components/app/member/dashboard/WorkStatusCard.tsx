'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime, formatMinutes } from '@/lib/utils/datetime';
import type { Attendance } from '@/schemas';

interface WorkStatusCardProps {
  todayAttendance?: Attendance | null;
  showOvertime?: boolean;
}

export default function WorkStatusCard({
  todayAttendance,
  showOvertime = false,
}: WorkStatusCardProps) {
  // 出勤・退勤時刻
  const clockInTime = todayAttendance?.clock_in_time
    ? formatTime(todayAttendance.clock_in_time)
    : '--:--';
  const clockOutTime = todayAttendance?.clock_out_time
    ? formatTime(todayAttendance.clock_out_time)
    : '--:--';

  // 勤務時間の計算
  const calculateWorkTime = () => {
    if (!todayAttendance?.clock_in_time || !todayAttendance?.clock_out_time) {
      return '--:--';
    }

    const inTime = new Date(todayAttendance.clock_in_time);
    const outTime = new Date(todayAttendance.clock_out_time);
    const workMinutes = Math.floor((outTime.getTime() - inTime.getTime()) / 60000);

    // 休憩時間を差し引く
    const breakMinutes =
      todayAttendance.break_records?.reduce((total: number, br) => {
        if (br.start && br.end && todayAttendance.clock_in_time) {
          const breakStart = new Date(
            `${todayAttendance.clock_in_time.split('T')[0]}T${br.start}:00`
          );
          const breakEnd = new Date(`${todayAttendance.clock_in_time.split('T')[0]}T${br.end}:00`);
          return total + Math.floor((breakEnd.getTime() - breakStart.getTime()) / 60000);
        }
        return total;
      }, 0) || 0;

    const actualWorkMinutes = workMinutes - breakMinutes;
    const hours = Math.floor(actualWorkMinutes / 60);
    const minutes = actualWorkMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // 残業時間の計算
  const calculateOvertime = () => {
    if (!todayAttendance?.clock_in_time || !todayAttendance?.clock_out_time) {
      return '--:--';
    }

    const inTime = new Date(todayAttendance.clock_in_time);
    const outTime = new Date(todayAttendance.clock_out_time);
    const workMinutes = Math.floor((outTime.getTime() - inTime.getTime()) / 60000);

    // 休憩時間を差し引く
    const breakMinutes =
      todayAttendance.break_records?.reduce((total: number, br) => {
        if (br.start && br.end && todayAttendance.clock_in_time) {
          const breakStart = new Date(
            `${todayAttendance.clock_in_time.split('T')[0]}T${br.start}:00`
          );
          const breakEnd = new Date(`${todayAttendance.clock_in_time.split('T')[0]}T${br.end}:00`);
          return total + Math.floor((breakEnd.getTime() - breakStart.getTime()) / 60000);
        }
        return total;
      }, 0) || 0;

    const actualWorkMinutes = workMinutes - breakMinutes;
    const standardWorkMinutes = 8 * 60; // 8時間
    const overtimeMinutes = Math.max(0, actualWorkMinutes - standardWorkMinutes);

    if (overtimeMinutes > 0) {
      const hours = Math.floor(overtimeMinutes / 60);
      const minutes = overtimeMinutes % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    return '--:--';
  };

  const workTime = calculateWorkTime();
  const overtimeTime = calculateOvertime();

  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle>今日の勤務状況</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${showOvertime ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {/* 出勤時刻 */}
          <div className='text-center p-4 bg-blue-50 rounded-lg'>
            <div className='text-sm text-blue-600 font-medium'>出勤時刻</div>
            <div className='text-lg font-bold text-blue-900'>{clockInTime}</div>
          </div>

          {/* 退勤時刻 */}
          <div className='text-center p-4 bg-red-50 rounded-lg'>
            <div className='text-sm text-red-600 font-medium'>退勤時刻</div>
            <div className='text-lg font-bold text-red-900'>{clockOutTime}</div>
          </div>

          {/* 勤務時間 */}
          <div className='text-center p-4 bg-green-50 rounded-lg'>
            <div className='text-sm text-green-600 font-medium'>勤務時間</div>
            <div className='text-lg font-bold text-green-900'>{workTime}</div>
          </div>

          {/* 残業時間（表示する場合のみ） */}
          {showOvertime && (
            <div className='text-center p-4 bg-yellow-50 rounded-lg'>
              <div className='text-sm text-yellow-600 font-medium'>残業時間</div>
              <div className='text-lg font-bold text-yellow-900'>{overtimeTime}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
