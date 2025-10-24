import { Suspense } from 'react';

import DashboardContent from '@/components/app/admin/dashboard/DashboardContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default async function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
