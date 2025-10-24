'use client';
import {
  AlertCircle,
  Check,
  CircleDollarSign,
  Clock,
  Scan,
  Square,
  SquareCheck,
  Users,
  ArrowDownToLineIcon,
} from 'lucide-react';
import { useState } from 'react';

import { ActionButton } from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMock } from '@/contexts/mock-context';
import { useFilteredPayrolls, type PayrollFilters } from '@/hooks/use-filtered-payrolls';
import usePayrollColumnSettings from '@/hooks/use-payroll-column-settings';
import { useToast } from '@/hooks/use-toast';
import { toFullWidthNumber } from '@/lib/utils/common';
import {
  formatCompactDateTime,
  formatMinutesToHoursMinutes,
  formatDateWithDayOfWeek,
  getCurrentMonthDate,
} from '@/lib/utils/datetime';
import { getUserFullName } from '@/lib/utils/user';
import { PayrollCalculator } from '@/lib/utils/payroll';
import { createRecalculationEditHistoryEntry } from '@/lib/utils/payroll-edit-history';
import type { Payroll } from '@/schemas';
import StatusAlert from '@/components/app/admin/StatusAlert';

import ColumnSettingsDialog from './ColumnSettingsDialog';
import EditDialog from './EditDialog';
import Filter from './Filter';
import HeaderButton from './HeaderButton';
import PreviewDialog from './PreviewDialog';
import RecalculateConfirmationDialog from './RecalculateConfirmationDialog';

