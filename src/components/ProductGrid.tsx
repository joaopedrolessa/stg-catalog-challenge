import { useState, useRef, useEffect, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import { Product } from '../types/product';

import React from 'react';
interface ProductGridProps {
  hideFilters?: boolean;
  onProductClick?: (product: Product) => void;
}

export default function ProductGrid({ hideFilters = false, onProductClick }: ProductGridProps) {
  const { products, loading, error, refetch } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  // Normaliza categorias para unicidade real, mas mantém o nome original para exibição
  const categories = Array.from(new Set(products.map(product => product.category))).filter(Boolean);

  // Chunk logic for home page
  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  // Filter and sort products before chunking
  const filteredAndSortedProducts = products
    .filter(product =>
      (selectedCategory === 'all' || product.category === selectedCategory)
    )
    .filter(product =>
      (minValue === '' || product.price >= parseFloat(minValue)) &&
      (maxValue === '' || product.price <= parseFloat(maxValue))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-az': {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
        }
        case 'name-za': {
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameB.localeCompare(nameA);
        }
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });


  // Only chunk for main page (hideFilters), memoized
  const productChunks = useMemo(() => (
    hideFilters
      ? chunkArray(filteredAndSortedProducts, 8)
      : [filteredAndSortedProducts]
  ), [hideFilters, filteredAndSortedProducts]);

  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);
  useEffect(() => {
    if (!hideFilters) return;
    const observers: IntersectionObserver[] = [];
    blockRefs.current = blockRefs.current.slice(0, productChunks.length);
    productChunks.forEach((_: Product[], idx: number) => {
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
  }, [hideFilters, productChunks]);

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
  <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
      {/* Filtros e ordenação */}
      {!hideFilters && (
  <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          {/* Sidebar de filtros */}
          <aside className="w-full sm:w-64 bg-white p-4 sm:p-6 rounded-lg shadow mb-4 sm:mb-8 sticky top-20 sm:top-24 self-start flex-shrink-0">
            {/* Ordenação em primeiro */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                className="border rounded px-3 py-2 w-full text-gray-700 placeholder-gray-700"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="newest">Mais recentes</option>
                <option value="name-az">Nome (A-Z)</option>
                <option value="name-za">Nome (Z-A)</option>
                <option value="price-low">Valor crescente</option>
                <option value="price-high">Valor decrescente</option>
              </select>
            </div>
            {/* Categoria como select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                className="border rounded px-3 py-2 w-full text-gray-700 placeholder-gray-700"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {/* Valores */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor mínimo</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full text-gray-700 placeholder-gray-700"
                value={minValue}
                onChange={e => setMinValue(e.target.value)}
                placeholder="R$ Min"
                min={0}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor máximo</label>
              <input
                type="number"
                className="border rounded px-3 py-2 w-full text-gray-700 placeholder-gray-700"
                value={maxValue}
                onChange={e => setMaxValue(e.target.value)}
                placeholder="R$ Max"
                min={0}
              />
            </div>
          </aside>
          {/* Grid de produtos */}
          <div className="flex-1 w-full">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg">
                  <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
                  <p className="text-sm mt-1">
                    Nenhum produto disponível no momento.
                  </p>
                </div>
              </div>
            ) : hideFilters ? (
              <div className="pt-8 mt-10">
                {productChunks.map((chunk, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-700 ease-out w-full min-h-[340px] max-w-6xl mx-auto
                      ${visibleBlocks.includes(idx)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8 pointer-events-none'}
                    `}
                    ref={el => { blockRefs.current[idx] = el; }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full h-full">
                      {chunk.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onClick={onProductClick ? () => onProductClick(product) : undefined}
                          />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pt-4 sm:pt-8 mt-4 sm:mt-10 flex flex-col items-center w-full">
                <div className="bg-white rounded-xl shadow-md p-3 sm:p-5 mb-4 sm:mb-8 transition-all duration-700 ease-out max-w-full sm:max-w-6xl w-full mx-auto min-h-[340px] opacity-100 translate-y-0">
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 w-full h-full justify-items-stretch sm:justify-items-center mx-auto">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={onProductClick ? () => onProductClick(product) : undefined}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
  {/* (Bloco duplicado removido) */}
    </div>
  );
}
