'use client';

import React from 'react';
import { Bell } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils/datetime';
import type { Notification } from '@/schemas';

interface NotificationsCardProps {
  notifications?: Notification[];
  maxDisplayCount?: number;
}

export default function NotificationsCard({
  notifications = [],
  maxDisplayCount = 3,
}: NotificationsCardProps) {
  // ハードコーディングされた通知データ（実際のアプリでは props から取得）
  const mockNotifications: Notification[] = [
    {
      id: '1',
      user_id: '1',
      title: '新規申請',
      message: '田中花子さんから休暇申請が提出されました',
      type: 'info',
      priority: 'normal',
      is_read: false,
      created_at: '2024-01-20T19:00:00Z',
      updated_at: '2024-01-20T19:00:00Z',
    },
    {
      id: '2',
      user_id: '1',
      title: '申請承認',
      message: 'あなたの休暇申請が承認されました',
      type: 'success',
      priority: 'normal',
      is_read: false,
      created_at: '2024-01-19T23:30:00Z',
      updated_at: '2024-01-19T23:30:00Z',
    },
    {
      id: '3',
      user_id: '1',
      title: '給与明細',
      message: '2024年1月の給与明細が確認可能です',
      type: 'info',
      priority: 'normal',
      is_read: true,
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z',
    },
  ];

  // 実際の通知データまたはモックデータを使用
  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
  const unreadNotifications = displayNotifications.filter((n) => !n.is_read);
  const recentNotifications = displayNotifications.slice(0, maxDisplayCount);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getNotificationTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-900';
      case 'warning':
        return 'text-yellow-900';
      case 'error':
        return 'text-red-900';
      default:
        return 'text-blue-900';
    }
  };

  return (
    <Card className='h-full flex flex-col bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>お知らせ</span>
          {unreadNotifications.length > 0 && (
            <span className='bg-red-500 text-white text-xs w-5 h-5 m-1 rounded-full flex items-center justify-center'>
              {unreadNotifications.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex-1'>
        <div className='space-y-3'>
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${getNotificationBgColor(
                  notification.type
                )} ${!notification.is_read ? 'ring-2 ring-blue-200' : ''}`}
              >
                <div className='flex items-start space-x-3'>
                  <div className='text-lg'>{getNotificationIcon(notification.type)}</div>
                  <div className='flex-1 min-w-0'>
                    <div
                      className={`font-medium text-sm ${getNotificationTextColor(notification.type)}`}
                    >
                      {notification.title}
                    </div>
                    <div
                      className={`text-xs mt-1 ${getNotificationTextColor(notification.type)} opacity-80`}
                    >
                      {notification.message}
                    </div>
                    <div
                      className={`text-xs mt-2 ${getNotificationTextColor(notification.type)} opacity-60`}
                    >
                      {formatDateTime(notification.created_at)}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2'></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
              <Bell className='w-8 h-8 mb-2 text-gray-400' />
              <p className='text-sm'>通知はありません</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
