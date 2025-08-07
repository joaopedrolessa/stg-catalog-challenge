'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // ← ADICIONAR ESTA LINHA
import { useAuth } from '../../hooks/useAuth';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, updatePassword } = useAuth(); // user será válido se token OK
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verificar se há erro na URL (token inválido)
    const urlError = searchParams.get('error');
    if (urlError) {
      setError('Link inválido ou expirado. Solicite um novo link de recuperação.');
    }
  }, [searchParams]);

  // Se não há usuário válido após alguns segundos, token é inválido
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && !error) {
        setError('Sessão de recuperação inválida ou expirada.');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Sessão de recuperação inválida.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      alert('Senha atualizada com sucesso!');
      router.push('/dashboard');
    } catch (error: unknown) {
      // Função auxiliar para extrair mensagem de erro
      const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        if (typeof error === 'string') return error;
        if (error && typeof error === 'object' && 'message' in error) {
          return String((error as { message: unknown }).message);
        }
        return 'Erro ao atualizar senha';
      };
      
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/recovery" className="text-indigo-600 hover:text-indigo-500">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
        <h2 className="text-2xl font-bold text-center">Nova Senha</h2>
        
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar Senha'}
        </button>
      </form>
    </div>
  );
}