'use client';

// import { useEffect, useState } from 'react';

import ColumnSettingsDialog from '@/components/common/ColumnSettingsDialog';
import type { PayrollColumnSettings } from '@/schemas/column-settings';

interface PayrollColumnSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: PayrollColumnSettings) => void;
  currentSettings: PayrollColumnSettings;
}

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

const columnLabels: Record<keyof PayrollColumnSettings, string> = {
  group: '所属グループ',
  employee: '従業員名',
  workType: '雇用形態',
  workForm: '勤務形態',
  attendanceRate: '出勤率',
  actualWorkingHours: '通常勤務時間',
  overtimeHours: '残業時間',
  memberCheck: '従業員の確認',
  status: 'ステータス',
  netPayment: '差引支給額',
  payrollDate: '給与日時',
  updatedAt: '更新日時',
  updatedBy: '更新者',
  actions: '操作',
};

export default function PayrollColumnSettingsDialog({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: PayrollColumnSettingsDialogProps) {
  return (
    <ColumnSettingsDialog
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      currentSettings={currentSettings}
      columnLabels={columnLabels}
      defaultSettings={defaultColumnSettings}
      title='列の表示設定'
    />
  );
}
