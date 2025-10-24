'use client';

import { useState } from 'react';

import Header from '@/components/common/header/Header';
import Particles from '@/components/common/Particles';
import Sidebar from '@/components/common/sidebar/Sidebar';
import type { User } from '@/schemas';

type Props = {
  children: React.ReactNode;
  user: User;
};

export default function ShellClient({ children, user }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='h-screen timeport-main-background flex relative overflow-hidden'>
      {/* 浮遊パーティクル（クライアントで描画 → 水和ズレ回避） */}
      <div className='absolute inset-0 pointer-events-none'>
        <Particles />
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} user={user} />

      <div className='flex-1 flex flex-col relative z-10 h-full w-full lg:w-auto main-container min-w-0'>
        <Header user={user} setIsOpen={setIsOpen} />
        <main className='flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-auto custom-scrollbar h-full w-full mobile-main'>
          <div className='w-full animate-slide-in min-w-0'>{children}</div>
        </main>
      </div>
    </div>
  );
}
