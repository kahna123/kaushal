'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RequireRole = ({ children, allowedRole }) => {
  const router = useRouter();
  const roleId = typeof window !== 'undefined' ? sessionStorage.getItem('roleId') : null;

  useEffect(() => {
    if (roleId !== allowedRole) {
      router.push('/login');
    }
  }, [roleId, allowedRole, router]);

  return roleId === allowedRole ? children : null;
};

export default RequireRole;
