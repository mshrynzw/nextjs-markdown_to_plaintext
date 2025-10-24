import type { Attendance } from '@/schemas';

import { formatMinutes, formatTime } from './datetime';

/**
 * 勤怠記録の変更内容を比較して変更された項目を取得
 * @param current 現在のレコード
 * @param previous 前のレコード
 * @returns 変更された項目の配列
 */
export function getAttendanceChanges(
  current: Attendance,
  previous: Attendance
): Array<{
  field: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
}> {
  const changes: Array<{
    field: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
  }> = [];

  // 比較するフィールドの定義
  const fields = [
    { key: 'actual_work_minutes', name: '実際勤務時間' },
    { key: 'overtime_minutes', name: '残業時間' },
    { key: 'late_minutes', name: '遅刻時間' },
    { key: 'early_leave_minutes', name: '早退時間' },
    { key: 'status', name: 'ステータス' },
    { key: 'description', name: '説明' },
    { key: 'auto_calculated', name: '自動計算' },
  ];

  fields.forEach(({ key, name }) => {
    const currentValue = current[key as keyof Attendance];
    const previousValue = previous[key as keyof Attendance];

    // 値が異なる場合のみ追加
    if (currentValue !== previousValue) {
      let oldValue = previousValue;
      let newValue = currentValue;

      // 時間（分）の場合はフォーマット
      if (
        key === 'actual_work_minutes' ||
        key === 'overtime_minutes' ||
        key === 'late_minutes' ||
        key === 'early_leave_minutes'
      ) {
        oldValue =
          previousValue !== null && previousValue !== undefined
            ? formatMinutes(previousValue as number)
            : '0h00m';
        newValue =
          currentValue !== null && currentValue !== undefined
            ? formatMinutes(currentValue as number)
            : '0h00m';
      }

      // 自動計算の場合は日本語表示
      if (key === 'auto_calculated') {
        oldValue = previousValue ? '有効' : '無効';
        newValue = currentValue ? '有効' : '無効';
      }

      // ステータスの場合は日本語表示
      if (key === 'status') {
        const statusMap: Record<string, string> = {
          normal: '正常',
          late: '遅刻',
          early_leave: '早退',
          absent: '欠勤',
        };
        oldValue = statusMap[previousValue as string] || (previousValue as string);
        newValue = statusMap[currentValue as string] || (currentValue as string);
      }

      // 空の値の場合は「未設定」と表示
      if (oldValue === '' || oldValue === null || oldValue === undefined) {
        oldValue = '未設定';
      }
      if (newValue === '' || newValue === null || newValue === undefined) {
        newValue = '未設定';
      }

      changes.push({
        field: key,
        fieldName: name,
        oldValue: String(oldValue),
        newValue: String(newValue),
      });
    }
  });

  // 出勤・退勤時刻の変更をチェック
  if (current.clock_in_time !== previous.clock_in_time) {
    changes.push({
      field: 'clock_in_time',
      fieldName: '出勤時刻',
      oldValue: previous.clock_in_time ? formatTime(previous.clock_in_time) : '--:--',
      newValue: current.clock_in_time ? formatTime(current.clock_in_time) : '--:--',
    });
  }

  if (current.clock_out_time !== previous.clock_out_time) {
    changes.push({
      field: 'clock_out_time',
      fieldName: '退勤時刻',
      oldValue: previous.clock_out_time ? formatTime(previous.clock_out_time) : '--:--',
      newValue: current.clock_out_time ? formatTime(current.clock_out_time) : '--:--',
    });
  }

  // 休憩記録の変更をチェック
  const currentBreaks = current.break_records || [];
  const previousBreaks = previous.break_records || [];

  if (JSON.stringify(currentBreaks) !== JSON.stringify(previousBreaks)) {
    const currentBreakCount = currentBreaks.length;
    const previousBreakCount = previousBreaks.length;

    changes.push({
      field: 'break_records',
      fieldName: '休憩記録',
      oldValue: `${previousBreakCount}回`,
      newValue: `${currentBreakCount}回`,
    });
  }

  return changes;
}

/**
 * 編集履歴の表示用データを生成
 * @param editHistory 編集履歴の配列
 * @returns 表示用の編集履歴データ
 */
export function formatEditHistory(editHistory: Attendance[]) {
  return editHistory.map((record, index) => {
    const changes = index > 0 ? getAttendanceChanges(editHistory[index - 1], record) : [];

    return {
      id: record.id,
      editedAt: record.updated_at,
      changes,
      editReason: record.edit_history?.[0]?.edit_reason || '',
      editedBy: record.edit_history?.[0]?.edited_by || '',
    };
  });
}

/**
 * 編集履歴のモックデータを生成
 * @param attendanceId 勤怠ID
 * @param adminUsers 管理者ユーザーの配列
 * @returns 編集履歴のモックデータ
 */
export function generateMockEditHistory(
  attendanceId: string,
  adminUsers: Array<{ id: string; family_name: string; first_name: string }> = []
): Attendance[] {
  // ランダムな管理者を選択
  const randomAdmin =
    adminUsers.length > 0
      ? adminUsers[Math.floor(Math.random() * adminUsers.length)]
      : { id: 'admin_1', family_name: '管理者', first_name: '1' };

  const adminName = `${randomAdmin.family_name} ${randomAdmin.first_name}`;

  return [
    {
      id: attendanceId,
      user_id: '1',
      work_date: '2024-01-20',
      work_type_id: '0',
      clock_in_time: '2024-01-20T09:00:00Z',
      clock_out_time: '2024-01-20T18:00:00Z',
      break_records: [
        { start: '12:00', end: '13:00' },
        { start: '15:00', end: '15:15' },
      ],
      actual_work_minutes: 480,
      overtime_minutes: 0,
      late_minutes: 0,
      early_leave_minutes: 0,
      status: 'normal',
      auto_calculated: true,
      description: '',
      created_at: '2024-01-20T08:49:00Z',
      updated_at: '2024-01-20T08:49:00Z',
    },
    {
      id: `edit_${attendanceId}_1`,
      user_id: '1',
      work_date: '2024-01-20',
      work_type_id: '0',
      clock_in_time: '2024-01-20T09:00:00Z',
      clock_out_time: '2024-01-20T18:00:00Z',
      break_records: [
        { start: '12:00', end: '13:00' },
        { start: '15:00', end: '15:15' },
      ],
      actual_work_minutes: 13070, // 217h50m
      overtime_minutes: 13070, // 209h50m
      late_minutes: 0,
      early_leave_minutes: 0,
      status: 'normal',
      auto_calculated: false,
      description: '手動で勤務時間を修正',
      created_at: '2024-01-20T08:49:00Z',
      updated_at: '2024-01-20T08:49:00Z',
      edit_history: [
        {
          edited_by: adminName,
          edited_at: '2024-01-20T08:49:00Z',
          source_id: attendanceId,
          edit_reason: '勤務時間の手動修正',
        },
      ],
    },
  ];
}
