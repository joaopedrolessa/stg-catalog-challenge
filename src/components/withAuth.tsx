import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface WithAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = { requireAuth: true, redirectTo: '/login' }
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (options.requireAuth && !user) {
          router.push(options.redirectTo || '/login');
        } else if (!options.requireAuth && user) {
          router.push('/dashboard');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (options.requireAuth && !user) {
      return null;
    }

    if (!options.requireAuth && user) {
      return null;
    }

    return <Component {...props} />;
  };
}
