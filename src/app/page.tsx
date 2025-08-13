"use client";


import Image from 'next/image';
import { toast } from 'react-toastify';
import { showToast } from '../utils/toastManager';
import { addToCart } from '../utils/cart';
import HeroCarousel from '../components/HeroCarousel';
import ProductGrid from '../components/ProductGrid';


import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
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
          {/* Grid dos 4 primeiros produtos reais */}
          <div className="w-full bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 transition-all duration-700 ease-out max-w-full sm:max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full h-full justify-items-center mx-auto">
              {products.slice(0, 4).map((product) => (
                <div key={product.uuid} className="transition-all duration-700 ease-out opacity-100 translate-y-0 w-full flex flex-col px-2 box-border min-h-[320px] bg-white rounded-xl shadow hover:shadow-lg">
                  <div className="relative w-full aspect-[2/1] bg-gray-100 overflow-hidden rounded-t-xl flex-shrink-0 mx-auto">
                    <Image src={product.image_url || "/placeholder-product.png"} alt={product.name || "Produto"} width={300} height={300} className="object-cover w-full h-full" />
                  </div>
                  <div className="px-3 pb-4 pt-2 flex flex-col gap-1 flex-1 overflow-hidden items-start text-left w-full">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[2rem] break-words truncate w-full">{product.name || "Produto"}</h3>
                    <span className="text-base font-bold text-green-600 w-full">R$ {product.price?.toFixed(2)}</span>
                    <p className="text-xs text-gray-700 truncate w-full">{product.description || "Descrição breve do produto."}</p>
                    <span className="text-xs text-gray-500 truncate w-full">Categoria: {product.category || "exemplo"}</span>
                    <div className="mt-4 flex flex-col gap-2 w-full">
                      <button
                        className="bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition w-full"
                        onClick={async () => {
                          if (!user) {
                            showToast('error', 'Faça login para adicionar produtos ao carrinho!', { position: 'top-center', autoClose: 2500 });
                            return;
                          }
                          try {
                            await addToCart(user.id, product.id || product.uuid, 1);
                            showToast('success', 'Produto adicionado ao carrinho!', { position: 'top-right', autoClose: 2000 });
                          } catch (err: unknown) {
                            let msg = '';
                            if (err && typeof err === 'object' && 'message' in err) {
                              msg = (err as { message?: string }).message || '';
                            }
                            showToast('error', 'Erro ao adicionar ao carrinho: ' + msg);
                          }
                        }}
                      >
                        Adicionar ao carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Grid completo do catálogo */}
          <ProductGrid hideFilters />
        </div>
      </div>
    </div>
  );
}
