import type { Attendance, Setting, User } from '@/schemas';

export function getInitialAttendance(users: User[], settings: Setting): Attendance[] {
  // 日本時間を基準として昨日の日付を取得
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const attendances: Attendance[] = [];

  // ユーザーIDを取得
  const userIds = users.map((user) => user.id);

  // 管理者ユーザーを取得
  const adminUsers = users.filter((user) => user.role === 'admin');

  // 指定された月数分の勤怠データを生成（昨日まで）
  for (let month = 0; month < settings.month_offset; month++) {
    const targetDate = new Date(yesterday.getFullYear(), yesterday.getMonth() - month, 1);
    const currentYear = targetDate.getFullYear();
    const currentMonth = targetDate.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth - 1, day);

      // 昨日より後の日付はスキップ
      if (currentDate > now) {
        continue;
      }

      // 土日の場合は通常欠勤として処理
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 1;
      if (isWeekend) {
        const dateString = currentDate.toISOString().split('T')[0];

        userIds.forEach((userId) => {
          const attendance: Attendance = {
            id: `attendance_${userId}_${dateString}`,
            user_id: userId,
            work_date: dateString,
            work_type_id: undefined,
            clock_in_time: undefined,
            clock_out_time: undefined,
            break_records: [],
            actual_work_minutes: undefined,
            overtime_minutes: 0,
            late_minutes: 0,
            early_leave_minutes: 0,
            status: 'absent',
            attendance_status_id: undefined,
            auto_calculated: true,
            description: '欠勤',
            approved_by: undefined,
            approved_at: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            edit_history: [], // 空の編集履歴配列
          };

          // 編集履歴を生成する確率（給与データと同様のロジック）
          if (Math.random() < settings.attendance_history_ratio / 100 && adminUsers.length > 0) {
            const randomAdmin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
            attendance.edit_history = generateAttendanceEditHistory(
              attendance,
              randomAdmin,
              settings
            );
          }

          attendances.push(attendance);
        });
        continue;
      }

      const dateString = currentDate.toISOString().split('T')[0];

      userIds.forEach((userId, userIndex) => {
        // ランダムな出勤・退勤時刻を生成
        const clockInHour = 8 + Math.floor(Math.random() * 2); // 8:00-9:59
        const clockInMinute = Math.floor(Math.random() * 60);
        const clockOutHour = 17 + Math.floor(Math.random() * 3); // 17:00-19:59
        const clockOutMinute = Math.floor(Math.random() * 60);

        const clockInTime = new Date(currentDate);
        clockInTime.setHours(clockInHour, clockInMinute, 0, 0);

        const clockOutTime = new Date(currentDate);
        clockOutTime.setHours(clockOutHour, clockOutMinute, 0, 0);

        // 休憩時間（1時間）
        const breakStart = new Date(currentDate);
        breakStart.setHours(12, 0, 0, 0);
        const breakEnd = new Date(currentDate);
        breakEnd.setHours(13, 0, 0, 0);

        // 実際の勤務時間を計算（分）
        const workMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60) - 60; // 休憩1時間を除く
        const overtimeMinutes = Math.max(0, workMinutes - 8 * 60); // 8時間を超えた分が残業

        // 遅刻・早退の判定
        const isLate = clockInHour > 9 || (clockInHour === 9 && clockInMinute > 0);
        const isEarlyLeave = clockOutHour < 17;
        const lateMinutes = isLate ? Math.max(0, (clockInHour - 9) * 60 + clockInMinute) : 0;
        const earlyLeaveMinutes = isEarlyLeave
          ? Math.max(0, (17 - clockOutHour) * 60 - clockOutMinute)
          : 0;

        // ステータス決定
        let status: 'normal' | 'late' | 'early_leave' | 'absent' = 'normal';
        if (isLate && !isEarlyLeave) status = 'late';
        else if (isEarlyLeave && !isLate) status = 'early_leave';
        else if (isLate && isEarlyLeave) status = 'absent';

        // 10%の確率で欠勤
        if (Math.random() < 0.1) {
          const attendance: Attendance = {
            id: `attendance_${userId}_${dateString}`,
            user_id: userId,
            work_date: dateString,
            work_type_id: userIndex === 2 ? '1' : '0', // 田中次郎はフレックス勤務
            clock_in_time: undefined,
            clock_out_time: undefined,
            break_records: [],
            actual_work_minutes: undefined,
            overtime_minutes: 0,
            late_minutes: 0,
            early_leave_minutes: 0,
            status: 'absent',
            attendance_status_id: undefined,
            auto_calculated: true,
            description: '欠勤',
            approved_by: undefined,
            approved_at: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            edit_history: [], // 空の編集履歴配列
          };

          // 編集履歴を生成する確率（給与データと同様のロジック）
          if (Math.random() < settings.attendance_history_ratio / 100 && adminUsers.length > 0) {
            const randomAdmin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
            attendance.edit_history = generateAttendanceEditHistory(
              attendance,
              randomAdmin,
              settings
            );
          }

          attendances.push(attendance);
          return;
        }

        const attendance: Attendance = {
          id: `attendance_${userId}_${dateString}`,
          user_id: userId,
          work_date: dateString,
          work_type_id: userIndex === 2 ? '1' : '0', // 田中次郎はフレックス勤務
          clock_in_time: clockInTime.toISOString(),
          clock_out_time: clockOutTime.toISOString(),
          break_records: [
            {
              start: breakStart.toISOString().split('T')[1].substring(0, 5), // HH:MM形式
              end: breakEnd.toISOString().split('T')[1].substring(0, 5), // HH:MM形式
            },
          ],
          actual_work_minutes: Math.round(workMinutes),
          overtime_minutes: Math.round(overtimeMinutes),
          late_minutes: Math.round(lateMinutes),
          early_leave_minutes: Math.round(earlyLeaveMinutes),
          status: status,
          attendance_status_id: undefined,
          auto_calculated: true,
          description:
            status === 'normal'
              ? '正常'
              : status === 'late'
                ? '遅刻'
                : status === 'early_leave'
                  ? '早退'
                  : '欠勤',
          approved_by: undefined,
          approved_at: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          edit_history: [], // 空の編集履歴配列
        };

        // 編集履歴を生成する確率（給与データと同様のロジック）
        if (Math.random() < settings.attendance_history_ratio / 100 && adminUsers.length > 0) {
          const randomAdmin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
          attendance.edit_history = generateAttendanceEditHistory(
            attendance,
            randomAdmin,
            settings
          );
        }

        attendances.push(attendance);
      });
    }
  }
  return attendances;
}

