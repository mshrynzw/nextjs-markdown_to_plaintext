'use client';

import { Briefcase, Building, Settings } from 'lucide-react';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMock } from '@/contexts/mock-context';
import { useToast } from '@/hooks/use-toast';
import CompanySettingsTab from '@/components/app/admin/setting/tabs/CompanySettingsTab';
import MockSettingsTab from '@/components/app/admin/setting/tabs/MockSettingsTab';
import PayrollSettingsTab from '@/components/app/admin/setting/tabs/PayrollSettingsTab';

export default function SettingContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  const { companies, setCompanies } = useMock();
  const company = companies[0]; // 最初の会社を取得

  // 会社情報保存ハンドラー
  const handleCompanySave = (formData: {
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
  }) => {
    if (company) {
      const updatedCompany = {
        ...company,
        ...formData,
      };
      setCompanies([updatedCompany]);

      toast({
        title: '保存',
        description: '会社情報を保存しました',
      });
      console.log('会社情報を保存しました:', updatedCompany);
    }
  };

  // 給与設定保存ハンドラー
  const handlePayrollSave = (formData: {
    payroll_cutoff_day: number;
    payroll_payment_day: number;
    is_auto_payroll_calculation: boolean;
    auto_payroll_calculation_time: string;
    health_insurance_rate: number;
    employee_pension_rate: number;
    employment_insurance_rate: number;
    commuting_allowance_fixed: number;
    housing_allowance_fixed: number;
    commuting_allowance_enabled: boolean;
    housing_allowance_enabled: boolean;
  }) => {
    if (company) {
      const updatedCompany = {
        ...company,
        payroll_settings: {
          ...company.payroll_settings,
          payroll_cutoff_day: formData.payroll_cutoff_day,
          payroll_payment_day: formData.payroll_payment_day,
          is_auto_payroll_calculation: formData.is_auto_payroll_calculation,
          auto_payroll_calculation_time: formData.auto_payroll_calculation_time,
          social_insurance_rates: {
            health_insurance_rate: formData.health_insurance_rate,
            employee_pension_rate: formData.employee_pension_rate,
            employment_insurance_rate: formData.employment_insurance_rate,
          },
          allowance_settings: {
            commuting_allowance_fixed: formData.commuting_allowance_fixed,
            housing_allowance_fixed: formData.housing_allowance_fixed,
            commuting_allowance_enabled: formData.commuting_allowance_enabled,
            housing_allowance_enabled: formData.housing_allowance_enabled,
          },
        },
      };
      setCompanies([updatedCompany]);

      toast({
        title: '保存',
        description: '給与設定を保存しました',
      });
      console.log('給与設定を保存しました:', updatedCompany);
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className='space-y-6 bg-white/10 bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30'
    >
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='company' className='flex items-center space-x-2'>
          <Building className='w-4 h-4' />
          <span>会社情報</span>
        </TabsTrigger>
        <TabsTrigger value='payroll' className='flex items-center space-x-2'>
          <Settings className='w-4 h-4' />
          <span>給与設定</span>
        </TabsTrigger>
        <TabsTrigger value='mock' className='flex items-center space-x-2'>
          <Briefcase className='w-4 h-4' />
          {activeTab === 'mock' ? (
            <span className='text-red-600'>モック設定</span>
          ) : (
            <span>設定</span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value='company'>
        <CompanySettingsTab company={company} onSave={handleCompanySave} />
      </TabsContent>

      <TabsContent value='payroll'>
        <PayrollSettingsTab company={company} onSave={handlePayrollSave} />
      </TabsContent>

      <TabsContent value='mock'>
        <MockSettingsTab />
      </TabsContent>
    </Tabs>
  );
}
