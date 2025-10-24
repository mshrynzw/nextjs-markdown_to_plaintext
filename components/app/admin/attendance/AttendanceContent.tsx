'use client';

import { Calendar, Check, Clock, Users } from 'lucide-react';
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
import useAttendanceColumnSettings from '@/hooks/use-attendance-column-settings';
import { formatDateWithDayOfWeek, formatMinutesToHoursMinutes } from '@/lib/utils/datetime';
import { getUserFullName } from '@/lib/utils/user';

import ColumnSettingsDialog from './ColumnSettingsDialog';
import EditDialog from './EditDialog';
import AttendanceFilter from './Filter';
import HeaderButton from './HeaderButton';
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
  const { attendances, setAttendances, users } = useMock();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
  const { settings: columnSettings, saveSettings } = useAttendanceColumnSettings();
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

  const handleDeleteClick = (attendanceId: string) => {
    if (confirm('この勤怠記録を削除しますか？この操作は取り消せません。')) {
      setAttendances((prev) => prev.filter((a) => a.id !== attendanceId));
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedAttendanceId(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedAttendanceId(null);
  };

  const handleColumnSettingsSave = (settings: typeof columnSettings) => {
    saveSettings(settings);
  };

  const handleFiltersChange = (newFilters: AttendanceFilters) => {
    setFilters(newFilters);
  };

  const getFilteredAttendances = () => {
    return attendances
      .filter((attendance) => {
        const user = users.find((u) => u.id === attendance.user_id);
        if (!user) return false;

        // ステータスフィルター
        if (filters.status.length > 0 && !filters.status.includes(attendance.status)) {
          return false;
        }

        // ユーザーフィルター
        if (filters.user.length > 0 && !filters.user.includes(attendance.user_id)) {
          return false;
        }

        // グループフィルター
        if (
          filters.group.length > 0 &&
          user.primary_group &&
          !filters.group.includes(user.primary_group.id)
        ) {
          return false;
        }

        // 勤務形態フィルター
        if (
          filters.workType.length > 0 &&
          attendance.work_type_id &&
          !filters.workType.includes(attendance.work_type_id)
        ) {
          return false;
        }

        // 検索フィルター
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const userName = getUserFullName(user.family_name, user.first_name).toLowerCase();
          const groupName = user.primary_group?.name?.toLowerCase() || '';
          const workTypeName = user.work_type?.name?.toLowerCase() || '';

          if (
            !userName.includes(searchTerm) &&
            !groupName.includes(searchTerm) &&
            !workTypeName.includes(searchTerm)
          ) {
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
      })
      .sort((a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime());
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
            <Users className='h-4 w-4 text-muted-foreground' />
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
          <div className='flex flex-col space-y-2'>
            <div className='flex justify-end'>
              <HeaderButton onColumnSettings={() => setIsColumnSettingsOpen(true)} />
            </div>
          </div>
          <div className='w-full'>
            <AttendanceFilter filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
          <Table className='overflow-x-auto'>
            <TableHeader>
              <TableRow>
                {columnSettings.group && (
                  <TableHead className='whitespace-nowrap'>所属グループ</TableHead>
                )}
                {columnSettings.employee && (
                  <TableHead className='whitespace-nowrap'>従業員名</TableHead>
                )}
                {columnSettings.workType && (
                  <TableHead className='whitespace-nowrap'>勤務形態</TableHead>
                )}
                {columnSettings.workDate && (
                  <TableHead className='whitespace-nowrap'>勤務日</TableHead>
                )}
                {columnSettings.clockIn && (
                  <TableHead className='whitespace-nowrap'>出勤時刻</TableHead>
                )}
                {columnSettings.clockOut && (
                  <TableHead className='whitespace-nowrap'>退勤時刻</TableHead>
                )}
                {columnSettings.workHours && (
                  <TableHead className='whitespace-nowrap'>勤務時間</TableHead>
                )}
                {columnSettings.overtime && (
                  <TableHead className='whitespace-nowrap'>残業時間</TableHead>
                )}
                {columnSettings.status && (
                  <TableHead className='whitespace-nowrap'>ステータス</TableHead>
                )}
                <TableHead className='whitespace-nowrap'>修正</TableHead>
                {columnSettings.actions && (
                  <TableHead className='whitespace-nowrap'>操作</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((attendance) => {
                const user = users.find((u) => u.id === attendance.user_id);
                if (!user) return null;

                return (
                  <TableRow key={attendance.id}>
                    {columnSettings.group && (
                      <TableCell>{user.primary_group?.name || '-'}</TableCell>
                    )}
                    {columnSettings.employee && (
                      <TableCell className='font-medium'>
                        {getUserFullName(user.family_name, user.first_name)}
                      </TableCell>
                    )}
                    {columnSettings.workType && (
                      <TableCell>{user.work_type?.name || '-'}</TableCell>
                    )}
                    {columnSettings.workDate && (
                      <TableCell>{formatDateWithDayOfWeek(attendance.work_date)}</TableCell>
                    )}
                    {columnSettings.clockIn && (
                      <TableCell>{formatTime(attendance.clock_in_time)}</TableCell>
                    )}
                    {columnSettings.clockOut && (
                      <TableCell>{formatTime(attendance.clock_out_time)}</TableCell>
                    )}
                    {columnSettings.workHours && (
                      <TableCell>
                        {formatMinutesToHoursMinutes(attendance.actual_work_minutes || 0)}
                      </TableCell>
                    )}
                    {columnSettings.overtime && (
                      <TableCell>
                        {formatMinutesToHoursMinutes(attendance.overtime_minutes)}
                      </TableCell>
                    )}
                    {columnSettings.status && (
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}
                        >
                          {getStatusLabel(attendance.status)}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      {(() => {
                        const hasEditHistory =
                          attendance.edit_history && attendance.edit_history.length > 0;
                        return (
                          hasEditHistory && (
                            <Badge variant='secondary' className='bg-orange-100 text-orange-800'>
                              修正済み
                            </Badge>
                          )
                        );
                      })()}
                    </TableCell>
                    {columnSettings.actions && (
                      <TableCell>
                        <div className='flex space-x-2'>
                          <ActionButton
                            action='view'
                            onClick={() => handlePreviewClick(attendance.id)}
                          />
                          <ActionButton
                            action='edit'
                            onClick={() => handleEditClick(attendance.id)}
                          />
                          <ActionButton
                            action='delete'
                            onClick={() => handleDeleteClick(attendance.id)}
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
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
      <ColumnSettingsDialog
        isOpen={isColumnSettingsOpen}
        onClose={() => setIsColumnSettingsOpen(false)}
        onSave={handleColumnSettingsSave}
        currentSettings={columnSettings}
      />
    </div>
  );
}
