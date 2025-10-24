'use client';

import CommonColumnSettingsDialog from '@/components/common/ColumnSettingsDialog';
import type { AttendanceColumnSettings } from '@/schemas/column-settings';

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

const columnLabels: Record<keyof AttendanceColumnSettings, string> = {
  group: '所属グループ',
  employee: '従業員名',
  workType: '勤務形態',
  workDate: '勤務日',
  clockIn: '出勤時刻',
  clockOut: '退勤時刻',
  workHours: '勤務時間',
  overtime: '残業時間',
  status: 'ステータス',
  actions: '操作',
};

interface AttendanceColumnSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AttendanceColumnSettings) => void;
  currentSettings: AttendanceColumnSettings;
}

export default function AttendanceColumnSettingsDialog({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: AttendanceColumnSettingsDialogProps) {
  return (
    <CommonColumnSettingsDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      currentSettings={currentSettings}
      columnLabels={columnLabels}
      defaultSettings={defaultColumnSettings}
      title='勤怠リストの列表示設定'
    />
  );
}
