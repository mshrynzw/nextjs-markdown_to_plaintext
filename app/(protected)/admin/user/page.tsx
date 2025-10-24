import { Suspense } from 'react';

import UserContent from '@/components/app/admin/user/UserContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default async function Payroll() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserContent />
    </Suspense>
  );
}
