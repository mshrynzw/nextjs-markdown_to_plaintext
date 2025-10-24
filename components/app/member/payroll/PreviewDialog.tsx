'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useMock } from '@/contexts/mock-context';
import { getJSTDate } from '@/lib/utils/datetime';
import { formatMinutesToHoursMinutes } from '@/lib/utils/time';
import { getUserFullName } from '@/lib/utils/user';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payrollId: string | null;
}

export default function PreviewDialog({ isOpen, onClose, payrollId }: PreviewDialogProps) {
  const { payrolls, users } = useMock();

  const payroll = payrolls.find((p) => p.id === payrollId);
  const user = users.find((u) => u.id === payroll?.user_id);

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
      case '承認待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '承認済み':
        return 'bg-green-100 text-green-800';
      case '支払完了':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>給与明細</DialogTitle>
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
