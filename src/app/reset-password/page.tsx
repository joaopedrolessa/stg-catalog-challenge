"use client";

import { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // ← ADICIONAR ESTA LINHA
import { useAuth } from '../../hooks/useAuth';

function ResetPasswordContent() {
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
    // Validação de senha forte (agora permite caracteres especiais)
    const senhaForte = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!senhaForte.test(password)) {
      const msg = 'A senha deve ter pelo menos 8 caracteres, incluindo letras e números.';
      setError(msg);
      toast.error('Senha inválida: ' + msg, { position: 'top-center', autoClose: 3000 });
      return;
    }
    if (password !== confirmPassword) {
      const msg = 'As senhas não coincidem. Por favor, digite novamente.';
      setError(msg);
      toast.error('Senhas diferentes: ' + msg, { position: 'top-center', autoClose: 3000 });
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success('Senha atualizada com sucesso!', { position: 'top-center', autoClose: 2000 });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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

  // Não bloqueia o formulário por erro de senha, só mostra feedback

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden md:h-150">
        {/* Esquerda: Título */}
        <div className="flex flex-col justify-center items-center md:items-start flex-none md:flex-1 p-6 md:p-12 w-full md:w-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center md:text-left">Nova Senha</h2>
          <p className="text-sm text-gray-600 text-center md:text-left">
            Digite sua nova senha abaixo para redefinir o acesso à sua conta.<br />
            <span className="font-semibold text-blue-700">A senha deve ter pelo menos 8 caracteres, incluindo letras e números.</span>
          </p>
        </div>
        {/* Direita: Formulário de redefinição */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
          <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center justify-center">
            <form className="flex flex-col items-center justify-center w-full" onSubmit={handleSubmit}>
              <label className="block mb-2 text-gray-700 font-semibold self-center">Nova senha</label>
              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 w-full"
              />
              <label className="block mb-2 text-gray-700 font-semibold self-center">Confirmar senha</label>
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 w-full"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition mb-2 disabled:opacity-60"
              >
                {loading ? 'Atualizando...' : 'Atualizar Senha'}
              </button>
            </form>
            <div className="text-center mt-2">
              <Link href="/login" className="text-blue-600 font-semibold hover:underline" style={{ color: '#2563eb' }}>
                Voltar para Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando…</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}