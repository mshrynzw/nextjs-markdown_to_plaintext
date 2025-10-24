'use client';

import { Calendar, Clock, History, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMock } from '@/contexts/mock-context';
import {
  formatCompactDateTime,
  formatDateTime,
  formatMinutesToHoursMinutes,
} from '@/lib/utils/datetime';
import { generateMockEditHistory, getAttendanceChanges } from '@/lib/utils/edit-history';
import { getUserFullName, getUserNameById } from '@/lib/utils/user';
import type { Attendance } from '@/schemas';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceId: string | null;
}

export default function PreviewDialog({ isOpen, onClose, attendanceId }: PreviewDialogProps) {
  const { attendances, users } = useMock();
  const [editHistory, setEditHistory] = useState<Attendance[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const attendance = attendances.find((a) => a.id === attendanceId);
  const user = users.find((u) => u.id === attendance?.user_id);

  useEffect(() => {
    if (attendanceId) {
      fetchEditHistory();
    } else {
      setEditHistory([]);
    }
  }, [attendanceId]);

  const fetchEditHistory = async () => {
    if (!attendanceId) return;

    setIsLoadingHistory(true);
    try {
      // モックデータを使用
      const adminUsers = users.filter((user) => user.role === 'admin');
      const mockHistory = generateMockEditHistory(attendanceId, adminUsers);
      setEditHistory(mockHistory);
    } catch (error) {
      console.error('編集履歴取得エラー:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!attendance || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'early_leave':
        return 'bg-orange-100 text-orange-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'late':
        return '遅刻';
      case 'early_leave':
        return '早退';
      case 'absent':
        return '欠勤';
      default:
        return status;
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWorkHours = (minutes: number | undefined) => {
    if (!minutes) return '-';
    return formatMinutesToHoursMinutes(minutes);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto bg-orange-100 rounded-md custom-scrollbar'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-gray-900'>勤怠詳細</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center'>
                <User className='w-5 h-5 mr-2' />
                基本情報
              </CardTitle>
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
                  <p className='text-sm font-medium text-gray-600'>所属グループ</p>
                  <p className='text-lg'>{user.primary_group?.name || '-'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>勤務形態</p>
                  <p className='text-lg'>{user.work_type?.name || '-'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>勤務日</p>
                  <p className='text-lg'>{formatDate(attendance.work_date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 勤怠情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center'>
                <Clock className='w-5 h-5 mr-2' />
                勤怠情報
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>出勤時刻</p>
                  <p className='text-lg font-semibold'>{formatTime(attendance.clock_in_time)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>退勤時刻</p>
                  <p className='text-lg font-semibold'>{formatTime(attendance.clock_out_time)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>勤務時間</p>
                  <p className='text-lg'>{formatWorkHours(attendance.actual_work_minutes)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>残業時間</p>
                  <p className='text-lg'>{formatWorkHours(attendance.overtime_minutes)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>遅刻時間</p>
                  <p className='text-lg'>{formatWorkHours(attendance.late_minutes)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>早退時間</p>
                  <p className='text-lg'>{formatWorkHours(attendance.early_leave_minutes)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ステータス情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg flex items-center'>
                <Calendar className='w-5 h-5 mr-2' />
                ステータス情報
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>ステータス</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(attendance.status)}`}
                  >
                    {getStatusLabel(attendance.status)}
                  </span>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>自動計算</p>
                  <p className='text-lg'>{attendance.auto_calculated ? 'はい' : 'いいえ'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>説明</p>
                  <p className='text-lg'>{attendance.description || '-'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>承認者</p>
                  <p className='text-lg'>{attendance.approved_by || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 休憩記録 */}
          {attendance.break_records && attendance.break_records.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>休憩記録</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {attendance.break_records.map((breakRecord, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                    >
                      <span className='font-medium'>休憩 {index + 1}</span>
                      <span className='text-sm text-gray-600'>
                        {breakRecord.start} - {breakRecord.end}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* システム情報 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>システム情報</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>勤怠ID</p>
                  <p className='font-mono text-sm'>{attendance.id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>ユーザーID</p>
                  <p className='font-mono text-sm'>{attendance.user_id}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>作成日時</p>
                  <p className='text-lg'>{formatCompactDateTime(attendance.created_at)}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>更新日時</p>
                  <p className='text-lg'>{formatCompactDateTime(attendance.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button onClick={onClose} variant='outline'>
            <X className='w-4 h-4 mr-2' />
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
