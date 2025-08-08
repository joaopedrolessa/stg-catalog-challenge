'use client';

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

interface Rating {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

interface Comment {
  id: string;
  product_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

export default function ProdutoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  // Carregar dados do produto, avaliações e comentários
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      setProduct(prod as Product);

      const { data: rat } = await supabase.from('ratings').select('*').eq('product_id', id);
      setRatings((rat as Rating[]) || []);

      const { data: com } = await supabase.from('comments').select('*').eq('product_id', id).order('created_at', { ascending: false });
      setComments((com as Comment[]) || []);
    })();
  }, [id]);

  // Enviar avaliação
  const handleRating = async () => {
    if (newRating < 1 || newRating > 5) return;
    await supabase.from('ratings').insert({ product_id: id, rating: newRating });
    setNewRating(0);
    // Recarregar avaliações
    const { data: rat } = await supabase.from('ratings').select('*').eq('product_id', id);
    setRatings((rat as Rating[]) || []);
  };

  // Enviar comentário
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await supabase.from('comments').insert({ product_id: id, comment: newComment });
    setNewComment('');
    // Recarregar comentários
    const { data: com } = await supabase.from('comments').select('*').eq('product_id', id).order('created_at', { ascending: false });
    setComments((com as Comment[]) || []);
  };

  // Calcular média das avaliações
  const avgRating = ratings.length
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : 'Sem avaliações';


  // Adicionar ao carrinho
  const [adding, setAdding] = useState(false);
  const handleAddToCart = async () => {
    if (!user) {
      alert('Você precisa estar logado para adicionar ao carrinho.');
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

  if (!product) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <img
        src={product.image_url || 'https://via.placeholder.com/300x200?text=Produto'}
        alt={product.name || product.category}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{product.name || product.category}</h1>
      <div className="mb-2 text-green-700 font-semibold">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
      </div>

      <div className="mb-4 text-gray-600">Categoria: {product.category}</div>

      {/* Botão Adicionar ao Carrinho */}
      <div className="mb-6">
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {adding ? 'Adicionando...' : 'Adicionar ao carrinho'}
        </button>
      </div>

      {/* Avaliação */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Avaliação:</span>
          <span>
            {typeof avgRating === 'string'
              ? avgRating
              : '⭐'.repeat(Math.round(Number(avgRating)))}
          </span>
          <span className="text-sm text-gray-500">
            ({ratings.length} avaliação{ratings.length !== 1 && 's'})
          </span>
        </div>
        {user ? (
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={star <= newRating ? 'text-yellow-400' : 'text-gray-300'}
                onClick={() => setNewRating(star)}
              >
                ★
              </button>
            ))}
            <button
              onClick={handleRating}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
              disabled={newRating === 0}
            >
              Avaliar
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-500 mt-2">
            Faça login para avaliar este produto.
          </div>
        )}
      </div>

      {/* Comentários */}
      <div className="mb-4">
        {user ? (
          <form onSubmit={handleComment} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Deixe um comentário"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Comentar
            </button>
          </form>
        ) : (
          <div className="text-xs text-gray-500 mb-2">Faça login para comentar neste produto.</div>
        )}
        <div>
          {comments.map(c => (
            <div key={c.id} className="border-b py-2 text-sm">
              {c.comment}
              <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString('pt-BR')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}