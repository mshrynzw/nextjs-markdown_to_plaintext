import type { UserColumnSettings } from '@/schemas/column-settings';

import useColumnSettings from './use-column-settings';

const STORAGE_KEY = 'user-column-settings';

const defaultColumnSettings: UserColumnSettings = {
  group: true,
  employee: true,
  workType: true,
  status: true,
  email: false,
  phone: false,
  createdAt: false,
  updatedAt: false,
  actions: true,
};

export default function useUserColumnSettings() {
  return useColumnSettings(STORAGE_KEY, defaultColumnSettings);
}
