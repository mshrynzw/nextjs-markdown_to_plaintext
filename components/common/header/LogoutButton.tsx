'use client';

import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { User } from '@/schemas';

export const LogoutButton = ({ user }: { user: User }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <Button
      variant='outline'
      size='sm'
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
      className='hidden lg:flex bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm flex-shrink-0 p-2'
    >
      {isLoggingOut ? (
        <span className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0' />
      ) : (
        <LogOut className='w-4 h-4' />
      )}
    </Button>
  );
};
