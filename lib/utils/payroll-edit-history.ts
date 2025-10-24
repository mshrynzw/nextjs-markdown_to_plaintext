import type { Payroll } from '@/schemas';

/**
 * 給与記録の変更内容を比較して変更された項目を取得
 * @param current 現在のレコード
 * @param previous 前のレコード
 * @returns 変更された項目の配列
 */
export function getPayrollChanges(
  current: Payroll,
  previous: Payroll
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
    { key: 'status', name: 'ステータス' },
    { key: 'is_checked_by_member', name: '従業員確認' },
    { key: 'net_payment', name: '差引支給額' },
  ];

  fields.forEach(({ key, name }) => {
    const currentValue = current[key as keyof Payroll];
    const previousValue = previous[key as keyof Payroll];

    // 値が異なる場合のみ追加
    if (currentValue !== previousValue) {
      let oldValue = previousValue;
      let newValue = currentValue;

      // ステータスの場合は日本語表示
      if (key === 'status') {
        const statusMap: Record<string, string> = {
          未処理: '未処理',
          承認待ち: '承認待ち',
          承認済み: '承認済み',
          支払完了: '支払完了',
        };
        oldValue = statusMap[previousValue as string] || (previousValue as string);
        newValue = statusMap[currentValue as string] || (currentValue as string);
      }

      // 従業員確認の場合は日本語表示
      if (key === 'is_checked_by_member') {
        oldValue = previousValue ? '確認済み' : '未確認';
        newValue = currentValue ? '確認済み' : '未確認';
      }

      // 金額の場合は通貨フォーマット
      if (key === 'net_payment') {
        oldValue = `¥${(previousValue as number).toLocaleString()}`;
        newValue = `¥${(currentValue as number).toLocaleString()}`;
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

  // 支給項目の変更をチェック
  const currentPayment = current.payment_items;
  const previousPayment = previous.payment_items;

  if (JSON.stringify(currentPayment) !== JSON.stringify(previousPayment)) {
    const paymentFields = [
      { key: 'base_salary', name: '基本給' },
      { key: 'overtime_allowance', name: '残業手当' },
      { key: 'commuting_allowance', name: '通勤手当' },
      { key: 'housing_allowance', name: '住宅手当' },
      { key: 'total_payment', name: '総支給額' },
    ];

    paymentFields.forEach(({ key, name }) => {
      const currentValue = currentPayment[key as keyof typeof currentPayment];
      const previousValue = previousPayment[key as keyof typeof previousPayment];

      if (currentValue !== previousValue) {
        changes.push({
          field: `payment_items.${key}`,
          fieldName: name,
          oldValue: `¥${(previousValue as number).toLocaleString()}`,
          newValue: `¥${(currentValue as number).toLocaleString()}`,
        });
      }
    });
  }

  // 控除項目の変更をチェック
  const currentDeduction = current.deduction_items;
  const previousDeduction = previous.deduction_items;

  if (JSON.stringify(currentDeduction) !== JSON.stringify(previousDeduction)) {
    const deductionFields = [
      { key: 'health_insurance', name: '健康保険' },
      { key: 'employee_pension', name: '厚生年金' },
      { key: 'employment_insurance', name: '雇用保険' },
      { key: 'income_tax', name: '所得税' },
      { key: 'resident_tax', name: '住民税' },
      { key: 'total_deduction', name: '総控除額' },
    ];

    deductionFields.forEach(({ key, name }) => {
      const currentValue = currentDeduction[key as keyof typeof currentDeduction];
      const previousValue = previousDeduction[key as keyof typeof previousDeduction];

      if (currentValue !== previousValue) {
        changes.push({
          field: `deduction_items.${key}`,
          fieldName: name,
          oldValue: `¥${(previousValue as number).toLocaleString()}`,
          newValue: `¥${(currentValue as number).toLocaleString()}`,
        });
      }
    });
  }

  // 勤怠データの変更をチェック
  const currentAttendance = current.attendance_data;
  const previousAttendance = previous.attendance_data;

  if (JSON.stringify(currentAttendance) !== JSON.stringify(previousAttendance)) {
    const attendanceFields = [
      { key: 'working_days', name: '出勤日数' },
      { key: 'paid_leave_used', name: '有給使用日数' },
      { key: 'remaining_paid_leave', name: '残有給日数' },
    ];

    attendanceFields.forEach(({ key, name }) => {
      const currentValue = currentAttendance[key as keyof typeof currentAttendance];
      const previousValue = previousAttendance[key as keyof typeof previousAttendance];

      if (currentValue !== previousValue) {
        changes.push({
          field: `attendance_data.${key}`,
          fieldName: name,
          oldValue: String(previousValue),
          newValue: String(currentValue),
        });
      }
    });

    // 勤務時間の変更をチェック
    const currentWorkHours = currentAttendance.actual_working_hours;
    const previousWorkHours = previousAttendance.actual_working_hours;

    if (JSON.stringify(currentWorkHours) !== JSON.stringify(previousWorkHours)) {
      const workHourFields = [
        { key: 'normal_work', name: '通常勤務時間' },
        { key: 'overtime_hours', name: '残業時間' },
        { key: 'holiday_work', name: '休日出勤時間' },
        { key: 'total', name: '実労働時間合計' },
      ];

      workHourFields.forEach(({ key, name }) => {
        const currentValue = currentWorkHours[key as keyof typeof currentWorkHours];
        const previousValue = previousWorkHours[key as keyof typeof previousWorkHours];

        if (currentValue !== previousValue) {
          changes.push({
            field: `attendance_data.actual_working_hours.${key}`,
            fieldName: name,
            oldValue: `${previousValue}h`,
            newValue: `${currentValue}h`,
          });
        }
      });
    }
  }

  return changes;
}

/**
 * 給与編集履歴の表示用データを生成
 * @param editHistory 編集履歴の配列
 * @returns 表示用の編集履歴データ
 */
export function formatPayrollEditHistory(editHistory: Payroll[]) {
  return editHistory.map((record, index) => {
    const changes = index > 0 ? getPayrollChanges(editHistory[index - 1], record) : [];

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
 * 再計算による編集履歴エントリを生成
 * @param editedBy 編集者名
 * @param editedAt 編集日時
 * @param recalculatedFields 再計算されたフィールド
 * @returns 編集履歴エントリ
 */
export function createRecalculationEditHistoryEntry(
  editedBy: string,
  editedAt: string,
  recalculatedFields: string[] = []
): {
  edited_by: string;
  edited_at: string;
  source_id: string;
  edit_reason: string;
} {
  const fieldNames = recalculatedFields.length > 0 ? recalculatedFields.join('、') : '給与データ';

  return {
    edited_by: editedBy,
    edited_at: editedAt,
    source_id: '',
    edit_reason: `勤怠データに基づく再計算（${fieldNames}）`,
  };
}

/**
 * 給与編集履歴のモックデータを生成
 * @param payrollId 給与ID
 * @param adminUsers 管理者ユーザーの配列
 * @returns 編集履歴のモックデータ
 */
export function generateMockPayrollEditHistory(
  payrollId: string,
  adminUsers: Array<{ id: string; family_name: string; first_name: string }> = []
): Payroll[] {
  // ランダムな管理者を選択
  const randomAdmin =
    adminUsers.length > 0
      ? adminUsers[Math.floor(Math.random() * adminUsers.length)]
      : { id: 'admin_1', family_name: '管理者', first_name: '1' };

  const adminName = `${randomAdmin.family_name} ${randomAdmin.first_name}`;
  return [
    {
      id: payrollId,
      user_id: '1',
      company_id: '1',
      period_start: '2024-01-01T00:00:00Z',
      period_end: '2024-01-31T23:59:59Z',
      is_checked_by_member: false,
      status: '未処理',
      payment_items: {
        base_salary: 300000,
        overtime_allowance: 0,
        commuting_allowance: 15000,
        housing_allowance: 20000,
        total_payment: 335000,
      },
      deduction_items: {
        health_insurance: 26850,
        employee_pension: 24600,
        employment_insurance: 1005,
        income_tax: 15000,
        resident_tax: 12000,
        total_deduction: 79455,
      },
      net_payment: 255545,
      attendance_data: {
        period: '2024年1月',
        working_days: 22,
        actual_working_hours: {
          normal_work: 176,
          overtime_hours: 0,
          holiday_work: 0,
          total: 176,
        },
        paid_leave_used: 0,
        remaining_paid_leave: 20,
      },
      hourly_rates: {
        base_hourly_rate: 1704,
        overtime_hourly_rate: 2556,
        effective_hourly_rate: 1704,
      },
      payroll_date: '2024-02-25T00:00:00Z',
      created_at: '2024-01-20T08:49:00Z',
      updated_by: 'system',
      updated_at: '2024-01-20T08:49:00Z',
    },
    {
      id: `edit_${payrollId}_1`,
      user_id: '1',
      company_id: '1',
      period_start: '2024-01-01T00:00:00Z',
      period_end: '2024-01-31T23:59:59Z',
      is_checked_by_member: true,
      status: '承認済み',
      payment_items: {
        base_salary: 300000,
        overtime_allowance: 50000,
        commuting_allowance: 15000,
        housing_allowance: 20000,
        total_payment: 385000,
      },
      deduction_items: {
        health_insurance: 30800,
        employee_pension: 28200,
        employment_insurance: 1155,
        income_tax: 20000,
        resident_tax: 15000,
        total_deduction: 95155,
      },
      net_payment: 289845,
      attendance_data: {
        period: '2024年1月',
        working_days: 22,
        actual_working_hours: {
          normal_work: 176,
          overtime_hours: 20,
          holiday_work: 0,
          total: 196,
        },
        paid_leave_used: 0,
        remaining_paid_leave: 20,
      },
      hourly_rates: {
        base_hourly_rate: 1704,
        overtime_hourly_rate: 2556,
        effective_hourly_rate: 1964,
      },
      payroll_date: '2024-02-25T00:00:00Z',
      created_at: '2024-01-20T08:49:00Z',
      updated_by: adminName,
      updated_at: '2024-01-20T10:30:00Z',
      edit_history: [
        {
          edited_by: adminName,
          edited_at: '2024-01-20T10:30:00Z',
          source_id: payrollId,
          edit_reason: '残業手当の追加とステータス更新',
        },
      ],
    },
  ];
}
