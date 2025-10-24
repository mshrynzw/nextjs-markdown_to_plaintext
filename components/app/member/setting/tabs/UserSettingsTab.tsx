'use client';

import { Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User as UserType } from '@/schemas';

interface UserSettingsTabProps {
  user: UserType | undefined;
  onSave: (formData: UserFormData) => void;
}

interface UserFormData {
  family_name: string;
  first_name: string;
  email: string;
  role: 'system-admin' | 'admin' | 'member';
}

export default function UserSettingsTab({ user, onSave }: UserSettingsTabProps) {
  const [formData, setFormData] = useState<UserFormData>({
    family_name: '',
    first_name: '',
    email: '',
    role: 'admin',
  });

  // ユーザーデータが変更されたときにフォームデータを更新
  useEffect(() => {
    if (user) {
      setFormData({
        family_name: user.family_name || '',
        first_name: user.first_name || '',
        email: user.email || '',
        role: user.role || 'admin',
      });
    }
  }, [user]);

  const handleInputChange = (
    field: string,
    value: string | 'system-admin' | 'admin' | 'member'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='w-5 h-5' />
          ユーザー情報
        </CardTitle>
        <CardDescription>ユーザーの基本情報と設定</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='user-family-name'>姓</Label>
            <Input
              id='user-family-name'
              value={formData.family_name}
              onChange={(e) => handleInputChange('family_name', e.target.value)}
              placeholder='姓を入力してください'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='user-first-name'>名</Label>
            <Input
              id='user-first-name'
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder='名を入力してください'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='user-email'>メールアドレス</Label>
            <Input
              id='user-email'
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder='メールアドレスを入力してください'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='user-role'>ロール</Label>
            <select
              id='user-role'
              value={formData.role}
              onChange={(e) =>
                handleInputChange('role', e.target.value as 'system-admin' | 'admin' | 'member')
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='system-admin'>システム管理者</option>
              <option value='admin'>管理者</option>
              <option value='member'>従業員</option>
            </select>
          </div>
        </div>

        <div className='flex justify-end pt-4 border-t'>
          <Button onClick={handleSave} className='flex items-center space-x-2'>
            <Save className='w-4 h-4' />
            <span>保存</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
