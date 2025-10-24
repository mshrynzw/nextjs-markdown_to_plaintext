'use client';

import { Bell, Check, MessageCircle, MessageSquareMore, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMock } from '@/contexts/mock-context';
import { formatCompactDateTime } from '@/lib/utils/datetime';
import type { Notification, User } from '@/schemas';

interface NotificationProps {
  user: User;
  onNotificationClick?: (notification: Notification) => void;
}

export const Notifications = ({ user, onNotificationClick }: NotificationProps) => {
  const { notifications, setNotifications } = useMock();
  const [unreadCount, setUnreadCount] = useState(notifications.filter((n) => !n.is_read).length);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    if (!user) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    if (onNotificationClick) {
      onNotificationClick(notification);
    }

    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <MessageCircle className='w-4 h-4 text-blue-600' />;
      case 'success':
        return <MessageSquareMore className='w-4 h-4 text-purple-600' />;
      case 'warning':
        return <Check className='w-4 h-4 text-green-600' />;
      case 'error':
        return <X className='w-4 h-4 text-red-600' />;
      default:
        return <Bell className='w-4 h-4 text-gray-600' />;
    }
  };

  const getNotificationBadge = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return (
          <Badge variant='default' className='text-xs'>
            通知
          </Badge>
        );
      case 'success':
        return (
          <Badge variant='destructive' className='text-xs'>
            完了通知
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant='secondary' className='text-xs'>
            警告通知
          </Badge>
        );
      case 'error':
        return (
          <Badge variant='outline' className='text-xs'>
            異常通知
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='text-xs'>
            システム
          </Badge>
        );
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' className='relative hover:bg-transparent'>
          <Bell className='w-5 h-5' />
          {unreadCount > 0 && (
            <div className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 m-1'>
              <span className='relative'>
                <div className='absolute inline-flex -left-2.5 h-5 w-5 rounded-full bg-red-700 opacity-75 animate-ping'></div>
                <Badge
                  variant='destructive'
                  className='relative h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-600'
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <div className='flex flex-col p-2 gap-2'>
          <div className='flex items-center justify-between p-2 border-b'>
            <h3 className='font-medium flex items-center gap-2 text-blue-900'>
              <Bell className='w-5 h-5' />
              通知
            </h3>
            <div className='flex items-center gap-2'>
              {unreadCount > 0 && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={markAllAsRead}
                  className='text-xs shadow-sm'
                >
                  すべて既読
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className='max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='p-4 text-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto'></div>
              <p className='text-sm text-muted-foreground mt-2'>読み込み中...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className='p-4 text-center'>
              <Bell className='w-8 h-8 text-gray-400 mx-auto mb-2' />
              <p className='text-sm text-muted-foreground'>通知はありません</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className='p-3 cursor-pointer hover:bg-muted'
                onClick={() => handleNotificationClick(notification)}
              >
                <div className='flex items-start gap-3 w-full'>
                  <div className='flex-shrink-0 mt-0.5'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='text-sm font-medium truncate'>{notification.title}</p>
                      {getNotificationBadge(notification.type)}
                      {!notification.is_read && (
                        <div className='w-2 h-2 bg-primary rounded-full flex-shrink-0'></div>
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground line-clamp-2'>
                      {notification.message}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {formatCompactDateTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
