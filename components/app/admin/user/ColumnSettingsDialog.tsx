'use client';

import ColumnSettingsDialog from '@/components/common/ColumnSettingsDialog';
import type { UserColumnSettings } from '@/schemas/column-settings';

interface UserColumnSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: UserColumnSettings) => void;
  currentSettings: UserColumnSettings;
}

const defaultColumnSettings: UserColumnSettings = {
  group: true,
  employee: true,
  workType: true,
  status: true,
  email: false,
  phone: false,
  createdAt: false,
  updatedAt: false,
  actions: true,
};

const columnLabels: Record<keyof UserColumnSettings, string> = {
  group: '所属グループ',
  employee: '従業員名',
  workType: '雇用形態',
  status: 'ロール',
  email: 'メールアドレス',
  phone: '電話番号',
  createdAt: '登録日時',
  updatedAt: '更新日時',
  actions: '操作',
};

export default function UserColumnSettingsDialog({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: UserColumnSettingsDialogProps) {
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
