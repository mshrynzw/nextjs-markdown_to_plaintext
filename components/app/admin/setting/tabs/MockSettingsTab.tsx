'use client';

import { Briefcase, Loader2, RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMock } from '@/contexts/mock-context';
import { getInitialAttendance } from '@/lib/mock/attendance';
import { getInitialPayrolls } from '@/lib/mock/payrolls';
import { getInitialUsers } from '@/lib/mock/users';
import type { Setting } from '@/schemas';

export default function MockSettingsTab() {
  const { toast } = useToast();
  const { settings, setSettings, setUsers, companies, setAttendances, setPayrolls, resetMockData } =
    useMock();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isRegeneratingMockData, setIsRegeneratingMockData] = useState(false);
  const [isResettingData, setIsResettingData] = useState(false);
  const handleSettingChange = (field: keyof Setting, value: number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegenerateAttendance = () => {
    setIsRegeneratingMockData(true);
    toast({
      title: '処理中...',
      description: 'モックデータを再生成しています...',
    });

    try {
      // 新しいユーザーデータを生成（従業員数に基づく）
      const newUsers = getInitialUsers(companies[0], settings.admin_ratio, settings.employee_count);
      setUsers(newUsers);

      // 新しい勤怠データを生成
      const newAttendances = getInitialAttendance(newUsers, settings);
      setAttendances(newAttendances);

      // 新しい給与データを生成（勤怠データに基づく）
      const newPayrolls = getInitialPayrolls(
        newUsers,
        newAttendances,
        settings,
        settings.month_offset
      );
      setPayrolls(newPayrolls);

      toast({
        title: '完了',
        description: 'モックデータの再生成が完了しました。',
      });
    } catch {
      toast({
        title: 'エラー',
        description: 'モックデータの再生成に失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setIsRegeneratingMockData(false);
    }
  };

  const handleResetClick = () => {
    setIsResetDialogOpen(true);
  };

  const handleResetConfirm = async () => {
    setIsResettingData(true);
    toast({
      title: '処理中...',
      description: 'モックデータをリセットしています...',
    });

    try {
      // 実際の処理を実行
      resetMockData();
      toast({
        title: '完了',
        description: 'モックデータのリセットが完了しました。',
      });
    } catch {
      toast({
        title: 'エラー',
        description: 'モックデータのリセットに失敗しました。',
        variant: 'destructive',
      });
    } finally {
      setIsResettingData(false);
      setIsResetDialogOpen(false);
    }
  };

  const handleResetCancel = () => {
    setIsResetDialogOpen(false);
  };

  return (
    <>
      <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Briefcase className='w-5 h-5' />
            モック設定
          </CardTitle>
          <CardDescription>
            モックデータはブラウザのローカルストレージに保存されます。
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-6'>
            {/* モック設定 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>モックデータの再生成</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='admin-ratio'>管理者の割合 (%)</Label>
                  <Input
                    id='admin-ratio'
                    type='number'
                    min='0'
                    max='100'
                    value={settings.admin_ratio}
                    onChange={(e) =>
                      handleSettingChange('admin_ratio', parseInt(e.target.value) || 0)
                    }
                  />
                  <p className='text-sm text-gray-500'>ユーザーの中で管理者の割合を設定します。</p>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='attendance-history-ratio'>勤怠履歴変更の割合 (%)</Label>
                  <Input
                    id='attendance-history-ratio'
                    type='number'
                    min='0'
                    max='100'
                    value={settings.attendance_history_ratio}
                    onChange={(e) =>
                      handleSettingChange('attendance_history_ratio', parseInt(e.target.value) || 0)
                    }
                  />
                  <p className='text-sm text-gray-500'>
                    勤怠データで履歴変更を生成する割合を設定します。
                  </p>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='payroll-history-ratio'>給与履歴変更の割合 (%)</Label>
                  <Input
                    id='payroll-history-ratio'
                    type='number'
                    min='0'
                    max='100'
                    value={settings.payroll_history_ratio}
                    onChange={(e) =>
                      handleSettingChange('payroll_history_ratio', parseInt(e.target.value) || 0)
                    }
                  />
                  <p className='text-sm text-gray-500'>
                    給与データで履歴変更を生成する割合を設定します。
                  </p>
                </div>
              </div>
            </div>

            {/* 勤怠データ生成設定 */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='attendance-month-offset'>生成する月数</Label>
                <Input
                  id='attendance-month-offset'
                  type='number'
                  min='1'
                  value={settings.month_offset}
                  onChange={(e) => {
                    const newMonthOffset = parseInt(e.target.value) || 1;
                    setSettings((prev) => ({
                      ...prev,
                      month_offset: newMonthOffset,
                    }));
                  }}
                />
                <p className='text-sm text-gray-500'>
                  過去何ヶ月分の勤怠データを生成するかを設定します。
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='employee-count'>生成する従業員数</Label>
                <Input
                  id='employee-count'
                  type='number'
                  min='1'
                  value={settings.employee_count}
                  onChange={(e) => {
                    const newEmployeeCount = parseInt(e.target.value) || 1;
                    setSettings((prev) => ({
                      ...prev,
                      employee_count: newEmployeeCount,
                    }));
                  }}
                />
                <p className='text-sm text-gray-500'>生成する従業員の数を設定します。</p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='mode'>モード設定</Label>
                <Select
                  value={settings.mode}
                  onValueChange={(value: 'normal' | 'warning' | 'alert') => {
                    setSettings((prev) => ({
                      ...prev,
                      mode: value,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='モードを選択' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='normal'>通常 - 今月の勤怠未確認が0人になります。</SelectItem>
                    <SelectItem value='warning'>
                      <span className='text-yellow-600'>
                        警告 - 今月の勤怠未確認が1人以上になります。
                      </span>
                    </SelectItem>
                    <SelectItem value='alert'>
                      <span className='text-red-600'>
                        異常 - 前月の支払い未完了が1人以上になります。
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-sm text-gray-500'>給与モックデータの生成条件を設定します。</p>
              </div>
            </div>
            <Button
              onClick={handleRegenerateAttendance}
              disabled={isRegeneratingMockData}
              className='flex items-center space-x-2'
            >
              {isRegeneratingMockData ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <RotateCcw className='w-4 h-4' />
              )}
              <span>{isRegeneratingMockData ? '再生成中...' : 'モックデータを再生成する'}</span>
            </Button>

            {/* データリセット */}
            <div className='space-y-4 pt-4 border-t'>
              <h3 className='text-lg font-medium text-red-600'>モックデータのリセット</h3>
              <p className='text-sm text-gray-600'>
                ローカルストレージに保存されたモックデータを削除し、初期状態にリセットします。
              </p>
              <Button
                onClick={handleResetClick}
                variant='destructive'
                disabled={isResettingData}
                className='flex items-center space-x-2'
              >
                {isResettingData ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <RotateCcw className='w-4 h-4' />
                )}
                <span>{isResettingData ? 'リセット中...' : 'モックデータをリセットする'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* リセット確認ダイアログ */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>モックデータのリセット</DialogTitle>
            <DialogDescription>
              この操作により、ローカルストレージに保存されたすべてのモックデータが削除され、初期状態にリセットされます。
              <br />
              <br />
              <strong>この操作は取り消せません。</strong>本当に実行しますか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={handleResetCancel} disabled={isResettingData}>
              キャンセル
            </Button>
            <Button
              variant='destructive'
              onClick={handleResetConfirm}
              disabled={isResettingData}
              className='flex items-center space-x-2'
            >
              {isResettingData ? <Loader2 className='w-4 h-4 animate-spin' /> : null}
              <span>{isResettingData ? 'リセット中...' : 'リセット実行'}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
