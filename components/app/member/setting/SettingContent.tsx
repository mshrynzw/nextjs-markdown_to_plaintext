'use client';

import { User } from 'lucide-react';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMock } from '@/contexts/mock-context';
import { useToast } from '@/hooks/use-toast';
import UserSettingsTab from '@/components/app/member/setting/tabs/UserSettingsTab';

export default function SettingContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('user');
  const { users, setUsers } = useMock();
  const user = users[0]; // 最初のユーザーを取得

  // ユーザー情報保存ハンドラー
  const handleUserSave = (formData: {
    family_name: string;
    first_name: string;
    email: string;
    role: 'system-admin' | 'admin' | 'member';
  }) => {
    if (user) {
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, ...formData } : u));
      setUsers(updatedUsers);
      toast({
        title: '保存',
        description: 'ユーザー情報を保存しました',
      });
      console.log('ユーザー情報を保存しました:', { ...user, ...formData });
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='space-y-6 bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'
    >
      <TabsList className='grid w-full grid-cols-1'>
        <TabsTrigger value='user' className='flex items-center space-x-2'>
          <User className='w-4 h-4' />
          <span>ユーザー情報</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value='user'>
        <UserSettingsTab user={user} onSave={handleUserSave} />
      </TabsContent>
    </Tabs>
  );
}
