/**
 * Hook responsável por buscar a lista de produtos do Supabase.
 * Retorna: products, loading, error e função refetch (placeholder para extensão futura).
 */
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          setError(error.message);
          return;
        }
        setProducts(data || []);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Erro ao carregar produtos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    // Refetch simples (pode ser implementado com chave de efeito / SWR futuramente)
    refetch: () => setLoading(true)
  };
}