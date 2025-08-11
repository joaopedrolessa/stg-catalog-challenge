
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}



export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };



  return (
    <div className="transition-all duration-700 ease-out opacity-100 translate-y-0">
      <Link
        href={`/produto/${product.id || product.uuid}`}
        className="block hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden group"
        prefetch={false}
      >
        {/* Imagem do Produto */}
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <Image
            src={product.image_url || '/placeholder-product.png'}
            alt={product.name || 'Produto'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Conteúdo do Card */}
        <div className="p-4">
          {/* Título (nome do produto) */}
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          {/* Preço atual */}
          <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </div>
  );
}
