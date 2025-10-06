
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/discover');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    
      
        Etincel
        Loading...
      
    
  );
}