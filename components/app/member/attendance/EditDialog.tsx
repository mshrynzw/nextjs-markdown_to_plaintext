'use client';

import { Clock, Save, X, History } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TimeInput from '@/components/ui/time-input';
import { useMock } from '@/contexts/mock-context';
import { formatDateTime } from '@/lib/utils/datetime';
import { getAttendanceChanges, generateMockEditHistory } from '@/lib/utils/edit-history';
import type { Attendance } from '@/schemas';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceId: string | null;
}

export default function EditDialog({ isOpen, onClose, attendanceId }: EditDialogProps) {
  const { attendances, setAttendances } = useMock();
  const [formData, setFormData] = useState({
    clock_in_time: '',
    clock_out_time: '',
    description: '',
    actual_work_minutes: 0,
    overtime_minutes: 0,
    late_minutes: 0,
    early_leave_minutes: 0,
  });
  const [editHistory, setEditHistory] = useState<Attendance[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const attendance = attendances.find((a) => a.id === attendanceId);

  useEffect(() => {
    if (attendance) {
      setFormData({
        clock_in_time: attendance.clock_in_time
          ? new Date(attendance.clock_in_time).toISOString().slice(0, 16)
          : '',
        clock_out_time: attendance.clock_out_time
          ? new Date(attendance.clock_out_time).toISOString().slice(0, 16)
          : '',
        description: attendance.description || '',
        actual_work_minutes: attendance.actual_work_minutes || 0,
        overtime_minutes: attendance.overtime_minutes || 0,
        late_minutes: attendance.late_minutes || 0,
        early_leave_minutes: attendance.early_leave_minutes || 0,
      });
      fetchEditHistory();
    } else {
      setEditHistory([]);
    }
  }, [attendance]);

  const fetchEditHistory = async () => {
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
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!attendance) return;

    const updatedAttendance = {
      ...attendance,
      clock_in_time: formData.clock_in_time
        ? new Date(formData.clock_in_time).toISOString()
        : undefined,
      clock_out_time: formData.clock_out_time
        ? new Date(formData.clock_out_time).toISOString()
        : undefined,
      description: formData.description,
      actual_work_minutes: formData.actual_work_minutes,
      overtime_minutes: formData.overtime_minutes,
      late_minutes: formData.late_minutes,
      early_leave_minutes: formData.early_leave_minutes,
    };

    setAttendances((prev) => prev.map((a) => (a.id === attendance.id ? updatedAttendance : a)));

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!attendance) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Clock className='w-5 h-5' />
            勤怠編集
          </DialogTitle>
          <DialogDescription>勤怠記録を編集します。変更内容は保存されます。</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 出勤時刻 */}
          <div className='space-y-2'>
            <Label htmlFor='clock_in_time'>出勤時刻</Label>
            <Input
              id='clock_in_time'
              type='datetime-local'
              value={formData.clock_in_time}
              onChange={(e) => handleInputChange('clock_in_time', e.target.value)}
              className='w-full'
            />
          </div>

          {/* 退勤時刻 */}
          <div className='space-y-2'>
            <Label htmlFor='clock_out_time'>退勤時刻</Label>
            <Input
              id='clock_out_time'
              type='datetime-local'
              value={formData.clock_out_time}
              onChange={(e) => handleInputChange('clock_out_time', e.target.value)}
              className='w-full'
            />
          </div>

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

          {/* 説明 */}
          <div className='space-y-2'>
            <Label htmlFor='description'>説明</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder='説明を入力してください'
              className='w-full'
              rows={3}
            />
          </div>

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
                                編集者: {editItem.edited_by}
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
                              編集者: {record.edit_history[0].edited_by}
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
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button onClick={handleCancel} variant='outline'>
            <X className='w-4 h-4 mr-2' />
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            <Save className='w-4 h-4 mr-2' />
            保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
