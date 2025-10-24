'use client';
import { Calendar, Check, Clock, Users } from 'lucide-react';
import { useState } from 'react';

import { ActionButton } from '@/components/ui/action-button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMock } from '@/contexts/mock-context';
import useUserColumnSettings from '@/hooks/use-user-column-settings';
// import { formatCompactDateTime } from '@/lib/utils/datetime';
import { getUserFullName } from '@/lib/utils/user';

import ColumnSettingsDialog from './ColumnSettingsDialog';
import EditDialog from './EditDialog';
import Filter, { type UserFilters } from './Filter';
import HeaderButton from './HeaderButton';
import PreviewDialog from './PreviewDialog';

export default function UserContent() {
  const { users } = useMock();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);

  const { settings: columnSettings, saveSettings, isLoaded } = useUserColumnSettings();

  // フィルター状態
  const [filters, setFilters] = useState<UserFilters>({
    dateRange: { startDate: null, endDate: null },
    status: [],
    workTypeId: null,
    groupId: null,
    userId: null,
    searchTerm: '',
  });

  const getStatusColor = (role: string) => {
    switch (role) {
      case 'system-admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('ja-JP', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //   });
  // };

  const handlePreviewClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsPreviewOpen(true);
  };

  const handleEditClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    if (confirm('このユーザーを削除しますか？この操作は取り消せません。')) {
      // TODO: 実際の削除APIを呼び出す
      console.log('Delete user:', userId);
      // setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedUserId(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedUserId(null);
  };

  const handleColumnSettingsSave = (settings: typeof columnSettings) => {
    saveSettings(settings);
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: { startDate: null, endDate: null },
      status: [],
      workTypeId: null,
      groupId: null,
      userId: null,
      searchTerm: '',
    });
  };

  // フィルターされたユーザーデータを取得
  const getFilteredUsers = () => {
    return users.filter((user) => {
      // ステータスフィルター
      if (filters.status.length > 0 && !filters.status.includes(user.role)) {
        return false;
      }

      // グループフィルター
      if (filters.groupId && user.primary_group?.id !== filters.groupId) {
        return false;
      }

      // 勤務形態フィルター
      if (filters.workTypeId && user.work_type.name !== filters.workTypeId) {
        return false;
      }

      // 検索フィルター
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const fullName = getUserFullName(user.family_name, user.first_name).toLowerCase();
        const employeeName = user.employee_type.name.toLowerCase();
        if (!fullName.includes(searchLower) && !employeeName.includes(searchLower)) {
          return false;
        }
      }

      // 日付範囲フィルター（現在は無効化）
      // if (filters.dateRange.startDate) {
      //   const userDate = new Date(user.created_at);
      //   const startDate = new Date(filters.dateRange.startDate);
      //   if (userDate < startDate) {
      //     return false;
      //   }
      // }

      // if (filters.dateRange.endDate) {
      //   const userDate = new Date(user.created_at);
      //   const endDate = new Date(filters.dateRange.endDate);
      //   if (userDate > endDate) {
      //     return false;
      //   }
      // }

      return true;
    });
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className='space-y-6'>
      {/* サマリー */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>総ユーザー数</p>
                <p className='text-2xl font-bold text-gray-900'>{filteredUsers.length}</p>
              </div>
              <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center'>
                <Users className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>アクティブユーザー</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {filteredUsers.filter((u) => u.role === 'member').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                <Check className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>新規登録（今月）</p>
                <p className='text-2xl font-bold text-gray-900'>{filteredUsers.length}</p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>

        <Card className='relative bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>退職者</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {filteredUsers.filter((u) => u.role === 'admin').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
                <Clock className='w-6 h-6 text-red-600' />
              </div>
            </div>
          </CardContent>
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500'></div>
        </Card>
      </div>

      {/* ユーザーリスト */}
      <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
        <CardContent className='p-6 space-y-4'>
          <div className='flex items-center justify-between'>
            <p className='text-2xl font-bold text-gray-900'>ユーザーリスト</p>
            <div className='flex'>
              <HeaderButton setIsColumnSettingsDialogOpen={() => setIsColumnSettingsOpen(true)} />
            </div>
          </div>
          <Filter
            filters={filters}
            onFiltersChangeAction={handleFiltersChange}
            users={users.map((user) => ({
              id: user.id,
              family_name: user.family_name,
              first_name: user.first_name,
              employee_name: user.employee_type.name,
            }))}
            groups={users.map((user) => user.primary_group).filter(Boolean)}
            workTypes={users.map((user) => ({
              id: user.work_type.name,
              name: user.work_type.name,
            }))}
            onResetFilters={handleResetFilters}
          />
          <div className='w-full'>
            {!isLoaded ? (
              <div className='flex justify-center items-center h-32'>
                <div className='text-gray-500'>読み込み中...</div>
              </div>
            ) : (
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
                      <TableHead className='whitespace-nowrap'>雇用形態</TableHead>
                    )}
                    {columnSettings.status && (
                      <TableHead className='whitespace-nowrap'>ロール</TableHead>
                    )}
                    {columnSettings.email && (
                      <TableHead className='whitespace-nowrap'>メールアドレス</TableHead>
                    )}
                    {columnSettings.phone && (
                      <TableHead className='whitespace-nowrap'>電話番号</TableHead>
                    )}
                    {columnSettings.createdAt && (
                      <TableHead className='whitespace-nowrap'>登録日時</TableHead>
                    )}
                    {columnSettings.updatedAt && (
                      <TableHead className='whitespace-nowrap'>更新日時</TableHead>
                    )}
                    {columnSettings.actions && (
                      <TableHead className='whitespace-nowrap'>操作</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    return (
                      <TableRow key={user.id}>
                        {columnSettings.group && (
                          <TableCell className='whitespace-nowrap'>
                            {user.primary_group?.name || '-'}
                          </TableCell>
                        )}
                        {columnSettings.employee && (
                          <TableCell className='whitespace-nowrap'>
                            {getUserFullName(user.family_name, user.first_name)}
                          </TableCell>
                        )}
                        {columnSettings.workType && (
                          <TableCell className='whitespace-nowrap'>{user.work_type.name}</TableCell>
                        )}
                        {columnSettings.status && (
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.role)}`}
                            >
                              {user.role === 'system-admin'
                                ? 'システム管理者'
                                : user.role === 'admin'
                                  ? '管理者'
                                  : '従業員'}
                            </span>
                          </TableCell>
                        )}
                        {columnSettings.email && (
                          <TableCell className='whitespace-nowrap'>{user.email}</TableCell>
                        )}
                        {columnSettings.phone && (
                          <TableCell className='whitespace-nowrap'>-</TableCell>
                        )}
                        {columnSettings.createdAt && (
                          <TableCell className='whitespace-nowrap'>-</TableCell>
                        )}
                        {columnSettings.updatedAt && (
                          <TableCell className='whitespace-nowrap'>-</TableCell>
                        )}
                        {columnSettings.actions && (
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <ActionButton
                                action='view'
                                onClick={() => handlePreviewClick(user.id)}
                              />
                              <ActionButton
                                action='edit'
                                onClick={() => handleEditClick(user.id)}
                              />
                              <ActionButton
                                action='delete'
                                onClick={() => handleDeleteClick(user.id)}
                              />
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* プレビューダイアログ */}
      <PreviewDialog isOpen={isPreviewOpen} onClose={handleClosePreview} userId={selectedUserId} />

      {/* 編集ダイアログ */}
      <EditDialog isOpen={isEditOpen} onClose={handleCloseEdit} userId={selectedUserId} />

      {/* 列設定ダイアログ */}
      <ColumnSettingsDialog
        isOpen={isColumnSettingsOpen}
        onClose={() => setIsColumnSettingsOpen(false)}
        onSave={handleColumnSettingsSave}
        currentSettings={columnSettings}
      />
    </div>
  );
}
