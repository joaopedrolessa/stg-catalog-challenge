'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/services/supabaseClient';

interface Product {
  id: string;
  price: number;
  image_url: string;
  category: string;
  quantity: number;
  created_at: string;
  name?: string; // caso tenha campo nome
}

export default function PesquisaPage() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Pesquisa por nome ou categoria (ajuste conforme seu schema)
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(
        `category.ilike.%${search}%,name.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4 text-center">🔎 Pesquisa de Produtos</h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Pesquisar por nome ou categoria"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Pesquisar'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center text-gray-500">Nenhum produto encontrado.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => (
            <Link key={product.id} href={`/produto/${product.id}`}>
              <div className="bg-white rounded shadow p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition">
                <img
                  src={product.image_url && product.image_url.trim() !== '' ? product.image_url : 'https://via.placeholder.com/300x200?text=Produto'}
                  alt={product.name || product.category || 'Produto'}
                  className="h-40 object-cover rounded"
                />
                <div className="font-bold">{product.name || `Produto ${product.category}`}</div>
                <div className="text-sm text-gray-600">Categoria: {product.category}</div>
                <div className="text-green-700 font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </div>
                <div className="text-xs text-gray-400">
                  Criado em: {new Date(product.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}