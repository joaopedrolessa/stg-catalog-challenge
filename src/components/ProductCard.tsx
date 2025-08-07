import Image from 'next/image';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden group"
      onClick={handleClick}
    >
      {/* Imagem do Produto */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <Image
          src={product.image_url || '/placeholder-product.png'}
          alt={`Produto ${product.category}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge de Categoria */}
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4">
        {/* Título (nome do produto) */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.category} - Produto #{product.uuid?.slice(-6)}
        </h3>

        {/* Descrição Completa */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          Produto da categoria {product.category}
        </p>

        {/* Preço e Quantidade */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          
          {/* Badge de Quantidade */}
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            product.quantity > 0 
              ? product.quantity > 10
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.quantity > 0 ? `${product.quantity} disponível` : 'Esgotado'}
          </span>
        </div>

        {/* Botão de Ação */}
        <button 
          className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 ${
            product.quantity > 0
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={product.quantity === 0}
        >
          {product.quantity > 0 ? 'Ver Detalhes' : 'Produto Esgotado'}
        </button>
      </div>
    </div>
  );
}
