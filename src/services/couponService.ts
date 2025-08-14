import { supabase } from './supabaseClient';

export type CouponType = 'compra' | 'frete';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  ativo: boolean;
}

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
