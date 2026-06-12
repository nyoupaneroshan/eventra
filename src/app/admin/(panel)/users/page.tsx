'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/api';
import AdminUsers from '@/components/admin/admin-users';

export default function AdminUsersPage() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.replace('/admin');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-rose border-t-transparent rounded-full"></div></div>;
  }

  return <AdminUsers />;
}
