import { Suspense } from 'react';

import LoadingSpinner from '@/components/common/LoadingSpinner';
import AttendanceContent from '@/components/app/member/attendance/AttendanceContent';

export default async function Attendance() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AttendanceContent />
    </Suspense>
  );
}
