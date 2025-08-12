
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
  <div className="transition-all duration-700 ease-out opacity-100 translate-y-0 w-full mx-auto h-full flex flex-col px-2 box-border min-h-[320px]">
      <Link
        href={`/produto/${product.id || product.uuid}`}
        className="flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden group bg-white rounded-xl h-full w-full"
        prefetch={false}
      >
        {/* Imagem do Produto */}
  <div className="relative w-full aspect-[2/1] sm:h-48 sm:aspect-auto bg-gray-100 overflow-hidden rounded-t-xl flex-shrink-0 mx-auto">
          <Image
            src={product.image_url || '/placeholder-product.png'}
            alt={product.name || 'Produto'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Conteúdo do Card */}
  <div className="px-3 pb-4 pt-2 sm:p-4 flex flex-col gap-1 sm:gap-2 flex-1 overflow-hidden items-start text-left w-full">
          {/* Título (nome do produto) */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] break-words truncate w-full">
            {product.name}
          </h3>
          {/* Preço atual */}
          <span className="text-base sm:text-lg font-bold text-green-600 w-full">{formatPrice(product.price)}</span>
          {/* Descrição e categoria, se existirem */}
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-700 truncate sm:whitespace-normal sm:line-clamp-2 break-words w-full">{product.description}</p>
          )}
          {product.category && (
            <span className="text-xs sm:text-sm text-gray-500 truncate w-full">Categoria: {product.category}</span>
          )}
          {/* Área de frete e botões (exemplo) */}
          <div className="mt-2 flex flex-col gap-2 sm:gap-2 flex-shrink-0 items-start w-full">
            <span className="text-xs sm:text-sm text-gray-500 truncate w-full">Calcule o frete</span>
            <input type="text" placeholder="Digite seu CEP" className="text-xs sm:text-sm px-2 py-1 border rounded w-full sm:max-w-xs" />
            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full sm:max-w-xs">
              <button className="bg-green-600 text-white text-xs sm:text-sm px-3 py-2 rounded hover:bg-green-700 transition w-full">Comprar</button>
              <button className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded hover:bg-blue-700 transition w-full">Adicionar ao carrinho</button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
