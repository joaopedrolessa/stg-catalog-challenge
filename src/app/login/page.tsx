"use client";

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
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

    // Login OK -> tenta voltar para a rota anterior; se não houver, vai para a home
    const canGoBack = typeof window !== 'undefined' && window.history.length > 1;
    if (canGoBack) {
      router.back();
    } else {
      router.push('/');
    }
    setIsLoading(false);
  };

  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden h-150"
        >
          {/* Esquerda: Título */}
          <div className="hidden md:flex flex-col justify-center items-start flex-1 p-12 bg-white">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Digite seu e-mail<br />para iniciar sessão</h2>
          </div>
          {/* Direita: Card de login */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md flex flex-col items-center justify-center">
              <form className="bg-white flex flex-col items-center justify-center w-full" onSubmit={handleSubmit}>
                <label className="block mb-2 text-gray-700 font-semibold self-center">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 px-4 py-5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <div className="text-center my-2">
                <a
                  href="/register"
                  className=" font-semibold hover:underline !opacity-100 text-gray-700"
                  style={{ opacity: 1, color: '#2563eb' }}
                >
                  Criar conta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