// 勤怠履歴変更を生成する関数
function generateAttendanceEditHistory(
  originalAttendance: Attendance,
  adminUser: User,
  settings: Setting
) {
  const changeReasons = [
    '出勤時刻の修正',
    '退勤時刻の修正',
    '休憩時間の調整',
    'ステータスの変更',
    '勤務時間の修正',
    '遅刻・早退の修正',
    '欠勤理由の追加',
    '勤務形態の変更',
  ];

  const editHistory = [];

  // 編集履歴を作成する確率（各回で判定）
  for (let i = 0; i < 3; i++) {
    if (Math.random() < settings.attendance_history_ratio / 100) {
      // 勤怠期間の終了日以降の日付で編集日時を生成
      const workDate = new Date(originalAttendance.work_date);
      const editDate = new Date(
        workDate.getTime() +
          Math.random() * 30 * 24 * 60 * 60 * 1000 + // 勤務日後0-30日以内
          i * 24 * 60 * 60 * 1000 // 編集順序に応じて日付をずらす
      );

      const edit = {
        edited_by: adminUser.id,
        edited_at: editDate.toISOString(),
        source_id: originalAttendance.id,
        edit_reason: changeReasons[Math.floor(Math.random() * changeReasons.length)],
      };
      editHistory.push(edit);
    } else {
      break; // 確率に外れたら編集履歴作成を終了
    }
  }

  return editHistory;
}
