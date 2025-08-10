'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
      
      if (requireAuth && !user) {
        router.push(redirectTo);
  }
    }
  }, [user, router, requireAuth, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se requer autenticação e não há usuário, não renderiza nada
  if (requireAuth && !user) {
    return null;
  }

  // Se não requer autenticação e há usuário, não renderiza nada
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}
