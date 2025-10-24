'use client';

import { useMock } from '@/contexts/mock-context';

export default function StatusAlert() {
  const { settings, payrolls } = useMock();

  if (settings.mode === 'warning') {
    // 今月の勤怠未確認人数をカウント
    const unconfirmedCount = payrolls.filter((p) => !p.is_checked_by_member).length;

    if (unconfirmedCount > 0) {
      return (
        <div className='bg-yellow-50 p-4 rounded-md border-4 border-yellow-600'>
          <p className='text-yellow-600 font-bold'>
            <span className='relative mr-2.5'>
              <div className='absolute inline-flex h-4 w-4 rounded-full bg-yellow-500 top-0.5 -left-0.5 opacity-75 animate-ping'></div>
              <div className='relative inline-flex h-3 w-3 rounded-full bg-yellow-600'></div>
            </span>
            警告：今月の勤怠未確認が{unconfirmedCount}人います。
          </p>
        </div>
      );
    }
  }

  if (settings.mode === 'alert') {
    // 前月の支払い未完了人数をカウント
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1); // 3ヶ月前の給与データを参照
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthMonth = lastMonth.getMonth(); // 0ベース（8=9月）

    const unpaidCount = payrolls.filter((p) => {
      const periodStart = new Date(p.period_start);
      return (
        periodStart.getFullYear() === lastMonthYear &&
        periodStart.getMonth() === lastMonthMonth && // 0ベースで比較
        p.status !== '支払完了'
      );
    }).length;

    if (unpaidCount > 0) {
      return (
        <div className='bg-red-100 p-4 rounded-md border-4 border-red-800'>
          <p className='text-red-800 font-bold'>
            <span className='relative mr-2.5'>
              <div className='absolute inline-flex h-4 w-4 rounded-full bg-red-700 top-0.5 -left-0.5 opacity-75 animate-ping'></div>
              <div className='relative inline-flex h-3 w-3 rounded-full bg-red-800'></div>
            </span>
            異常：前月の支払い未完了が{unpaidCount}人います。
          </p>
        </div>
      );
    }
  }

  return null;
}
