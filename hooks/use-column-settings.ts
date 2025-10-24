import { useEffect, useState } from 'react';

import type { BaseColumnSettings } from '@/schemas/column-settings';

export default function useColumnSettings<T extends BaseColumnSettings>(
  storageKey: string,
  defaultSettings: T
) {
  const [settings, setSettings] = useState<T>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // ローカルストレージから設定を読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        // デフォルト設定とマージして、新しい列が追加された場合に対応
        const mergedSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(mergedSettings);
      }
    } catch (error) {
      console.error(`Failed to load column settings from localStorage (${storageKey}):`, error);
      setSettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, defaultSettings]);

  // 設定を保存
  const saveSettings = (newSettings: T) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error(`Failed to save column settings to localStorage (${storageKey}):`, error);
    }
  };

  // 設定をリセット
  const resetSettings = () => {
    try {
      localStorage.removeItem(storageKey);
      setSettings(defaultSettings);
    } catch (error) {
      console.error(`Failed to reset column settings (${storageKey}):`, error);
    }
  };

  return {
    settings,
    saveSettings,
    resetSettings,
    isLoaded,
  };
}
