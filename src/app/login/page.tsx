"use client";

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
// import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

  // Login OK -> sempre vai para a página inicial
  router.push('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div
        className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden md:h-150 md:translate-x-[10vw]"
      >
        {/* Esquerda: Título */}
        <div className="flex flex-col justify-center items-center md:items-start flex-none md:flex-1 p-6 md:p-12 w-full md:w-auto md:translate-x-[10vw]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center md:text-left">Digite seu e-mail<br />para iniciar sessão</h2>
        </div>
        {/* Direita: Card de login */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full z-20 relative">
          <div className="w-full max-w-xs sm:max-w-md flex flex-col items-center justify-center z-30 relative">
            <form className="flex flex-col items-center justify-center w-full" onSubmit={handleSubmit}>
              <label htmlFor="email" className="block mb-2 text-gray-700 font-semibold self-center">E-mail</label>
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
              <label htmlFor="password" className="block mb-2 text-gray-700 font-semibold self-center">Senha</label>
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
              {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition mb-2"
                disabled={isLoading}
              >
                {isLoading ? "Continuando..." : "Continuar"}
              </button>
            </form>
            <div className="text-center my-2 flex flex-row gap-4 w-full justify-center text-blue-600">
              <a
                href="/register"
                className="font-semibold hover:underline text-blue-600"
                style={{ opacity: 1 }}
              >
                Criar conta
              </a>
              <span>|</span>
              <a
                href="/recovery"
                className="font-semibold hover:underline text-blue-600"
                style={{ opacity: 1 }}
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
