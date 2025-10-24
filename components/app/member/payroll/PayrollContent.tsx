'use client';

import { Check, CircleDollarSign, Scan, SquareCheck, User } from 'lucide-react';
import { useState } from 'react';

import { ActionButton } from '@/components/ui/action-button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMock } from '@/contexts/mock-context';
import { toFullWidthNumber } from '@/lib/utils/common';

import Filter from './Filter';
import PreviewDialog from './PreviewDialog';

interface PayrollFilters {
  selectedMonth: string | null;
  status: string[];
}

export default function PayrollContent() {
  const { payrolls, users } = useMock();
  const currentUser = users[0]; // 現在のユーザー（従業員）
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // フィルター状態
  const [filters, setFilters] = useState<PayrollFilters>({
    selectedMonth: selectedMonth,
    status: [],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '未処理':
        return 'bg-red-100 text-red-800';
      case '承認待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '承認済み':
        return 'bg-green-100 text-green-800';
      case '支払完了':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const handlePreviewClick = (payrollId: string) => {
    setSelectedPayrollId(payrollId);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedPayrollId(null);
  };

  const handleFiltersChange = (newFilters: PayrollFilters) => {
    setFilters(newFilters);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setFilters({
      ...filters,
      selectedMonth: month,
    });
  };

  const handleResetFilters = () => {
    setSelectedMonth(null);
    setFilters({
      selectedMonth: null,
      status: [],
    });
  };

  // 現在のユーザーの給与データのみをフィルタリング
  const getUserPayrolls = () => {
    return payrolls.filter((payroll) => payroll.user_id === currentUser.id);
  };

  const getFilteredPayrolls = () => {
    const userPayrolls = getUserPayrolls();

    return userPayrolls.filter((payroll) => {
      // 月選択フィルター
      if (filters.selectedMonth && payroll.payroll_date.slice(0, 7) !== filters.selectedMonth) {
        return false;
      }

      // ステータスフィルター
      if (filters.status.length > 0 && !filters.status.includes(payroll.status)) {
        return false;
      }

      return true;
    });
  };

  const filteredPayrolls = getFilteredPayrolls();

  // 統計データの計算
  const totalPayrolls = filteredPayrolls.length;
  const unprocessedPayrolls = filteredPayrolls.filter((p) => p.status === '未処理').length;
  const approvedPayrolls = filteredPayrolls.filter((p) => p.status === '承認済み').length;
  const paidPayrolls = filteredPayrolls.filter((p) => p.status === '支払完了').length;

  return (
    <div className='space-y-6'>
      {/* サマリー */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>総給与記録数</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {toFullWidthNumber(totalPayrolls)}件
                </p>
              </div>
              <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                <User className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>未処理</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {toFullWidthNumber(unprocessedPayrolls)}件
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <Scan className='w-6 h-6 text-red-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>承認済み</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {toFullWidthNumber(approvedPayrolls)}件
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <SquareCheck className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>支払完了</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {toFullWidthNumber(paidPayrolls)}件
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-400'>
                <CircleDollarSign className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
      </div>

      {/* 給与リスト */}
      <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
        <CardContent className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-2xl font-bold text-gray-900'>給与リスト</p>
          </div>

          <Filter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            selectedMonth={selectedMonth || ''}
            onMonthChange={handleMonthChange}
            onResetFilters={handleResetFilters}
          />

          <div className='w-full'>
            <Table className='overflow-x-auto'>
              <TableHeader>
                <TableRow>
                  <TableHead className='whitespace-nowrap'>期間</TableHead>
                  <TableHead className='whitespace-nowrap'>ステータス</TableHead>
                  <TableHead className='whitespace-nowrap'>支給合計</TableHead>
                  <TableHead className='whitespace-nowrap'>控除合計</TableHead>
                  <TableHead className='whitespace-nowrap'>差引支給額</TableHead>
                  <TableHead className='whitespace-nowrap'>給与日</TableHead>
                  <TableHead className='whitespace-nowrap'>確認状況</TableHead>
                  <TableHead className='whitespace-nowrap'>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell className='whitespace-nowrap'>
                      {formatDate(payroll.period_start)} ~ {formatDate(payroll.period_end)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}
                      >
                        {payroll.status}
                      </span>
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatCurrency(payroll.payment_items.total_payment)}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {formatCurrency(payroll.deduction_items.total_deduction)}
                    </TableCell>
                    <TableCell className='font-bold text-lg'>
                      {formatCurrency(payroll.net_payment)}
                    </TableCell>
                    <TableCell>{formatDate(payroll.payroll_date)}</TableCell>
                    <TableCell className='whitespace-nowrap'>
                      {payroll.is_checked_by_member ? (
                        <div className='flex items-center justify-center'>
                          <Check className='w-4 h-4 text-green-600' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <span className='px-2 py-1 rounded-full text-red-600 bg-red-100 border-2 border-red-600 text-xs font-medium'>
                            未確認
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <ActionButton
                          action='view'
                          onClick={() => handlePreviewClick(payroll.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* プレビューダイアログ */}
      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        payrollId={selectedPayrollId}
      />
    </div>
  );
}
