export interface BaseColumnSettings {
  [key: string]: boolean;
}

export interface AttendanceColumnSettings extends BaseColumnSettings {
  group: boolean;
  employee: boolean;
  workType: boolean;
  workDate: boolean;
  clockIn: boolean;
  clockOut: boolean;
  workHours: boolean;
  overtime: boolean;
  status: boolean;
  actions: boolean;
}

export interface PayrollColumnSettings extends BaseColumnSettings {
  group: boolean;
  employee: boolean;
  workType: boolean;
  workForm: boolean;
  attendanceRate: boolean;
  overtimeHours: boolean;
  memberCheck: boolean;
  status: boolean;
  netPayment: boolean;
  payrollDate: boolean;
  updatedAt: boolean;
  updatedBy: boolean;
  actions: boolean;
}

export interface UserColumnSettings extends BaseColumnSettings {
  group: boolean;
  employee: boolean;
  workType: boolean;
  status: boolean;
  email: boolean;
  phone: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export type ColumnSettingsType =
  | AttendanceColumnSettings
  | PayrollColumnSettings
  | UserColumnSettings;
