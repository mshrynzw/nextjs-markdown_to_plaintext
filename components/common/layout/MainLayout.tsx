import ShellClient from '@/components/common/layout/ShellClient';
import type { User } from '@/schemas';

type Props = {
  children: React.ReactNode;
  user: User;
};

export default function MainLayout({ children, user }: Props) {
  return <ShellClient user={user}>{children}</ShellClient>;
}
