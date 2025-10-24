'use client';

import { Menu, MessageCircleQuestionIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { LogoutButton } from '@/components/common/header/LogoutButton';
import { Notifications } from '@/components/common/header/Notifications';
import { SearchInput } from '@/components/common/header/SearchInput';
import HelpDialog from '@/components/common/HelpDialog';
import { Button } from '@/components/ui/button';
import useHelp from '@/hooks/use-help';
import { toast } from '@/hooks/use-toast';
import { getUserFullName } from '@/lib/utils/user';
import type { Notification, User, UserRole } from '@/schemas';

interface HeaderProps {
  user: User;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Header({ user, setIsOpen }: HeaderProps) {
  const router = useRouter();
  const { isOpen, helpContent, openHelp, closeHelp, hasHelp } = useHelp();

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'system-admin':
        return 'システム管理者';
      case 'admin':
        return '管理者';
      case 'member':
      default:
        return '従業員';
    }
  };

  return (
    <header className='h-16 timeport-header text-white flex items-center justify-between px-4 lg:px-6 shadow-xl relative z-20 overflow-hidden'>
      <div className='flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1'>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden text-white hover:bg-white/10 flex-shrink-0'
          onClick={() => setIsOpen(true)}
        >
          <Menu className='w-5 h-5' />
        </Button>
        <SearchInput />
      </div>

      <div className='flex items-center space-x-1 lg:space-x-2 min-w-0 flex-shrink-0'>
        <div className='flex items-center space-x-1 lg:space-x-2 min-w-0'>
          <div className='w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 flex-shrink-0'>
            <span className='text-xs font-medium text-white'>{user.family_name.charAt(0)}</span>
          </div>
          <div className='hidden md:block min-w-0'>
            <div className='text-xs text-white/70 truncate max-w-20 lg:max-w-32'>
              {getUserFullName(user.family_name, user.first_name)}
            </div>
            <div className='text-xs text-white/70 truncate'>{getRoleLabel(user.role)}</div>
          </div>
        </div>

        <div className='flex-shrink-0'>
          <Notifications
            user={user}
            onNotificationClick={(notification: Notification) => {
              if (notification.link_url) {
                router.push(notification.link_url);
              } else {
                toast({
                  title: '通知のURLがありません',
                  description: '通知のURLがありません',
                  variant: 'destructive',
                });
              }
            }}
          />
        </div>

        {hasHelp && (
          <Button
            variant='outline'
            size='sm'
            onClick={openHelp}
            className='shadow-2xl shadow-white/80 border-2 hover:shadow-white/40 flex bg-white/10 border-white/80 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm flex-shrink-0 p-2'
          >
            <MessageCircleQuestionIcon className='w-4 h-4' />
          </Button>
        )}
        {/* ログアウトボタン */}
        <LogoutButton user={user} />
      </div>

      {/* ヘルプダイアログ */}
      {helpContent && (
        <HelpDialog
          isOpen={isOpen}
          onClose={closeHelp}
          title={helpContent.title}
          description={helpContent.description}
        />
      )}
    </header>
  );
}
