'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setEmail('');
    } catch (error) {
      // Função auxiliar para extrair mensagem de erro
      const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        if (typeof error === 'string') return error;
        if (error && typeof error === 'object' && 'message' in error) {
          return String((error as { message: unknown }).message);
        }
        return 'Erro ao enviar email de recuperação';
      };
      
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden md:h-150">
        {/* Esquerda: Título */}
        <div className="flex flex-col justify-center items-center md:items-start flex-none md:flex-1 p-6 md:p-12 w-full md:w-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center md:text-left">Recuperação de Senha</h2>
          <p className="text-sm text-gray-600 text-center md:text-left">Informe seu e-mail. Você receberá um link para redefinir sua senha.</p>
        </div>
        {/* Direita: Card de recuperação */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
          <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center justify-center">
            <form className="flex flex-col items-center justify-center w-full" onSubmit={handleSubmit}>
              <label htmlFor="email" className="block mb-2 text-gray-700 font-semibold self-center">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 w-full"
                placeholder="Digite seu e-mail"
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded w-full mb-2 text-center">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded w-full mb-2 text-center">
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition mb-2 disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Enviar e-mail de recuperação'}
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