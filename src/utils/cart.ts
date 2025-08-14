/**
 * Funções utilitárias para operações de carrinho.
 * Atualmente expõe apenas addToCart que:
 * 1. Verifica se já existe um registro em cart_items para user + product.
 * 2. Se existir, incrementa a quantidade.
 * 3. Se não existir, cria novo registro.
 * Retorna um objeto indicando se foi update ou insert.
 */
import { supabase } from '../services/supabaseClient';

/**
 * Adiciona (ou incrementa) um item no carrinho do usuário.
 * @param userId id do usuário autenticado (auth.uid())
 * @param productId id/uuid do produto
 * @param quantity quantidade a adicionar (default 1)
 * @throws Propaga erros inesperados do Supabase.
 */
export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  // Verifica se o item já está no carrinho
  const { data: existing, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // Erro inesperado (PGRST116 = row not found - aceitável)
    throw fetchError;
  }

  if (existing) {
    // Atualiza a quantidade acumulando
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);

    if (updateError) throw updateError;
    return { updated: true } as const;
  } else {
    // Insere novo item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert([{ user_id: userId, product_id: productId, quantity }]);

    if (insertError) throw insertError;
    return { inserted: true } as const;
  }
}