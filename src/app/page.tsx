"use client";
/**
 * Página inicial: mostra HeroCarousel + destaques (primeiros 4 produtos) + grid chunked completo.
 * Carrega auth e produtos; exibe loading enquanto qualquer um estiver carregando.
 */
import HeroCarousel from '../components/HeroCarousel';
import ProductGrid from '../components/ProductGrid';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();

  if (authLoading || productsLoading) {
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
          {/* Destaques */}
          <div className="w-full bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 transition-all duration-700 ease-out max-w-full sm:max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full h-full justify-items-center mx-auto">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          {/* Grid completo */}
          <ProductGrid hideFilters />
        </div>
      </div>
    </div>
  );
}
