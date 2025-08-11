'use client';


import { useAuth } from '../hooks/useAuth';
import HeroCarousel from '../components/HeroCarousel';
import ProductGrid from '../components/ProductGrid';

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
      <div className="w-full bg-white shadow-sm py-8">
        <HeroCarousel />
      </div>
      <div className="w-full flex flex-col items-center py-10">
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10 h-30 flex items-center justify-center">
            Nossos Produtos
          </h2>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
