'use client';

import {
  Activity,
  BarChart3,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock,
  FileText,
  Home,
  House,
  LogOut,
  MessageSquare,
  Server,
  Settings,
  Shield,
  User as UserIcon,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getMenuByView, getViewFromPath } from '@/components/common/sidebar/Menu';
import { useMock } from '@/contexts/mock-context';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils/common';
import { getUserFullName } from '@/lib/utils/user';

// import { logoutAction } from '@/lib/actions/auth';
import type { User } from '@/schemas';

type MenuItem =
  | { href: string; icon: keyof typeof iconMap; label: string; feature?: string }
  | { href: ''; icon: keyof typeof iconMap; label: string };

const iconMap = {
  home: Home,
  clock: Clock,
  calendar: Calendar,
  fileText: FileText,
  users: Users,
  settings: Settings,
  barChart3: BarChart3,
  building: Building,
  clipboardList: ClipboardList,
  activity: Activity,
  house: House,
  messageSquare: MessageSquare,
  circleDollarSign: CircleDollarSign,
} as const;

interface SidebarProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  user: User;
}

export default function Sidebar({ setIsOpen, isOpen = false, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentView, setCurrentView] = useState<'member' | 'admin' | 'system-admin'>('admin');
  const router = useRouter();
  const pathname = usePathname();
  const { companies } = useMock();
  const company = companies[0]; // 最新の会社情報を取得

  // パスから現在のビューを判定
  useEffect(() => {
    const view = getViewFromPath(pathname);
    setCurrentView(view);
  }, [pathname]);

  // 現在のビューに応じたメニューを取得
  const currentMenu = getMenuByView(currentView);

  const menuItems = currentMenu.filter((item) => {
    // セパレーターの場合は常に表示
    if (!('href' in item) || item.href === '') return true;
    // 通常のメニューアイテムの場合は常に表示（フィーチャーチェックは後で実装）
    return true;
  });

  // 画面切り替えハンドラー
  const handleViewChange = (view: 'member' | 'admin' | 'system-admin') => {
    setCurrentView(view);
    switch (view) {
      case 'member':
        router.push('/member/dashboard');
        break;
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'system-admin':
        router.push('/system-admin/dashboard');
        break;
    }
  };

  const sidebarClasses = cn(
    'fixed left-0 top-0 z-50 h-full min-h-screen timeport-sidebar text-white transition-all duration-300 shadow-2xl flex flex-col',
    'lg:relative lg:z-0 lg:translate-x-0',
    isOpen && 'mobile-open',
    isCollapsed ? 'w-16' : 'w-64'
  );

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 lg:hidden z-40'
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-white/20'>
          <div className={cn('flex items-center space-x-3', isCollapsed && 'justify-center')}>
            {!isCollapsed && (
              <>
                <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center'>
                  <span className='text-orange-600 font-bold text-lg'>T</span>
                </div>
                <div>
                  <h1 className='text-lg font-bold'>TimePort</h1>
                  <p className='text-xs text-white/80'>{company?.name || user.company.name}</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='lg:block hidden p-1 rounded-lg hover:bg-white/10 transition-colors'
          >
            {isCollapsed ? (
              <ChevronRight className='w-5 h-5' />
            ) : (
              <ChevronLeft className='w-5 h-5' />
            )}
          </button>
        </div>

        {/* User Info */}
        <div className='p-4 border-b border-white/20 space-y-4'>
          <div className={cn('flex items-center space-x-3', isCollapsed && 'justify-center')}>
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
              <UserIcon className='w-5 h-5' />
            </div>
            {!isCollapsed && (
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>
                  {getUserFullName(user.family_name, user.first_name)}
                </p>
                <p className='text-xs text-white/80 truncate'>
                  {user.role === 'system-admin'
                    ? 'システム管理者'
                    : user.role === 'admin'
                      ? '管理者'
                      : '従業員'}
                </p>
              </div>
            )}
          </div>

          {/* Screen Buttons */}
          <div className='flex flex-col space-y-2 w-full items-center justify-center'>
            {user.role !== 'member' && (
              <button
                onClick={() => handleViewChange('member')}
                className={`w-full p-2 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors ${
                  currentView === 'member' ? 'bg-white/30 border-white/50 border-2' : 'bg-white/10'
                }`}
                title='従業員画面'
              >
                <Users className='w-4 h-4 text-white' />
                {!isCollapsed && <span className='ml-3'>従業員画面</span>}
              </button>
            )}

            {user.role !== 'member' && (
              <button
                onClick={() => handleViewChange('admin')}
                className={`w-full p-2 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors ${
                  currentView === 'admin' ? 'bg-white/30 border-white/50 border-2' : 'bg-white/10'
                }`}
                title='管理者画面'
              >
                <Server className='w-4 h-4 text-white' />
                {!isCollapsed && <span className='ml-3'>管理者画面</span>}
              </button>
            )}

            {user.role === 'system-admin' && (
              <button
                onClick={() => handleViewChange('system-admin')}
                className={`w-full p-2 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors ${
                  currentView === 'system-admin'
                    ? 'bg-white/30 border-white/50 border-2'
                    : 'bg-white/10'
                }`}
                title='システム管理者画面'
              >
                <Shield className='w-4 h-4 text-white' />
                {!isCollapsed && <span className='ml-3'>システム管理者画面</span>}
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname.startsWith(item.href);

            // セパレーターの場合
            if (item.href === '') {
              return (
                <div
                  key={`separator-${item.label}`}
                  className={cn('border-t border-white/20 my-4', isCollapsed && 'mx-2')}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-white/20 text-white backdrop-blur-sm shadow-lg border-white/50 border-2'
                    : 'text-white/80 hover:bg-white/10 hover:text-white transform hover:scale-[1.02]',
                  isCollapsed && 'justify-center'
                )}
                prefetch={true}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'animate-pulse')} />
                {!isCollapsed && <span className='ml-3'>{item.label}</span>}
                {!isCollapsed && isActive && (
                  <div className='ml-auto w-2 h-2 bg-white rounded-full animate-pulse' />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className='p-4 border-t border-white/20 mt-auto'>
          <button
            onClick={() => {
              setIsLoggingOut(true);
              toast({
                title: 'ログアウト',
                description: 'ログアウトします',
                variant: 'default',
              });
              redirect('/login');
            }}
            disabled={isLoggingOut}
            aria-disabled={isLoggingOut}
            className={cn(
              'w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group',
              isCollapsed && 'justify-center',
              isLoggingOut
                ? 'bg-white/10 text-white/60 cursor-not-allowed'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            {isLoggingOut ? (
              <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0' />
            ) : (
              <LogOut className='w-5 h-5 flex-shrink-0 group-hover:animate-pulse' />
            )}
            {!isCollapsed && (
              <span className='ml-3'>{isLoggingOut ? 'ログアウト中...' : 'ログアウト'}</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
