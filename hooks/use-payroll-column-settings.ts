import type { PayrollColumnSettings } from '@/schemas/column-settings';

import useColumnSettings from './use-column-settings';

const STORAGE_KEY = 'payroll-column-settings';

const defaultColumnSettings: PayrollColumnSettings = {
  group: false,
  employee: true,
  workType: true,
  workForm: true,
  attendanceRate: false,
  actualWorkingHours: true,
  overtimeHours: true,
  memberCheck: true,
  status: true,
  netPayment: true,
  payrollDate: true,
  updatedAt: false,
  updatedBy: true,
  actions: true,
};

export default function usePayrollColumnSettings() {
  return useColumnSettings(STORAGE_KEY, defaultColumnSettings);
}
