import { Suspense } from 'react';

import SettingContent from '@/components/app/member/setting/SettingContent';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default async function Setting() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SettingContent />
    </Suspense>
  );
}
