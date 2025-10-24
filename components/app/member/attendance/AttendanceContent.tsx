'use client';

import { Calendar, Check, Clock, User } from 'lucide-react';
import { useState } from 'react';

import { ActionButton } from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMock } from '@/contexts/mock-context';
import { formatDateWithDayOfWeek, formatMinutesToHoursMinutes } from '@/lib/utils/datetime';

import EditDialog from './EditDialog';
import Filter from './Filter';
import PreviewDialog from './PreviewDialog';

interface AttendanceFilters {
  status: string[];
  user: string[];
  group: string[];
  workType: string[];
  search: string;
  dateRange: {
    from: string;
    to: string;
  };
}

export default function AttendanceContent() {
  const { attendances, users } = useMock();
  const currentUser = users[0]; // 現在のユーザー（従業員）
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 直近1か月前の日付範囲を計算
  const getLastMonthRange = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return {
      from: oneMonthAgo.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    };
  };

  const [filters, setFilters] = useState<AttendanceFilters>({
    status: [],
    user: [],
    group: [],
    workType: [],
    search: '',
    dateRange: getLastMonthRange(),
  });

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

  const handlePreviewClick = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setIsPreviewOpen(true);
  };

  const handleEditClick = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setIsEditOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedAttendanceId(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedAttendanceId(null);
  };

  const handleFiltersChange = (newFilters: AttendanceFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      user: [],
      group: [],
      workType: [],
      search: '',
      dateRange: getLastMonthRange(),
    });
  };

  // 現在のユーザーの勤怠データのみをフィルタリング
  const getUserAttendances = () => {
    return attendances.filter((attendance) => attendance.user_id === currentUser.id);
  };

  const getFilteredAttendances = () => {
    const userAttendances = getUserAttendances();

    return userAttendances.filter((attendance) => {
      // ステータスフィルター
      if (filters.status.length > 0 && !filters.status.includes(attendance.status)) {
        return false;
      }

      // ユーザーフィルター（メンバー画面では自分のデータのみなので実質不要）
      if (filters.user.length > 0 && !filters.user.includes(attendance.user_id)) {
        return false;
      }

      // グループフィルター（メンバー画面では自分のデータのみなので実質不要）
      if (filters.group.length > 0) {
        const user = users.find((u) => u.id === attendance.user_id);
        if (!user || !user.primary_group || !filters.group.includes(user.primary_group.id)) {
          return false;
        }
      }

      // 勤務形態フィルター（メンバー画面では自分のデータのみなので実質不要）
      if (filters.workType.length > 0) {
        const user = users.find((u) => u.id === attendance.user_id);
        if (!user || !filters.workType.includes(user.work_type.id)) {
          return false;
        }
      }

      // 検索フィルター（日付で検索）
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const workDate = new Date(attendance.work_date).toLocaleDateString('ja-JP');
        if (!workDate.includes(searchTerm)) {
          return false;
        }
      }

      // 日付範囲フィルター
      if (filters.dateRange.from && attendance.work_date < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && attendance.work_date > filters.dateRange.to) {
        return false;
      }

      return true;
    });
  };

  const filteredAttendances = getFilteredAttendances();

  // 統計データの計算
  const totalAttendances = filteredAttendances.length;
  const normalAttendances = filteredAttendances.filter((a) => a.status === 'normal').length;
  const lateAttendances = filteredAttendances.filter((a) => a.status === 'late').length;
  const absentAttendances = filteredAttendances.filter((a) => a.status === 'absent').length;

  return (
    <div className='space-y-6'>
      {/* サマリー */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>総勤怠記録数</CardTitle>
            <User className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalAttendances}</div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>正常出勤</CardTitle>
            <Check className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{normalAttendances}</div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>遅刻</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>{lateAttendances}</div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>欠勤</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{absentAttendances}</div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
      </div>

      {/* 勤怠リスト */}
      <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
        <CardContent className='p-6 space-y-4'>
          {/* フィルターとヘッダーボタン */}
          <div className='flex justify-between items-center'>
            <Filter filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          <Table className='overflow-x-auto'>
            <TableHeader>
              <TableRow>
                <TableHead className='whitespace-nowrap'>勤務日</TableHead>
                <TableHead className='whitespace-nowrap'>出勤時刻</TableHead>
                <TableHead className='whitespace-nowrap'>退勤時刻</TableHead>
                <TableHead className='whitespace-nowrap'>勤務時間</TableHead>
                <TableHead className='whitespace-nowrap'>残業時間</TableHead>
                <TableHead className='whitespace-nowrap'>ステータス</TableHead>
                <TableHead className='whitespace-nowrap'>修正</TableHead>
                <TableHead className='whitespace-nowrap'>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell>{formatDateWithDayOfWeek(attendance.work_date)}</TableCell>
                  <TableCell>{formatTime(attendance.clock_in_time)}</TableCell>
                  <TableCell>{formatTime(attendance.clock_out_time)}</TableCell>
                  <TableCell>
                    {formatMinutesToHoursMinutes(attendance.actual_work_minutes || 0)}
                  </TableCell>
                  <TableCell>{formatMinutesToHoursMinutes(attendance.overtime_minutes)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}
                    >
                      {getStatusLabel(attendance.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const hasEditHistory =
                        attendance.edit_history && attendance.edit_history.length > 0;
                      console.log(
                        `Attendance ${attendance.id} edit_history:`,
                        attendance.edit_history,
                        'hasEditHistory:',
                        hasEditHistory
                      );
                      return (
                        hasEditHistory && (
                          <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
                            修正済み
                          </Badge>
                        )
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <ActionButton
                        action='view'
                        onClick={() => handlePreviewClick(attendance.id)}
                      />
                      <ActionButton action='edit' onClick={() => handleEditClick(attendance.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ダイアログ */}
      <PreviewDialog
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        attendanceId={selectedAttendanceId}
      />
      <EditDialog
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        attendanceId={selectedAttendanceId}
      />
    </div>
  );
}
