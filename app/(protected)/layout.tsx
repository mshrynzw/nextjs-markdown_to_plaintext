'use client';

import MainLayout from '@/components/common/layout/MainLayout';
import { getMenuByView } from '@/components/common/sidebar/Menu';
import { useMock } from '@/contexts/mock-context';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { user } = useMock();
  const menu = getMenuByView(user.role);

  return <MainLayout user={user}>{children}</MainLayout>;
}
