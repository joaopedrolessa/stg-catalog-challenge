import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ exists: false, error: 'Email não informado' }, { status: 400 });
  }
  // Consulta na tabela de usuários do Supabase
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ exists: !!data });
}
