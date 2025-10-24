import { Suspense } from 'react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import PayrollContent from '@/components/app/member/payroll/PayrollContent';

export default async function Payroll() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PayrollContent />
    </Suspense>
  );
}
