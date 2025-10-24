'use client';

import { History, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useMock } from '@/contexts/mock-context';
import { formatDateTime, getJSTDate } from '@/lib/utils/datetime';
import { formatMinutesToHoursMinutes } from '@/lib/utils/time';
import { getPayrollChanges } from '@/lib/utils/payroll-edit-history';
import { getUserFullName, getUserNameById } from '@/lib/utils/user';
import type { Payroll } from '@/schemas';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payrollId: string | null;
}

export default function PreviewDialog({ isOpen, onClose, payrollId }: PreviewDialogProps) {
  const { payrolls, users } = useMock();
  const [editHistory, setEditHistory] = useState<Payroll[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const payroll = payrolls.find((p) => p.id === payrollId);
  const user = users.find((u) => u.id === payroll?.user_id);

  useEffect(() => {
    if (payrollId) {
      fetchEditHistory();
    } else {
      setEditHistory([]);
    }
  }, [payrollId]);

  const fetchEditHistory = async () => {
    if (!payrollId) return;

    setIsLoadingHistory(true);
    try {
      // 実際の給与データを取得
      const payroll = payrolls.find((p) => p.id === payrollId);

      if (payroll && payroll.edit_history && payroll.edit_history.length > 0) {
        // 編集履歴がある場合のみ表示
        setEditHistory([payroll]);
      } else {
        // 編集履歴がない場合は空配列
        setEditHistory([]);
      }
    } catch (error) {
      console.error('編集履歴取得エラー:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!payroll || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '未処理':
        return 'bg-red-100 text-red-800';
      case '支払予定':
        return 'bg-yellow-100 text-yellow-800';
      case '支払完了':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>給与明細プレビュー</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>基本情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>従業員名</p>
                  <p className='text-lg font-semibold'>
                    {getUserFullName(user.family_name, user.first_name)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>所属会社</p>
                  <p className='text-lg'>{user.company.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>雇用形態</p>
                  <p className='text-lg'>{user.work_type.name}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>期間</p>
                  <p className='text-lg'>
                    {getJSTDate(new Date(payroll.period_start))} ~{' '}
                    {getJSTDate(new Date(payroll.period_end))}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>ステータス</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      payroll.status
                    )}`}
                  >
                    {payroll.status}
                  </span>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>給与日</p>
                  <p className='text-lg'>{getJSTDate(new Date(payroll.payroll_date))}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 支給項目 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>支給項目</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>基本給</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.payment_items.base_salary)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>残業手当</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.payment_items.overtime_allowance)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>通勤手当</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.payment_items.commuting_allowance)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>住宅手当</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.payment_items.housing_allowance)}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between items-center text-lg font-bold'>
                  <span>支給合計</span>
                  <span className='text-green-600'>
                    {formatCurrency(payroll.payment_items.total_payment)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 控除項目 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>控除項目</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>健康保険</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.deduction_items.health_insurance)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>厚生年金</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.deduction_items.employee_pension)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>雇用保険</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.deduction_items.employment_insurance)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>所得税</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.deduction_items.income_tax)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>住民税</span>
                  <span className='font-semibold'>
                    {formatCurrency(payroll.deduction_items.resident_tax)}
                  </span>
                </div>
                <Separator />
                <div className='flex justify-between items-center text-lg font-bold'>
                  <span>控除合計</span>
                  <span className='text-red-600'>
                    {formatCurrency(payroll.deduction_items.total_deduction)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤怠データ */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>勤怠データ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>勤務日数</p>
                    <p className='text-lg font-semibold'>
                      {payroll.attendance_data.working_days}日
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>有給休暇使用日数</p>
                    <p className='text-lg font-semibold'>
                      {payroll.attendance_data.paid_leave_used}日
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>有給休暇残日数</p>
                    <p className='text-lg font-semibold'>
                      {payroll.attendance_data.remaining_paid_leave}日
                    </p>
                  </div>
                </div>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>通常勤務時間</p>
                    <p className='text-lg font-semibold'>
                      {formatMinutesToHoursMinutes(
                        payroll.attendance_data.actual_working_hours.normal_work * 60
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>残業時間</p>
                    <p className='text-lg font-semibold'>
                      {formatMinutesToHoursMinutes(
                        payroll.attendance_data.actual_working_hours.overtime_hours * 60
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>休日勤務時間</p>
                    <p className='text-lg font-semibold'>
                      {formatMinutesToHoursMinutes(
                        payroll.attendance_data.actual_working_hours.holiday_work * 60
                      )}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>総勤務時間</p>
                    <p className='text-lg font-semibold'>
                      {formatMinutesToHoursMinutes(
                        payroll.attendance_data.actual_working_hours.total * 60
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 時給情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>時給情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>基本時給</p>
                  <p className='text-lg font-semibold'>
                    {formatCurrency(payroll.hourly_rates.base_hourly_rate)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>残業時給</p>
                  <p className='text-lg font-semibold'>
                    {formatCurrency(payroll.hourly_rates.overtime_hourly_rate)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>実効時給</p>
                  <p className='text-lg font-semibold'>
                    {formatCurrency(payroll.hourly_rates.effective_hourly_rate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最終支給額 */}
          <Card className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'>
            <CardContent className='p-6'>
              <div className='text-center'>
                <p className='text-lg font-medium text-gray-600 mb-2'>差引支給額</p>
                <p className='text-4xl font-bold text-blue-600'>
                  {formatCurrency(payroll.net_payment)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 編集履歴 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <History className='w-4 h-4' />
                編集履歴
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className='flex items-center justify-center py-4'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
                  <span className='ml-2 text-sm text-gray-600'>編集履歴を読み込み中...</span>
                </div>
              ) : editHistory.length > 0 ? (
                <div className='space-y-4'>
                  {editHistory.map((record, index) => {
                    // 編集履歴が1つの場合は、そのレコードのedit_historyを直接表示
                    if (editHistory.length === 1) {
                      const editHistoryItems = record.edit_history || [];
                      return editHistoryItems.map((editItem, editIndex) => {
                        // 再計算の場合は変更内容を表示しない（ステータス変更を避けるため）
                        const isRecalculation = editItem.edit_reason.includes('再計算');
                        const mockChanges = isRecalculation
                          ? []
                          : [
                              {
                                fieldName: '基本給',
                                oldValue: '¥300,000',
                                newValue: '¥320,000',
                              },
                              {
                                fieldName: '残業手当',
                                oldValue: '¥0',
                                newValue: '¥25,000',
                              },
                            ];

                        return (
                          <div
                            key={`${record.id}-${editIndex}`}
                            className='border rounded-lg p-4 bg-gray-50'
                          >
                            <div className='flex items-center justify-between mb-3'>
                              <div className='flex items-center gap-2'>
                                <span className='font-medium text-sm'>編集 {editIndex + 1}</span>
                                <Badge variant='outline' className='text-xs'>
                                  {formatDateTime(editItem.edited_at)}
                                </Badge>
                              </div>
                              <span className='text-xs text-gray-600'>
                                編集者: {getUserNameById(editItem.edited_by, users)}
                              </span>
                            </div>

                            <div className='mb-3'>
                              <div className='text-sm text-gray-700 mb-2'>
                                <span className='font-medium'>編集理由:</span>{' '}
                                {editItem.edit_reason}
                              </div>
                            </div>

                            {mockChanges.length > 0 && (
                              <div className='space-y-2'>
                                <div className='text-sm font-medium text-gray-700 mb-2'>
                                  変更内容:
                                </div>
                                {mockChanges.map((change, changeIndex) => (
                                  <div
                                    key={changeIndex}
                                    className='flex items-center gap-2 text-sm'
                                  >
                                    <span className='font-medium text-gray-700 min-w-[120px]'>
                                      {change.fieldName}:
                                    </span>
                                    <span className='text-red-600 line-through'>
                                      {change.oldValue}
                                    </span>
                                    <span className='text-gray-400'>→</span>
                                    <span className='text-green-600 font-medium'>
                                      {change.newValue}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      });
                    }

                    // 複数のレコードがある場合は比較表示
                    if (index === 0) return null;

                    const previousRecord = editHistory[index - 1];
                    const changes = getPayrollChanges(previousRecord, record);

                    return (
                      <div key={record.id} className='border rounded-lg p-4 bg-gray-50'>
                        <div className='flex items-center justify-between mb-3'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-sm'>
                              編集 {editHistory.length - index}
                            </span>
                            <Badge variant='outline' className='text-xs'>
                              {formatDateTime(record.updated_at)}
                            </Badge>
                          </div>
                          {record.edit_history && record.edit_history.length > 0 && (
                            <span className='text-xs text-gray-600'>
                              編集者: {getUserNameById(record.edit_history[0].edited_by, users)}
                            </span>
                          )}
                        </div>

                        {changes.length > 0 ? (
                          <div className='space-y-2'>
                            {changes.map((change, changeIndex) => (
                              <div key={changeIndex} className='flex items-center gap-2 text-sm'>
                                <span className='font-medium text-gray-700 min-w-[120px]'>
                                  {change.fieldName}:
                                </span>
                                <span className='text-red-600 line-through'>{change.oldValue}</span>
                                <span className='text-gray-400'>→</span>
                                <span className='text-green-600 font-medium'>
                                  {change.newValue}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className='text-sm text-gray-500'>変更なし</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='text-center py-4 text-gray-500'>編集履歴はありません</div>
              )}
            </CardContent>
          </Card>

          {/* 更新情報 */}
          <Card>
            <CardContent className='p-4'>
              <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                <div>
                  <p className='font-medium'>作成日時</p>
                  <p>{formatDate(payroll.created_at)}</p>
                </div>
                <div>
                  <p className='font-medium'>更新日時</p>
                  <p>{formatDate(payroll.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end pt-4'>
          <Button onClick={onClose} variant='outline'>
            <X className='w-4 h-4 mr-2' />
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
