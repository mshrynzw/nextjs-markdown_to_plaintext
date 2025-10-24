import { PayrollCalculator } from '@/lib/utils/payroll';
import { getUserFullName } from '@/lib/utils/user';
import type { Attendance, Payroll, Setting, User } from '@/schemas';

export function getInitialPayrolls(
  users: User[],
  attendances: Attendance[],
  mockSettings: Setting,
  monthOffset: number = 12
): Payroll[] {
  const payrolls: Payroll[] = [];
  const currentDate = new Date();

  // 管理者ユーザーを取得
  const adminUsers = users.filter((user) => user.role === 'admin');

  // 指定された月数分の給与データを生成
  for (let month = 0; month < monthOffset; month++) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - month, 1);
    const currentYear = targetDate.getFullYear();
    const currentMonth = targetDate.getMonth();

    // 今月のデータの場合、条件を満たすまで再生成
    if (month === 0) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const monthPayrolls: Payroll[] = [];

        // 各ユーザーの給与データを生成
        users.forEach((user) => {
          const payroll = generatePayrollForUser(
            user,
            attendances,
            adminUsers,
            mockSettings,
            currentYear,
            currentMonth,
            month
          );
          monthPayrolls.push(payroll);
        });

        // 条件チェック
        if (mockSettings.mode === 'warning') {
          // warning: 今月の勤怠未確認が1人以上
          const unconfirmedCount = monthPayrolls.filter((p) => !p.is_checked_by_member).length;
          if (unconfirmedCount >= 1) {
            payrolls.push(...monthPayrolls);
            break;
          }
        } else {
          // normal/alert: 今月の勤怠未確認が0人（normal）または条件なし（alert）
          payrolls.push(...monthPayrolls);
          break;
        }
      }
    } else {
      // 今月以外
      users.forEach((user) => {
        const payroll = generatePayrollForUser(
          user,
          attendances,
          adminUsers,
          mockSettings,
          currentYear,
          currentMonth,
          month
        );
        payrolls.push(payroll);
      });
    }
  }

  return payrolls;
}

