/**
 * Hook de autenticação que encapsula integração com Supabase Auth.
 * Fornece usuário atual, estado de carregamento e helpers de login/logout/signup/reset/update password.
 */
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

/** Retorna estado e ações de autenticação */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtém sessão inicial (SSR friendly se for adaptado)
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Escuta mudanças de auth (login/logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /** Login com email+senha */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  /** Cadastro de novo usuário */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  };

  /** Logout */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  /** Envia email de recuperação de senha */
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { success: true } as const;
    } catch (error: unknown) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw error;
    }
  };

  /** Atualiza senha do usuário logado (após token de recuperação) */
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true } as const;
    } catch (error: unknown) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  };

  return { user, loading, signIn, signUp, signOut, resetPassword, updatePassword };
}
