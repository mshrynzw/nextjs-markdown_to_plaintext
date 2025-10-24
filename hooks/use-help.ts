'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { getHelpContent } from '@/lib/utils/help';

export default function useHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const helpContent = getHelpContent(pathname);

  const openHelp = () => {
    if (helpContent) {
      setIsOpen(true);
    }
  };

  const closeHelp = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    helpContent,
    openHelp,
    closeHelp,
    hasHelp: !!helpContent,
  };
}
