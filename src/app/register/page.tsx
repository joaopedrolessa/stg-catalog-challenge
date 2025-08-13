'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.');
    }
    
    setIsLoading(false);
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
        <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden md:h-150 md:translate-x-[10vw]">
          {/* Esquerda: Título */}
          <div className="flex flex-col justify-center items-center md:items-start flex-none md:flex-1 p-6 md:p-12 w-full md:w-auto md:translate-x-[5vw]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center md:text-left">Crie sua conta para acessar o site</h2>
          </div>
          {/* Direita: Card de registro */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full">
            <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center justify-center">
              <form className="flex flex-col items-center justify-center w-full" onSubmit={handleSubmit}>
                <label className="block mb-2 text-gray-700 font-semibold self-center">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 px-4 py-5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                  style={{ width: '100%' }}
                  placeholder="E-mail"
                  autoFocus
                />
                <label className="block mb-2 text-gray-700 font-semibold self-center">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                  style={{ width: '100%' }}
                  placeholder="Senha"
                />
                <label className="block mb-2 text-gray-700 font-semibold self-center">Confirmar senha</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
                  style={{ width: '100%' }}
                  placeholder="Confirmar senha"
                />
                {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition mb-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </form>
              <div className="text-center my-2">
                <a
                  href="/login"
                  className=" font-semibold hover:underline !opacity-100 text-gray-700"
                  style={{ opacity: 1, color: '#2563eb' }}
                >
                  Já tem uma conta? Faça login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
