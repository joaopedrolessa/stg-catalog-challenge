/**
 * Supabase Client
 * Inicializa o cliente do Supabase usando as variáveis públicas.
 * Este cliente é usado em hooks e services para consultar autenticação e tabelas.
 * IMPORTANTE: somente a anon key deve ser usada no cliente do navegador.
 */
import { createClient } from '@supabase/supabase-js';

// URL do projeto Supabase (definida no .env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Se faltar, falha no startup
// Chave pública anon (não usar service role aqui!)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Cliente compartilhado do Supabase */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
