import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { APP_CONFIG } from '@/common/config';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side check for token
  const token = (await cookies()).get(APP_CONFIG.cookies.tokenKey);
  
  if (!token) {
    redirect('/signin');
  }

  return <>{children}</>;
}
