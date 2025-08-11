import { useState, useRef, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import { Product } from '../types/product';


export default function ProductGrid() {
  const { products, loading, error, refetch } = useProducts();
  // 🔍 ADICIONE ESTES LOGS PARA DEBUG:
  console.log('🎯 Estado do ProductGrid:', {
    products,
    loading,
    error,
    productsLength: products.length
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const categories = ['all', ...new Set(products.map(product => product.category))];
  const filteredAndSortedProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'quantity':
          return b.quantity - a.quantity;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  // --- ANIMAÇÃO DE BLOCOS DE 4 ---
  // Divide os produtos em blocos de 4
  const chunkArray = (arr: Product[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };
  const productChunks = chunkArray(filteredAndSortedProducts, 4);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    blockRefs.current = blockRefs.current.slice(0, productChunks.length);
    productChunks.forEach((_, idx) => {
      const ref = blockRefs.current[idx];
      if (!ref) return;
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleBlocks((prev) =>
                prev.includes(idx) ? prev : [...prev, idx]
              );
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [productChunks]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-3"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-medium">Erro ao carregar produtos</h3>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Grid de Produtos animado por blocos de 4 */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg">
            <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
            <p className="text-sm mt-1">
              Nenhum produto disponível no momento.
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-8 mt-10">
          {productChunks.map((chunk, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-700 ease-out w-full min-h-[340px]
                ${visibleBlocks.includes(idx)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 pointer-events-none'}
              `}
              ref={el => { blockRefs.current[idx] = el; }}
            >
                     <div className="grid grid-cols-4 gap-6 w-full h-full">
                {chunk.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
