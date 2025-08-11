
'use client';
import { toast } from 'react-toastify';


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { addToCart } from '@/utils/cart';

interface Product {
  id: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  quantity: number;
  name?: string;
}

export default function ProdutoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState<number | null>(null);
  const [freteError, setFreteError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      setProduct(prod as Product);
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar ao carrinho.');
      return;
    }
    setAdding(true);
    try {
      await addToCart(user.id, product!.id, 1);
      alert('Produto adicionado ao carrinho!');
    } catch (e) {
      alert('Erro ao adicionar ao carrinho.');
    } finally {
      setAdding(false);
    }
  };

  function calcularFrete(cep: string) {
    if (!/^[0-9]{8}$/.test(cep)) {
      setFreteError('Digite um CEP válido (apenas números, 8 dígitos)');
      setFrete(null);
      return;
    }
    setFreteError('');
    const prefixo = Number(cep.substring(0, 1));
    let valor = 29.9;
    if (prefixo === 1) valor = 49.9;
    if (prefixo === 8) valor = 19.9;
    setFrete(valor);
  }

  if (!product) return <div className="p-8">Carregando...</div>;

  return (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
  <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-4/5 h-4/5 overflow-hidden">
        {/* Imagem à esquerda */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
          <img
            src={product.image_url || 'https://via.placeholder.com/400x400?text=Produto'}
            alt={product.name || product.category}
            className="w-[28rem] h-[28rem] object-cover rounded-lg border shadow"
          />
        </div>
        {/* Informações à direita */}
  <div className="flex-1 flex flex-col justify-start items-start p-8 gap-6" style={{ transform: 'translateX(30%) translateY(20%)' }}>
          <div className="w-full text-left">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name || product.category}</h1>
            <div className="mb-4 text-green-700 font-bold text-2xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </div>
            <div className="mb-4 text-gray-700 text-base">{product.description}</div>
            <div className="mb-4 text-gray-500 text-sm">Categoria: {product.category}</div>
          </div>
          {/* Campo de frete */}
          <div className="mb-4">
            <label htmlFor="frete" className="block text-sm font-medium text-gray-700 mb-1">Calcule o frete</label>
            <div className="flex gap-2 items-end">
              <input
                id="frete"
                type="text"
                placeholder="Digite seu CEP"
                className="border rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-200"
                maxLength={8}
                value={cep}
                onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                type="button"
                onClick={() => calcularFrete(cep)}
              >
                Calcular
              </button>
              {freteError && <span className="text-red-600 text-sm ml-2">{freteError}</span>}
            </div>
            {frete !== null && !freteError && (
              <div className="text-green-700 font-semibold mt-2">Frete: R$ {frete.toFixed(2)}</div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 text-lg font-semibold w-full md:w-auto"
          >
            {adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
          </button>
        </div>
        </div>
      </div>
  );
}