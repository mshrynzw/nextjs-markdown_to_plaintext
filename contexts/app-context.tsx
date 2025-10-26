'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type TabType = 'markdown' | 'plaintext';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  markdown: string;
  setMarkdown: (markdown: string) => void;
  plainText: string;
  setPlainText: (plainText: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<TabType>('markdown');
  const [markdown, setMarkdown] = useState<string>('');
  const [plainText, setPlainText] = useState<string>('');

  return (
    <AppContext.Provider
      value={{ activeTab, setActiveTab, markdown, setMarkdown, plainText, setPlainText }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
