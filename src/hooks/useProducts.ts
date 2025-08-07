import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Product } from '../types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔄 [RENDER] useProducts renderizou');

  useEffect(() => {
    console.log('🎯 [0] useEffect EXECUTOU!');
    
    const fetchProducts = async () => {
      console.log('🚀 [1] fetchProducts INICIOU');
      
      try {
        console.log('🔍 [2] Iniciando busca de produtos...');
        setLoading(true);
        setError(null);
        
        console.log('📡 [3] Fazendo query no Supabase...');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('📊 [4] Resposta do Supabase:', { data, error });

        if (error) {
          console.error('❌ [5] Erro do Supabase:', error);
          setError(error.message);
          return;
        }

        console.log('✅ [6] Produtos encontrados:', data?.length || 0);
        setProducts(data || []);
        
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar produtos';
        console.error('❌ [8] Erro no fetchProducts:', errorMessage);
        setError(errorMessage);
      } finally {
        console.log('🏁 [9] setLoading(false)');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log('📈 [STATE] Retornando estado:', { 
    productsCount: products.length, 
    loading, 
    hasError: !!error 
  });

  return {
    products,
    loading,
    error,
    refetch: () => {
      console.log('🔄 Refetch chamado');
      setLoading(true);
    }
  };
}