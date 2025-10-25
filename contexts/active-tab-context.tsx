'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type TabType = 'markdown' | 'plaintext';

interface ActiveTabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ActiveTabContext = createContext<ActiveTabContextType | undefined>(undefined);

interface ActiveTabProviderProps {
  children: ReactNode;
}

export const ActiveTabProvider = ({ children }: ActiveTabProviderProps): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<TabType>('markdown');

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

export const useActiveTab = (): ActiveTabContextType => {
  const context = useContext(ActiveTabContext);
  if (context === undefined) {
    throw new Error('useActiveTab must be used within an ActiveTabProvider');
  }
  return context;
};
