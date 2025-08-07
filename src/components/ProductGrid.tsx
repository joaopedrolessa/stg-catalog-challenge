import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import { Product } from '../types/product';

interface ProductGridProps {
  onProductClick?: (product: Product) => void;
}

export default function ProductGrid({ onProductClick }: ProductGridProps) {
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

  // Obter categorias únicas
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Filtrar e ordenar produtos
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Produtos</h1>
        <p className="text-gray-600">Encontre os melhores produtos com os melhores preços</p>
      </div>

      {/* Filtros e Ordenação */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filtro por Categoria */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Categoria:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Todas' : category}
              </button>
            ))}
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mais Recentes</option>
              <option value="price-low">Menor Preço</option>
              <option value="price-high">Maior Preço</option>
              <option value="quantity">Maior Estoque</option>
            </select>
          </div>
        </div>

        {/* Contador de Resultados */}
        <div className="text-sm text-gray-500 mt-3">
          {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 ? 's' : ''} 
          {selectedCategory !== 'all' && ` na categoria "${selectedCategory}"`}
        </div>
      </div>

      {/* Grid de Produtos */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded-lg">
            <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
            <p className="text-sm mt-1">
              {selectedCategory === 'all' 
                ? 'Adicione produtos ao catálogo para vê-los aqui.' 
                : `Não há produtos na categoria "${selectedCategory}".`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
