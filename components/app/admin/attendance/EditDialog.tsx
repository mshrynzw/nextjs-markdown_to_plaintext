'use client';

import { History, Save, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TimeInput from '@/components/ui/time-input';
import { useMock } from '@/contexts/mock-context';
import { formatDateTime, getJSTDate } from '@/lib/utils/datetime';
import { generateMockEditHistory, getAttendanceChanges } from '@/lib/utils/edit-history';
import { getUserFullName, getUserNameById } from '@/lib/utils/user';
import type { Attendance } from '@/schemas';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceId: string | null;
}

export default function EditDialog({ isOpen, onClose, attendanceId }: EditDialogProps) {
  const { attendances, users, setAttendances } = useMock();
  const [formData, setFormData] = useState<Attendance | null>(null);
  const [editHistory, setEditHistory] = useState<Attendance[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const attendance = attendances.find((a) => a.id === attendanceId);
  const user = users.find((u) => u.id === attendance?.user_id);

  const fetchEditHistory = useCallback(async () => {
    if (!attendanceId) return;

    setIsLoadingHistory(true);
    try {
      // モックデータを使用
      const mockHistory = generateMockEditHistory(attendanceId);
      setEditHistory(mockHistory);
    } catch (error) {
      console.error('編集履歴取得エラー:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [attendanceId]);

  useEffect(() => {
    if (attendance) {
      setFormData({ ...attendance });
      fetchEditHistory();
    } else {
      setEditHistory([]);
    }
  }, [attendance, attendanceId, fetchEditHistory]);

  if (!attendance || !user || !formData) {
    return null;
  }

  const handleInputChange = (
    field: string,
    value: string | number | boolean | undefined | Array<{ start: string; end: string }>
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;

      const newData = { ...prev };
      const keys = field.split('.');

      if (keys.length === 1) {
        (newData as Record<string, unknown>)[keys[0]] = value;
      } else if (keys.length === 2) {
        (newData as Record<string, unknown>)[keys[0]] = {
          ...((newData as Record<string, unknown>)[keys[0]] as Record<string, unknown>),
          [keys[1]]: value,
        };
      }

      return newData;
    });
  };

  const handleSave = () => {
    if (!formData) return;

    setAttendances((prev) => prev.map((a) => (a.id === formData.id ? formData : a)));
    onClose();
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString('ja-JP', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTimeChange = (field: 'clock_in_time' | 'clock_out_time', timeString: string) => {
    if (!timeString) {
      handleInputChange(field, undefined);
      return;
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(formData.work_date);
    date.setHours(hours, minutes, 0, 0);
    handleInputChange(field, date.toISOString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>勤怠編集</DialogTitle>
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
                  <Label className='text-sm font-medium text-gray-600'>従業員名</Label>
                  <p className='text-lg font-semibold'>
                    {getUserFullName(user.family_name, user.first_name)}
                  </p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>所属グループ</Label>
                  <p className='text-lg'>{user.primary_group?.name || '-'}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>勤務形態</Label>
                  <p className='text-lg'>{user.work_type?.name || '-'}</p>
                </div>
                <div>
                  <Label htmlFor='work_date'>勤務日</Label>
                  <Input
                    id='work_date'
                    type='date'
                    value={formData.work_date}
                    onChange={(e) => handleInputChange('work_date', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤怠時刻 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>勤怠時刻</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='clock_in_time'>出勤時刻</Label>
                  <Input
                    id='clock_in_time'
                    type='time'
                    value={formatTime(formData.clock_in_time)}
                    onChange={(e) => handleTimeChange('clock_in_time', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor='clock_out_time'>退勤時刻</Label>
                  <Input
                    id='clock_out_time'
                    type='time'
                    value={formatTime(formData.clock_out_time)}
                    onChange={(e) => handleTimeChange('clock_out_time', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤務時間 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>勤務時間</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <TimeInput
                  label='実際勤務時間'
                  hours={Math.floor((formData.actual_work_minutes || 0) / 60)}
                  minutes={(formData.actual_work_minutes || 0) % 60}
                  onHoursChange={(hours) => {
                    const totalMinutes = hours * 60 + ((formData.actual_work_minutes || 0) % 60);
                    handleInputChange('actual_work_minutes', totalMinutes);
                  }}
                  onMinutesChange={(minutes) => {
                    const totalMinutes =
                      Math.floor((formData.actual_work_minutes || 0) / 60) * 60 + minutes;
                    handleInputChange('actual_work_minutes', totalMinutes);
                  }}
                />
                <TimeInput
                  label='残業時間'
                  hours={Math.floor(formData.overtime_minutes / 60)}
                  minutes={formData.overtime_minutes % 60}
                  onHoursChange={(hours) => {
                    const totalMinutes = hours * 60 + (formData.overtime_minutes % 60);
                    handleInputChange('overtime_minutes', totalMinutes);
                  }}
                  onMinutesChange={(minutes) => {
                    const totalMinutes = Math.floor(formData.overtime_minutes / 60) * 60 + minutes;
                    handleInputChange('overtime_minutes', totalMinutes);
                  }}
                />
                <TimeInput
                  label='遅刻時間'
                  hours={Math.floor(formData.late_minutes / 60)}
                  minutes={formData.late_minutes % 60}
                  onHoursChange={(hours) => {
                    const totalMinutes = hours * 60 + (formData.late_minutes % 60);
                    handleInputChange('late_minutes', totalMinutes);
                  }}
                  onMinutesChange={(minutes) => {
                    const totalMinutes = Math.floor(formData.late_minutes / 60) * 60 + minutes;
                    handleInputChange('late_minutes', totalMinutes);
                  }}
                />
                <TimeInput
                  label='早退時間'
                  hours={Math.floor(formData.early_leave_minutes / 60)}
                  minutes={formData.early_leave_minutes % 60}
                  onHoursChange={(hours) => {
                    const totalMinutes = hours * 60 + (formData.early_leave_minutes % 60);
                    handleInputChange('early_leave_minutes', totalMinutes);
                  }}
                  onMinutesChange={(minutes) => {
                    const totalMinutes =
                      Math.floor(formData.early_leave_minutes / 60) * 60 + minutes;
                    handleInputChange('early_leave_minutes', totalMinutes);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ステータス */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>ステータス</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='status'>ステータス</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='normal'>正常</SelectItem>
                      <SelectItem value='late'>遅刻</SelectItem>
                      <SelectItem value='early_leave'>早退</SelectItem>
                      <SelectItem value='absent'>欠勤</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor='auto_calculated'>自動計算</Label>
                  <Select
                    value={formData.auto_calculated ? 'true' : 'false'}
                    onValueChange={(value) =>
                      handleInputChange('auto_calculated', value === 'true')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='true'>はい</SelectItem>
                      <SelectItem value='false'>いいえ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='description'>説明</Label>
                  <Input
                    id='description'
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder='説明を入力してください'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 休憩記録 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>休憩記録</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {formData.break_records.map((breakRecord, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-4 p-3 bg-gray-50 rounded-lg'
                  >
                    <span className='font-medium min-w-[60px]'>休憩 {index + 1}</span>
                    <div className='flex items-center space-x-2'>
                      <Label htmlFor={`break_start_${index}`}>開始</Label>
                      <Input
                        id={`break_start_${index}`}
                        type='time'
                        value={breakRecord.start}
                        onChange={(e) => {
                          const newBreakRecords = [...formData.break_records];
                          newBreakRecords[index] = {
                            ...breakRecord,
                            start: e.target.value,
                          };
                          handleInputChange('break_records', newBreakRecords);
                        }}
                        className='w-32'
                      />
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Label htmlFor={`break_end_${index}`}>終了</Label>
                      <Input
                        id={`break_end_${index}`}
                        type='time'
                        value={breakRecord.end}
                        onChange={(e) => {
                          const newBreakRecords = [...formData.break_records];
                          newBreakRecords[index] = {
                            ...breakRecord,
                            end: e.target.value,
                          };
                          handleInputChange('break_records', newBreakRecords);
                        }}
                        className='w-32'
                      />
                    </div>
                  </div>
                ))}
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
                        // 編集履歴から変更内容を生成（モックデータとして）
                        const mockChanges = [
                          {
                            fieldName: '出勤時刻',
                            oldValue: '09:00',
                            newValue: '09:30',
                          },
                          {
                            fieldName: '退勤時刻',
                            oldValue: '18:00',
                            newValue: '19:00',
                          },
                          {
                            fieldName: 'ステータス',
                            oldValue: '出勤',
                            newValue: '遅刻',
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
                    const changes = getAttendanceChanges(previousRecord, record);

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

          {/* システム情報（読み取り専用） */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>システム情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>勤怠ID</Label>
                  <p className='font-mono text-sm'>{formData.id}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>ユーザーID</Label>
                  <p className='font-mono text-sm'>{formData.user_id}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>作成日時</Label>
                  <p className='text-lg'>{getJSTDate(new Date(formData.created_at))}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>更新日時</Label>
                  <p className='text-lg'>{getJSTDate(new Date(formData.updated_at))}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button onClick={onClose} variant='outline'>
            <X className='w-4 h-4 mr-2' />
            キャンセル
          </Button>
          <Button onClick={handleSave} className='bg-blue-600 hover:bg-blue-700'>
            <Save className='w-4 h-4 mr-2' />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
