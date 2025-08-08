import { supabase } from '../services/supabaseClient';

export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  // Verifica se o item já está no carrinho
  const { data: existing, error: fetchError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // Erro inesperado
    throw fetchError;
  }

  if (existing) {
    // Atualiza a quantidade
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);

    if (updateError) throw updateError;
    return { updated: true };
  } else {
    // Insere novo item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert([{ user_id: userId, product_id: productId, quantity }]);

    if (insertError) throw insertError;
    return { inserted: true };
  }
}