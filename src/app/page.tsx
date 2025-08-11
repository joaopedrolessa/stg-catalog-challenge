'use client';

import { useAuth } from '../hooks/useAuth';
import HeroCarousel from '../components/HeroCarousel';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-16">
      <HeroCarousel />
    </div>
  );
}
