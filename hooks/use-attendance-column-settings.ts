import type { AttendanceColumnSettings } from '@/schemas/column-settings';

import useColumnSettings from './use-column-settings';

const STORAGE_KEY = 'attendance-column-settings';

const defaultColumnSettings: AttendanceColumnSettings = {
  group: false,
  employee: true,
  workType: false,
  workDate: true,
  clockIn: true,
  clockOut: true,
  workHours: true,
  overtime: true,
  status: true,
  actions: true,
};

export default function useAttendanceColumnSettings() {
  return useColumnSettings(STORAGE_KEY, defaultColumnSettings);
}
