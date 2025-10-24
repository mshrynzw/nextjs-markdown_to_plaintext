'use client';

import { Building, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Company } from '@/schemas';

interface CompanySettingsTabProps {
  company: Company | undefined;
  onSave: (formData: CompanyFormData) => void;
}

interface CompanyFormData {
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
}

export default function CompanySettingsTab({ company, onSave }: CompanySettingsTabProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
  });

  // 会社データが変更されたときにフォームデータを更新
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        code: company.code || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
      });
    }
  }, [company]);

  const handleInputChange = (field: string, value: string) => {
    // 会社コードの場合は英字の小文字・数字・ハイフンのみ許可
    if (field === 'code') {
      const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData((prev) => ({
        ...prev,
        [field]: sanitizedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Card className='bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Building className='w-5 h-5' />
          会社情報
        </CardTitle>
        <CardDescription>会社の基本情報と設定</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='company-name'>会社名</Label>
            <Input
              id='company-name'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder='会社名を入力してください'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='company-code'>会社コード</Label>
            <Input
              id='company-code'
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder='test-company-001'
            />
            <p className='text-xs text-gray-500'>英字の小文字・数字・ハイフンのみ使用可能です</p>
          </div>

          <div className='space-y-2 md:col-span-2'>
            <Label htmlFor='company-address'>住所</Label>
            <Input
              id='company-address'
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder='住所を入力してください'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='company-phone'>電話番号</Label>
            <Input
              id='company-phone'
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder='電話番号を入力してください'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='company-email'>メールアドレス</Label>
            <Input
              id='company-email'
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder='メールアドレスを入力してください'
            />
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
