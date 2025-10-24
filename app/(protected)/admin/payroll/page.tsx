import { Suspense } from 'react';

import PayrollContent from '@/components/app/admin/payroll/PayrollContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default async function Payroll() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PayrollContent />
    </Suspense>
  );
}
