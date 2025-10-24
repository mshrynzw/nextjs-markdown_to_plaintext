import { useMemo } from 'react';

import { useMock } from '@/contexts/mock-context';

export interface PayrollFilters {
  selectedMonth: string | null;
  status: string[];
  hasOvertime: boolean | null;
  workTypeId: string | null;
  employeeTypeId: string | null;
  userId: string | null;
  groupId: string | null;
  memberCheckStatus: 'all' | 'checked' | 'unchecked';
}

export const useFilteredPayrolls = (filters: PayrollFilters) => {
  const { payrolls, users } = useMock();

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) => {
      const user = users.find((u) => u.id === payroll.user_id);
      if (!user) return false;

      // 月選択フィルター（給与期間の終了日で判定）
      if (filters.selectedMonth) {
        const periodEndDate = new Date(payroll.period_end);
        const payrollMonth = `${periodEndDate.getFullYear()}-${String(periodEndDate.getMonth() + 2).padStart(2, '0')}`;
        if (payrollMonth !== filters.selectedMonth) {
          return false;
        }
      }

      // ステータスフィルター
      if (filters.status.length > 0 && !filters.status.includes(payroll.status)) {
        return false;
      }

      // ユーザーフィルター
      if (filters.userId && payroll.user_id !== filters.userId) {
        return false;
      }

      // グループフィルター
      if (filters.groupId && user.primary_group?.id !== filters.groupId) {
        return false;
      }

      // 勤務形態フィルター
      if (filters.workTypeId && user.work_type.name !== filters.workTypeId) {
        return false;
      }

      // 雇用状態フィルター
      if (filters.employeeTypeId && user.employee_type.name !== filters.employeeTypeId) {
        return false;
      }

      // 残業時間フィルター
      if (filters.hasOvertime !== null) {
        const hasOvertime = payroll.attendance_data.actual_working_hours.overtime_hours > 0;
        if (filters.hasOvertime !== hasOvertime) {
          return false;
        }
      }

      // 従業員確認フィルター
      if (filters.memberCheckStatus !== 'all') {
        const isChecked = payroll.is_checked_by_member;
        if (filters.memberCheckStatus === 'checked' && !isChecked) {
          return false;
        }
        if (filters.memberCheckStatus === 'unchecked' && isChecked) {
          return false;
        }
      }

      return true;
    });
  }, [payrolls, users, filters]);

  return filteredPayrolls;
};
