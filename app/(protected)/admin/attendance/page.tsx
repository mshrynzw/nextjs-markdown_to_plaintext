import { Suspense } from 'react';

import AttendanceContent from '@/components/app/admin/attendance/AttendanceContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default async function Attendance() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AttendanceContent />
    </Suspense>
  );
}
