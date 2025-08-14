/**
 * Service de cupons: tipagens e função de validação de código ativo.
 */
import { supabase } from './supabaseClient';

export type CouponType = 'compra' | 'frete'; // compra = desconto sobre valor, frete = sobre frete

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  ativo: boolean;
}

/**
 * Valida um cupom buscando por código e status ativo.
 * Retorna a linha ou null se inexistente/desativado.
 */
export async function validateCoupon(code: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('ativo', true)
    .single();

  if (error || !data) return null;
  return data as Coupon;
}