export default function PayrollContent() {
  const { users, companies, payrolls, setPayrolls } = useMock();
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string | null>(null);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [isRecalculateMode, setIsRecalculateMode] = useState(false);
  const [selectedPayrollIds, setSelectedPayrollIds] = useState<Set<string>>(new Set());
  const [isRecalculateDialogOpen, setIsRecalculateDialogOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculateResults, setRecalculateResults] = useState<
    Array<{
      payrollId: string;
      employeeName: string;
      beforeAmount: number;
      afterAmount: number;
      difference: number;
      paymentItemsDiff?: {
        baseSalary: { before: number; after: number; difference: number };
        overtimeAllowance: { before: number; after: number; difference: number };
        commutingAllowance: { before: number; after: number; difference: number };
        housingAllowance: { before: number; after: number; difference: number };
        totalPayment: { before: number; after: number; difference: number };
      };
      deductionItemsDiff?: {
        healthInsurance: { before: number; after: number; difference: number };
        employeePension: { before: number; after: number; difference: number };
        employmentInsurance: { before: number; after: number; difference: number };
        incomeTax: { before: number; after: number; difference: number };
        residentTax: { before: number; after: number; difference: number };
        totalDeduction: { before: number; after: number; difference: number };
      };
    }>
  >([]);
  const [originalPayrolls, setOriginalPayrolls] = useState<Map<string, Payroll>>(new Map());

  const { settings: columnSettings, saveSettings, isLoaded } = usePayrollColumnSettings();

  // フィルター状態
  const [filters, setFilters] = useState<PayrollFilters>({
    selectedMonth: selectedMonth,
    status: [],
    hasOvertime: null,
    workTypeId: null,
    employeeTypeId: null,
    userId: null,
    groupId: null,
    memberCheckStatus: 'all',
  });

  // フィルターされた給与データを取得
  const filteredPayrolls = useFilteredPayrolls(filters);

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

  const handleEditClick = (payrollId: string) => {
    setSelectedPayrollId(payrollId);
    setIsEditOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedPayrollId(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedPayrollId(null);
  };

  const handleColumnSettingsSave = (settings: typeof columnSettings) => {
    saveSettings(settings);
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

  const handleRecalculateClick = async () => {
    if (isRecalculateMode) {
      // 再計算実行
      if (selectedPayrollIds.size === 0) {
        toast({
          title: 'エラー',
          description: '再計算する給与データを選択してください',
          variant: 'destructive',
        });
        return;
      }

      // 再計算開始
      setIsRecalculating(true);
      toast({
        title: '再計算開始',
        description: '給与データの再計算を開始しています...',
      });

      // 非同期で再計算を実行（実際の処理時間をシミュレート）
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const results: Array<{
        payrollId: string;
        employeeName: string;
        beforeAmount: number;
        afterAmount: number;
        difference: number;
        paymentItemsDiff?: {
          baseSalary: { before: number; after: number; difference: number };
          overtimeAllowance: { before: number; after: number; difference: number };
          commutingAllowance: { before: number; after: number; difference: number };
          housingAllowance: { before: number; after: number; difference: number };
          totalPayment: { before: number; after: number; difference: number };
        };
        deductionItemsDiff?: {
          healthInsurance: { before: number; after: number; difference: number };
          employeePension: { before: number; after: number; difference: number };
          employmentInsurance: { before: number; after: number; difference: number };
          incomeTax: { before: number; after: number; difference: number };
          residentTax: { before: number; after: number; difference: number };
          totalDeduction: { before: number; after: number; difference: number };
        };
      }> = [];

      selectedPayrollIds.forEach((payrollId) => {
        const payroll = filteredPayrolls.find((p) => p.id === payrollId);
        if (!payroll) return;

        const user = users.find((u) => u.id === payroll.user_id);
        if (!user) return;

        // 再計算実行
        const recalculatedPayroll = PayrollCalculator.recalculatePayroll(
          payroll,
          user,
          companies[0].payroll_settings
        );

        const employeeName = getUserFullName(user.family_name, user.first_name);
        const beforeAmount = payroll.net_payment;
        const afterAmount = recalculatedPayroll.net_payment;
        const difference = afterAmount - beforeAmount;

        // 支給項目の差分を計算
        const paymentItemsDiff = {
          baseSalary: {
            before: payroll.payment_items.base_salary,
            after: recalculatedPayroll.payment_items.base_salary,
            difference:
              recalculatedPayroll.payment_items.base_salary - payroll.payment_items.base_salary,
          },
          overtimeAllowance: {
            before: payroll.payment_items.overtime_allowance,
            after: recalculatedPayroll.payment_items.overtime_allowance,
            difference:
              recalculatedPayroll.payment_items.overtime_allowance -
              payroll.payment_items.overtime_allowance,
          },
          commutingAllowance: {
            before: payroll.payment_items.commuting_allowance,
            after: recalculatedPayroll.payment_items.commuting_allowance,
            difference:
              recalculatedPayroll.payment_items.commuting_allowance -
              payroll.payment_items.commuting_allowance,
          },
          housingAllowance: {
            before: payroll.payment_items.housing_allowance,
            after: recalculatedPayroll.payment_items.housing_allowance,
            difference:
              recalculatedPayroll.payment_items.housing_allowance -
              payroll.payment_items.housing_allowance,
          },
          totalPayment: {
            before: payroll.payment_items.total_payment,
            after: recalculatedPayroll.payment_items.total_payment,
            difference:
              recalculatedPayroll.payment_items.total_payment - payroll.payment_items.total_payment,
          },
        };

        // 控除項目の差分を計算
        const deductionItemsDiff = {
          healthInsurance: {
            before: payroll.deduction_items.health_insurance,
            after: recalculatedPayroll.deduction_items.health_insurance,
            difference:
              recalculatedPayroll.deduction_items.health_insurance -
              payroll.deduction_items.health_insurance,
          },
          employeePension: {
            before: payroll.deduction_items.employee_pension,
            after: recalculatedPayroll.deduction_items.employee_pension,
            difference:
              recalculatedPayroll.deduction_items.employee_pension -
              payroll.deduction_items.employee_pension,
          },
          employmentInsurance: {
            before: payroll.deduction_items.employment_insurance,
            after: recalculatedPayroll.deduction_items.employment_insurance,
            difference:
              recalculatedPayroll.deduction_items.employment_insurance -
              payroll.deduction_items.employment_insurance,
          },
          incomeTax: {
            before: payroll.deduction_items.income_tax,
            after: recalculatedPayroll.deduction_items.income_tax,
            difference:
              recalculatedPayroll.deduction_items.income_tax - payroll.deduction_items.income_tax,
          },
          residentTax: {
            before: payroll.deduction_items.resident_tax,
            after: recalculatedPayroll.deduction_items.resident_tax,
            difference:
              recalculatedPayroll.deduction_items.resident_tax -
              payroll.deduction_items.resident_tax,
          },
          totalDeduction: {
            before: payroll.deduction_items.total_deduction,
            after: recalculatedPayroll.deduction_items.total_deduction,
            difference:
              recalculatedPayroll.deduction_items.total_deduction -
              payroll.deduction_items.total_deduction,
          },
        };

        results.push({
          payrollId,
          employeeName,
          beforeAmount,
          afterAmount,
          difference,
          paymentItemsDiff,
          deductionItemsDiff,
        });
      });

      // 元のデータを保存（ロールバック用）
      const originalData = new Map<string, Payroll>();
      selectedPayrollIds.forEach((payrollId) => {
        const payroll = filteredPayrolls.find((p) => p.id === payrollId);
        if (payroll) {
          originalData.set(payrollId, { ...payroll });
        }
      });
      setOriginalPayrolls(originalData);

      // 再計算完了
      setIsRecalculating(false);
      setRecalculateResults(results);

      toast({
        title: '再計算完了',
        description: '再計算が完了しました。結果を確認してください。',
      });

      setIsRecalculateDialogOpen(true);
    } else {
      // 再計算モード開始
      setIsRecalculateMode(true);
      toast({
        title: '再計算',
        description: '再計算するユーザーを選択してください',
      });
    }
  };

  const handlePayrollSelect = (payrollId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedPayrollIds);
    if (checked) {
      newSelectedIds.add(payrollId);
    } else {
      newSelectedIds.delete(payrollId);
    }
    setSelectedPayrollIds(newSelectedIds);
  };

  const handleRecalculateApply = () => {
    // 再計算結果を適用
    const currentUser = users.find((u) => u.id === '1'); // 現在のユーザー（管理者）
    const currentUserName = currentUser
      ? getUserFullName(currentUser.family_name, currentUser.first_name)
      : '管理者';

    const now = new Date().toISOString();

    // 給与データを実際に更新
    const updatedPayrolls = payrolls.map((payroll) => {
      const result = recalculateResults.find((r) => r.payrollId === payroll.id);
      if (!result) return payroll;

      // 再計算を実行して新しい給与データを取得
      const user = users.find((u) => u.id === payroll.user_id);
      if (!user) return payroll;

      const recalculatedPayroll = PayrollCalculator.recalculatePayroll(
        payroll,
        user,
        companies[0].payroll_settings
      );

      // 編集履歴エントリを作成（変更された項目を動的に取得）
      const changedFields = [];
      if (
        payroll.payment_items.overtime_allowance !==
        recalculatedPayroll.payment_items.overtime_allowance
      ) {
        changedFields.push('残業手当');
      }
      if (payroll.net_payment !== recalculatedPayroll.net_payment) {
        changedFields.push('差引支給額');
      }

      const editHistoryEntry = createRecalculationEditHistoryEntry(
        currentUserName,
        now,
        changedFields
      );

      // 編集履歴を追加
      const updatedEditHistory = [...(payroll.edit_history || []), editHistoryEntry];

      return {
        ...recalculatedPayroll,
        edit_history: updatedEditHistory,
        updated_at: now,
        updated_by: currentUserName,
      };
    });

    // 給与データを更新
    setPayrolls(updatedPayrolls);

    toast({
      title: '再計算完了',
      description: `${recalculateResults.length}件の給与データが再計算されました`,
    });

    // 状態をリセット
    setIsRecalculateDialogOpen(false);
    setIsRecalculateMode(false);
    setSelectedPayrollIds(new Set());
    setRecalculateResults([]);
    setOriginalPayrolls(new Map());
  };

  const handleRecalculateCancel = () => {
    // 再計算をキャンセル（元のデータにロールバック）
    if (originalPayrolls.size > 0) {
      const updatedPayrolls = payrolls.map((payroll) => {
        const originalPayroll = originalPayrolls.get(payroll.id);
        return originalPayroll || payroll;
      });
      setPayrolls(updatedPayrolls);
    }

    toast({
      title: '再計算キャンセル',
      description: '再計算がキャンセルされました',
    });

    // 状態をリセット
    setIsRecalculateDialogOpen(false);
    setIsRecalculateMode(false);
    setSelectedPayrollIds(new Set());
    setRecalculateResults([]);
    setOriginalPayrolls(new Map());
  };

  return (
    <div className='space-y-6'>
      <StatusAlert />
      {/* サマリー */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>従業員数</p>
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
                <p className='text-2xl font-bold text-gray-900'>
                  {toFullWidthNumber(
                    filteredPayrolls.filter((p) => !p.is_checked_by_member).length
                  )}
                  件
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-400'>
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
                      {toFullWidthNumber(
                        filteredPayrolls.filter((p) => p.status === '未処理').length
                      )}
                      件
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
                      {toFullWidthNumber(
                        filteredPayrolls.filter((p) => p.status === '承認待ち').length
                      )}
                      件
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
                      {toFullWidthNumber(
                        filteredPayrolls.filter((p) => p.status === '承認済み').length
                      )}
                      件
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
                      {toFullWidthNumber(
                        filteredPayrolls.filter((p) => p.status === '支払完了').length
                      )}
                      件
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-400'>
                    <CircleDollarSign className='w-6 h-6 text-blue-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 給与リスト */}
      <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
        <CardContent className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-2xl font-bold text-gray-900'>給与リスト</p>
            <div className='flex'>
              <HeaderButton
                setIsColumnSettingsDialogOpen={() => setIsColumnSettingsOpen(true)}
                onRecalculateClick={handleRecalculateClick}
                isRecalculateMode={isRecalculateMode}
                setIsRecalculateMode={setIsRecalculateMode}
                isRecalculating={isRecalculating}
              />
            </div>
          </div>
          <Filter
            filters={filters}
            onFiltersChangeAction={handleFiltersChange}
            selectedMonth={selectedMonth}
            onMonthChangeAction={handleMonthChange}
            users={users.map((user) => ({
              id: user.id,
              family_name: user.family_name,
              first_name: user.first_name,
            }))}
            groups={users.map((user) => user.primary_group).filter(Boolean)}
            workTypes={Array.from(
              new Map(
                users.map((user) => [
                  user.work_type.name,
                  {
                    id: user.work_type.id,
                    name: user.work_type.name,
                  },
                ])
              ).values()
            )}
            employeeTypes={Array.from(
              new Map(
                users.map((user) => [
                  user.employee_type.name,
                  {
                    id: user.employee_type.id,
                    name: user.employee_type.name,
                  },
                ])
              ).values()
            )}
          />
          <div className='w-full'>
            {!isLoaded ? (
              <div className='flex justify-center items-center h-32'>
                <div className='text-gray-500'>読み込み中...</div>
              </div>
            ) : (
              <Table className='overflow-x-auto'>
                <TableHeader>
                  <TableRow>
                    {isRecalculateMode && (
                      <TableHead className='whitespace-nowrap text-center text-bold text-yellow-800 bg-yellow-100'>
                        再計算の対象
                        <span className='relative ml-2'>
                          <div className='absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 top-0.5 opacity-75 animate-ping'></div>
                          <div className='relative inline-flex h-3 w-3 rounded-full bg-yellow-500'></div>
                        </span>
                      </TableHead>
                    )}
                    {columnSettings.group && (
                      <TableHead className='whitespace-nowrap'>所属グループ</TableHead>
                    )}
                    {columnSettings.employee && (
                      <TableHead className='whitespace-nowrap'>従業員名</TableHead>
                    )}
                    {columnSettings.workType && (
                      <TableHead className='whitespace-nowrap'>雇用形態</TableHead>
                    )}
                    {columnSettings.workForm && (
                      <TableHead className='whitespace-nowrap'>勤務形態</TableHead>
                    )}
                    {columnSettings.attendanceRate && (
                      <TableHead className='whitespace-nowrap'>出勤率</TableHead>
                    )}
                    {columnSettings.actualWorkingHours && (
                      <TableHead className='whitespace-nowrap'>通常勤務時間</TableHead>
                    )}
                    {columnSettings.overtimeHours && (
                      <TableHead className='whitespace-nowrap'>残業時間</TableHead>
                    )}
                    {columnSettings.memberCheck && (
                      <TableHead className='whitespace-nowrap'>従業員の確認</TableHead>
                    )}
                    {columnSettings.status && (
                      <TableHead className='whitespace-nowrap'>ステータス</TableHead>
                    )}
                    <TableHead className='whitespace-nowrap'>修正</TableHead>
                    {columnSettings.netPayment && (
                      <TableHead className='whitespace-nowrap'>差引支給額</TableHead>
                    )}
                    {columnSettings.payrollDate && (
                      <TableHead className='whitespace-nowrap'>給与日時</TableHead>
                    )}
                    {columnSettings.updatedAt && (
                      <TableHead className='whitespace-nowrap'>更新日時</TableHead>
                    )}
                    {columnSettings.updatedBy && (
                      <TableHead className='whitespace-nowrap'>更新者</TableHead>
                    )}
                    {columnSettings.actions && (
                      <TableHead className='whitespace-nowrap'>操作</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayrolls.map((payroll) => {
                    const user = users.find((u) => u.id === payroll.user_id);
                    const attendanceRate = (payroll.attendance_data.working_days / 22) * 100; // 22日を基準とした出勤率

                    return (
                      <TableRow key={payroll.id}>
                        {isRecalculateMode && (
                          <TableCell className='whitespace-nowrap text-center align-middle bg-yellow-100'>
                            <input
                              type='checkbox'
                              checked={selectedPayrollIds.has(payroll.id)}
                              onChange={(e) => handlePayrollSelect(payroll.id, e.target.checked)}
                              className='w-4 h-4 text-yellow-800  border-gray-300 rounded focus:ring-yellow-500 focus:ring-2'
                            />
                          </TableCell>
                        )}
                        {columnSettings.group && (
                          <TableCell className='whitespace-nowrap'>
                            {user?.primary_group.name || '-'}
                          </TableCell>
                        )}
                        {columnSettings.employee && (
                          <TableCell className='whitespace-nowrap'>
                            {user ? getUserFullName(user.family_name, user.first_name) : '-'}
                          </TableCell>
                        )}
                        {columnSettings.workType && (
                          <TableCell className='whitespace-nowrap'>
                            {user?.work_type.name || '-'}
                          </TableCell>
                        )}
                        {columnSettings.workForm && (
                          <TableCell className='whitespace-nowrap'>
                            {user?.employee_type.name || '-'}
                          </TableCell>
                        )}
                        {columnSettings.attendanceRate && (
                          <TableCell className='whitespace-nowrap'>
                            {attendanceRate.toFixed(1)}%
                          </TableCell>
                        )}
                        {columnSettings.actualWorkingHours && (
                          <TableCell className='whitespace-nowrap'>
                            {formatMinutesToHoursMinutes(
                              payroll.attendance_data.actual_working_hours.normal_work * 60
                            )}
                          </TableCell>
                        )}
                        {columnSettings.overtimeHours && (
                          <TableCell className='whitespace-nowrap'>
                            {formatMinutesToHoursMinutes(
                              payroll.attendance_data.actual_working_hours.overtime_hours * 60
                            )}
                          </TableCell>
                        )}
                        {columnSettings.memberCheck && (
                          <TableCell className='whitespace-nowrap'>
                            {payroll.is_checked_by_member ? (
                              <div className='flex items-center justify-center'>
                                <Check className='w-4 h-4 text-green-600' />
                              </div>
                            ) : (
                              <div className='flex items-center justify-center'>
                                <span className='px-2 py-1 rounded-full text-red-600  bg-red-100 border-2 border-red-600 text-xs font-medium'>
                                  未確認
                                </span>
                              </div>
                            )}
                          </TableCell>
                        )}
                        {columnSettings.status && (
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payroll.status)}`}
                            >
                              {payroll.status}
                            </span>
                          </TableCell>
                        )}
                        <TableCell>
                          {(() => {
                            const hasEditHistory =
                              payroll.edit_history && payroll.edit_history.length > 0;
                            return (
                              hasEditHistory && (
                                <Badge
                                  variant='secondary'
                                  className='bg-orange-100 text-orange-800'
                                >
                                  修正済み
                                </Badge>
                              )
                            );
                          })()}
                        </TableCell>
                        {columnSettings.netPayment && (
                          <TableCell className='font-medium'>
                            {formatCurrency(payroll.net_payment)}
                          </TableCell>
                        )}
                        {columnSettings.payrollDate && (
                          <TableCell>{formatDate(payroll.payroll_date)}</TableCell>
                        )}
                        {columnSettings.updatedAt && (
                          <TableCell className='whitespace-nowrap'>
                            {formatCompactDateTime(payroll.updated_at)}
                          </TableCell>
                        )}
                        {columnSettings.updatedBy && (
                          <TableCell className='whitespace-nowrap'>{payroll.updated_by}</TableCell>
                        )}
                        {columnSettings.actions && (
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <ActionButton
                                action='view'
                                onClick={() => handlePreviewClick(payroll.id)}
                              />
                              <ActionButton
                                action='edit'
                                onClick={() => handleEditClick(payroll.id)}
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* プレビューダイアログ */}
      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        payrollId={selectedPayrollId}
      />

      {/* 編集ダイアログ */}
      <EditDialog isOpen={isEditOpen} onClose={handleCloseEdit} payrollId={selectedPayrollId} />

      {/* 列設定ダイアログ */}
      <ColumnSettingsDialog
        isOpen={isColumnSettingsOpen}
        onClose={() => setIsColumnSettingsOpen(false)}
        onSave={handleColumnSettingsSave}
        currentSettings={columnSettings}
      />

      {/* 再計算確認ダイアログ */}
      <RecalculateConfirmationDialog
        isOpen={isRecalculateDialogOpen}
        onClose={() => setIsRecalculateDialogOpen(false)}
        onApply={handleRecalculateApply}
        onCancel={handleRecalculateCancel}
        results={recalculateResults}
      />
    </div>
  );
}