// 個別ユーザーの給与データを生成する関数
function generatePayrollForUser(
  user: User,
  attendances: Attendance[],
  adminUsers: User[],
  mockSettings: Setting,
  currentYear: number,
  currentMonth: number,
  month: number
): Payroll {
  const company = user.company;
  const settings = company.payroll_settings;

  // 給与期間を計算
  const period = PayrollCalculator.calculatePayrollPeriod(
    settings,
    currentYear,
    currentMonth as number
  );

  // 実際の勤怠データから勤務時間を計算
  const userAttendances = attendances.filter(
    (att) =>
      att.user_id === user.id &&
      new Date(att.work_date).getFullYear() === currentYear &&
      new Date(att.work_date).getMonth() === currentMonth
  );

  // 勤務日数と勤務時間を計算
  const workingDays = userAttendances.filter((att) => att.status !== 'absent').length;
  const normalWorkMinutes = userAttendances
    .filter((att) => att.actual_work_minutes !== undefined)
    .reduce((sum, att) => sum + (att.actual_work_minutes || 0), 0);
  const overtimeMinutes = userAttendances.reduce(
    (sum, att) => sum + (att.overtime_minutes || 0),
    0
  );

  const normalWorkHours = normalWorkMinutes / 60;
  const overtimeHours = overtimeMinutes / 60;
  const holidayWorkHours = 0; // 休日出勤は現在の勤怠データに含まれていないため0
  const totalWorkHours = normalWorkHours + overtimeHours + holidayWorkHours;

  // 残業手当を計算
  const overtimeAllowance = Math.floor(
    ((overtimeHours * user.fixed_values.base_salary) / 160) * 1.25
  );

  // 支給項目を計算
  const paymentItems = PayrollCalculator.calculatePaymentItems(
    settings,
    user.fixed_values.base_salary,
    overtimeAllowance
  );

  // 所得税・住民税を計算
  const incomeTaxRate = user.fixed_values.income_tax_category === '甲' ? 0.1 : 0.05;
  const residentTaxRate = 0.06;
  const incomeTax = Math.floor(paymentItems.total_payment * incomeTaxRate);
  const residentTax = Math.floor(paymentItems.total_payment * residentTaxRate);

  // 控除項目を計算
  const deductionItems = PayrollCalculator.calculateDeductionItems(
    settings,
    user.fixed_values.base_salary,
    incomeTax,
    residentTax
  );

  // 差引支給額を計算
  const netPayment = PayrollCalculator.calculateNetPayment(paymentItems, deductionItems);

  // 給与日を計算
  const payrollDate = PayrollCalculator.calculatePayrollDate(settings, period.end);

  // ステータスを締め切り日と従業員確認状況に基づいて決定
  let status: '未処理' | '承認待ち' | '承認済み' | '支払完了';
  let isCheckedByMember: boolean;

  if (month === 0) {
    // 今月（昨日締め切り分）の給与データ
    // modeに基づいて確認状況を決定
    if (mockSettings.mode === 'normal') {
      // normal: 今月の勤怠未確認が0人（normal）または条件なし（alert）
      isCheckedByMember = true;
      status = Math.random() < 0.5 ? '承認待ち' : '承認済み';
      // warning: 完処理';
    } else {
      // 全にランダムで未確認状態を決定
      isCheckedByMember = Math.random() < 0.5;
      if (!isCheckedByMember) {
        status = '未処理';
      } else {
        status = Math.random() < 0.5 ? '承認待ち' : '承認済み';
      }
    }
  } else if (month === 1) {
    // 前月のデータ
    if (mockSettings.mode === 'alert') {
      // alert: 前月の支払い未完了が1人以上
      isCheckedByMember = true;
      // 完全にランダムで未完了状態を生成
      if (Math.random() < 0.5) {
        // 50%の確率で未完了
        const processStatuses = ['未処理', '承認待ち', '承認済み'] as const;
        const randomIndex = Math.floor(Math.random() * processStatuses.length);
        status = processStatuses[randomIndex];
      } else {
        status = '支払完了';
      }
    } else {
      // normal/warning: 前月は支払完了
      status = '支払完了';
      isCheckedByMember = true;
    }
  } else {
    // それより前の月はすべて支払完了に固定
    status = '支払完了';
    isCheckedByMember = true;
  }

  const payroll: Payroll = {
    id: `payroll_${user.id}_${currentYear}_${currentMonth}`,
    user_id: user.id,
    company_id: user.company.id,
    period_start: period.start.toISOString(),
    period_end: period.end.toISOString(),
    is_checked_by_member: isCheckedByMember,
    status: status,
    payment_items: paymentItems,
    deduction_items: deductionItems,
    net_payment: netPayment,
    attendance_data: {
      period: `${currentYear}年${currentMonth}月`,
      working_days: workingDays,
      actual_working_hours: {
        normal_work: normalWorkHours,
        overtime_hours: overtimeHours,
        holiday_work: holidayWorkHours,
        total: totalWorkHours,
      },
      paid_leave_used: Math.floor(Math.random() * 3),
      remaining_paid_leave: 20 - Math.floor(Math.random() * 5),
    },
    hourly_rates: {
      base_hourly_rate: Math.floor(user.fixed_values.base_salary / 160),
      overtime_hourly_rate: Math.floor((user.fixed_values.base_salary / 160) * 1.25),
      effective_hourly_rate: Math.floor(netPayment / totalWorkHours),
    },
    payroll_date: payrollDate.toISOString(),
    created_at: new Date().toISOString(),
    updated_by: getUserFullName(user.family_name, user.first_name),
    updated_at: new Date().toISOString(),
  };

  // 履歴変更を生成
  if (adminUsers.length > 0) {
    const randomAdmin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
    payroll.edit_history = generatePayrollEditHistory(payroll, randomAdmin, mockSettings);
  }

  return payroll;
}

// 給与履歴変更を生成する関数
function generatePayrollEditHistory(
  originalPayroll: Payroll,
  adminUser: User,
  mockSettings: Setting
) {
  const changeReasons = [
    '残業時間の修正',
    '基本給の調整',
    '手当の見直し',
    '控除項目の修正',
    'ステータスの変更',
    '従業員確認の修正',
    '勤務時間の再計算',
    '給与計算の見直し',
  ];

  const editHistory = [];
  const now = new Date();

  // 編集履歴を作成する確率（各回で判定）
  for (let i = 0; i < 3; i++) {
    if (Math.random() < mockSettings.payroll_history_ratio / 100) {
      const edit = {
        edited_by: adminUser.id,
        edited_at: new Date(
          now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000 - i * 24 * 60 * 60 * 1000
        ).toISOString(),
        source_id: originalPayroll.id,
        edit_reason: changeReasons[Math.floor(Math.random() * changeReasons.length)],
      };
      editHistory.push(edit);
    } else {
      break; // 確率に外れたら編集履歴作成を終了
    }
  }

  return editHistory;
}
