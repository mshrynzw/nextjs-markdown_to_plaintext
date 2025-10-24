'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { getInitialAttendance } from '@/lib/mock/attendance';
import { initialCompanies } from '@/lib/mock/company';
import { initialNotifications } from '@/lib/mock/notifications';
import { getInitialPayrolls } from '@/lib/mock/payrolls';
import getInitialUser from '@/lib/mock/user';
import { getInitialUsers } from '@/lib/mock/users';
import type { Attendance, Company, Notification, Payroll, Setting, User } from '@/schemas';

interface MockContextType {
  user: User;
  users: User[];
  companies: Company[];
  notifications: Notification[];
  payrolls: Payroll[];
  attendances: Attendance[];
  settings: Setting;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setPayrolls: React.Dispatch<React.SetStateAction<Payroll[]>>;
  setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>;
  setSettings: React.Dispatch<React.SetStateAction<Setting>>;
  resetMockData: () => void;
}

const MockContext = createContext<MockContextType | undefined>(undefined);

// ローカルストレージのキー
const STORAGE_KEYS = {
  user: 'timeport-mock-user',
  users: 'timeport-mock-users',
  companies: 'timeport-mock-companies',
  notifications: 'timeport-mock-notifications',
  payrolls: 'timeport-mock-payrolls',
  attendances: 'timeport-mock-attendances',
  settings: 'timeport-mock-settings',
} as const;

// ローカルストレージからデータを読み込む関数
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// ローカルストレージにデータを保存する関数
const saveToStorage = <T,>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn(`localStorage quota exceeded for ${key}. Data not saved.`);
      // 必要に応じて古いデータを削除して再試行
      try {
        // 古いデータを削除して再試行
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryError) {
        console.error(`Failed to save ${key} to localStorage even after cleanup:`, retryError);
      }
    } else {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }
};

// ローカルストレージをクリアする関数
const clearStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const MockProvider = ({ children }: { children: ReactNode }) => {
  // 初期値の取得
  const initialSettings: Setting = {
    id: '1',
    admin_ratio: 10,
    attendance_history_ratio: 25,
    payroll_history_ratio: 25,
    month_offset: 12,
    employee_count: 30,
    mode: 'normal',
  };
  const initialUser = getInitialUser(initialCompanies[0]);
  const initialUsers = getInitialUsers(
    initialCompanies[0],
    initialSettings.admin_ratio,
    initialSettings.employee_count
  );
  const initialAttendances = getInitialAttendance(initialUsers, initialSettings);
  const initialPayrolls = getInitialPayrolls(
    initialUsers,
    initialAttendances,
    initialSettings,
    initialSettings.month_offset
  );

  // ローカルストレージからデータを読み込み、なければ初期値を使用
  const [user, setUser] = useState<User>(() => loadFromStorage(STORAGE_KEYS.user, initialUser));
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage(STORAGE_KEYS.users, initialUsers)
  );
  const [companies, setCompanies] = useState<Company[]>(() =>
    loadFromStorage(STORAGE_KEYS.companies, initialCompanies)
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage(STORAGE_KEYS.notifications, initialNotifications)
  );
  const [payrolls, setPayrolls] = useState<Payroll[]>(() =>
    loadFromStorage(STORAGE_KEYS.payrolls, initialPayrolls)
  );
  const [attendances, setAttendances] = useState<Attendance[]>(() =>
    loadFromStorage(STORAGE_KEYS.attendances, initialAttendances)
  );
  const [settings, setSettings] = useState<Setting>(() =>
    loadFromStorage(STORAGE_KEYS.settings, initialSettings)
  );

  // データが変更されたときにローカルストレージに保存
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.user, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.companies, companies);
  }, [companies]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.payrolls, payrolls);
  }, [payrolls]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.attendances, attendances);
  }, [attendances]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  // モックデータをリセットする関数
  const resetMockData = () => {
    clearStorage();
    setUser(initialUser);
    setUsers(initialUsers);
    setCompanies(initialCompanies);
    setNotifications(initialNotifications);
    setPayrolls(initialPayrolls);
    setAttendances(initialAttendances);
    setSettings(initialSettings);
  };

  // 現在のユーザーをusers[0]から取得
  const currentUser = users[0] || user;

  return (
    <MockContext.Provider
      value={{
        user: currentUser,
        setUser,
        users,
        setUsers,
        companies,
        setCompanies,
        notifications,
        setNotifications,
        payrolls,
        setPayrolls,
        attendances,
        setAttendances,
        settings,
        setSettings,
        resetMockData,
      }}
    >
      {children}
    </MockContext.Provider>
  );
};

export const useMock = () => {
  const context = useContext(MockContext);
  if (!context) {
    throw new Error('useMock must be used within a MockProvider');
  }
  return context;
};
