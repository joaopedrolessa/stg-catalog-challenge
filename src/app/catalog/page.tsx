'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../types/product';

export default function CatalogPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#171A1F]">Catálogo</h1>
      </div>

      <ProductGrid onProductClick={handleProductClick} />

      {/* Modal de Detalhes do Produto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-md sm:max-w-xl md:max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col">
            {/* Header do Modal */}
            <div className="flex justify-between items-start p-4 sm:p-6 border-b">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl font-bold text-[#171A1F]">
                  {selectedProduct.category} - Produto #{selectedProduct.uuid?.slice(-6)}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col md:grid md:grid-cols-2 gap-6 items-center justify-center">
                {/* Imagem */}
                <div className="relative w-full h-56 sm:h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src={selectedProduct.image_url || '/placeholder-product.png'}
                    alt={`Produto ${selectedProduct.category}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Informações */}
                <div className="space-y-4 w-full flex flex-col items-center md:items-start text-center md:text-left">
                  {/* Descrição */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#171A1F] mb-2">Descrição</h3>
                    <p className="text-gray-600 leading-relaxed break-words">
                      Produto da categoria {selectedProduct.category}
                    </p>
                  </div>

                  {/* Preço */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#171A1F] mb-2">Preço</h3>
                    <p className="text-3xl font-bold text-green-600 break-words">{formatPrice(selectedProduct.price)}</p>
                  </div>

                  {/* Estoque */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#171A1F] mb-2">Disponibilidade</h3>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProduct.quantity > 0
                        ? selectedProduct.quantity > 10
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedProduct.quantity > 0 
                        ? `${selectedProduct.quantity} unidades disponíveis`
                        : 'Produto esgotado'
                      }
                    </div>
                  </div>

                  {/* Data de Cadastro */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#171A1F] mb-2">Cadastrado em</h3>
                    <p className="text-gray-600">{formatDate(selectedProduct.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  className={`flex-1 font-medium py-3 px-6 rounded-md transition-colors ${
                    selectedProduct.quantity > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={selectedProduct.quantity === 0}
                >
                  {selectedProduct.quantity > 0 ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}