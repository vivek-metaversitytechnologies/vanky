'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const PUBLIC_ROUTES = ['/login'];

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;

    // Wait for Redux to rehydrate
    if (loading) return;

    setIsReady(true);

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated) {
      // User is not authenticated
      if (!isPublicRoute) {
        // Redirect to login if trying to access protected route
        router.push('/login');
      }
    } else {
      // User is authenticated
      if (isPublicRoute) {
        // Redirect to home if trying to access login page
        router.push('/home');
      }
    }
  }, [isAuthenticated, pathname, router, loading]);

  // Show nothing while checking authentication
  if (!isReady) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d1f05',
        }}
      >
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <i
            className="fas fa-spinner fa-spin"
            style={{ fontSize: '2rem', marginBottom: '1rem' }}
          ></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
