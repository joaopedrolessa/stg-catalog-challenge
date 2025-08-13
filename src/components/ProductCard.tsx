
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseClient';

interface ProductCardProps {
  product: Product;
}



export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
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
          {/* Botão Adicionar ao carrinho */}
          <div className="mt-4 flex flex-col gap-2 w-full">
            <button
              className="bg-blue-600 text-white text-xs sm:text-sm px-3 py-2 rounded hover:bg-blue-700 transition w-full"
              onClick={async e => {
                e.preventDefault();
                if (!user) {
                  toast.info('Faça login para adicionar produtos ao carrinho!', { position: 'top-center', autoClose: 2500 });
                  setTimeout(() => {
                    window.location.href = '/login';
                  }, 2000);
                  return;
                }
                try {
                  // Verifica se já existe o item no carrinho do usuário
                  const { data: existing, error: fetchError } = await supabase
                    .from('cart_items')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('product_id', product.id)
                    .maybeSingle();
                  if (fetchError) throw fetchError;
                  if (existing) {
                    // Atualiza a quantidade
                    const { error: updateError } = await supabase
                      .from('cart_items')
                      .update({ quantity: existing.quantity + 1 })
                      .eq('id', existing.id);
                    if (updateError) throw updateError;
                  } else {
                    // Insere novo item
                    const { error: insertError } = await supabase
                      .from('cart_items')
                      .insert([
                        {
                          user_id: user.id,
                          product_id: product.id,
                          quantity: 1,
                        },
                      ]);
                    if (insertError) throw insertError;
                  }
                  toast.success('Produto adicionado ao carrinho!', { position: 'top-right', autoClose: 2000 });
                } catch (err: any) {
                  toast.error('Erro ao adicionar ao carrinho: ' + (err?.message || '')); 
                }
              }}
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
