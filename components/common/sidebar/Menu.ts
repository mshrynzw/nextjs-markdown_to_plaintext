export type FeatureKey = 'chat' | 'report' | 'schedule';

export type IconKey =
  | 'home'
  | 'clock'
  | 'calendar'
  | 'fileText'
  | 'users'
  | 'settings'
  | 'barChart3'
  | 'building'
  | 'clipboardList'
  | 'activity'
  | 'house'
  | 'messageSquare'
  | 'circleDollarSign';

export type MenuItem =
  | { href: string; icon: IconKey; label: string; feature?: string }
  | { href: ''; icon: IconKey; label: string };

export const baseUserMenuItems: MenuItem[] = [
  { href: '/member/dashboard', icon: 'home', label: 'ダッシュボード' },
  { href: '/member/attendance', icon: 'clock', label: '勤怠' },
  // { href: '/member/request', icon: 'fileText', label: '申請' },
  // { href: '/member/leave', icon: 'house', label: '休暇' },
  { href: '/member/payroll', icon: 'circleDollarSign', label: '給与' },
  // { href: '/member/schedule', icon: 'calendar', label: 'スケジュール', feature: 'schedule' },
  // { href: '/member/report', icon: 'barChart3', label: 'レポート', feature: 'report' },
  // { href: '/member/profile', icon: 'users', label: 'プロフィール' },
  { href: '/member/setting', icon: 'settings', label: '設定' },
];

export const adminMenuItems: MenuItem[] = [
  { href: '/admin/dashboard', icon: 'home', label: 'ダッシュボード' },
  { href: '/admin/user', icon: 'users', label: 'ユーザー管理' },
  { href: '/admin/attendance', icon: 'clock', label: '勤怠管理' },
  // { href: '/admin/leave', icon: 'house', label: '休暇管理' },
  // { href: '/admin/request', icon: 'fileText', label: '申請管理' },
  { href: '/admin/payroll', icon: 'circleDollarSign', label: '給与管理' },
  // { href: '/admin/log', icon: 'activity', label: 'ログ' },
  { href: '/admin/setting', icon: 'settings', label: '管理設定' },
];

export const systemAdminMenuItems: MenuItem[] = [
  { href: '/system-admin', icon: 'home', label: 'ダッシュボード' },
  { href: '/system-admin/company', icon: 'building', label: '企業管理' },
  { href: '/system-admin/feature', icon: 'settings', label: '機能管理' },
  { href: '/system-admin/log', icon: 'activity', label: 'ログ' },
  { href: '/system-admin/system', icon: 'barChart3', label: 'システム管理' },
];

// ビューに応じたメニューを取得するヘルパー関数
export const getMenuByView = (view: 'member' | 'admin' | 'system-admin'): MenuItem[] => {
  switch (view) {
    case 'system-admin':
      return systemAdminMenuItems;
    case 'admin':
      return adminMenuItems;
    default:
      return baseUserMenuItems;
  }
};

// パスからビューを判定するヘルパー関数
export const getViewFromPath = (pathname: string): 'member' | 'admin' | 'system-admin' => {
  if (pathname.startsWith('/system-admin')) return 'system-admin';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'member';
};
