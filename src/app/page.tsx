'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            STG Catalog Challenge
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Sistema de catálogo com proteção de rotas usando Next.js e Supabase
          </p>

          {user ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Bem-vindo, {user.email}!
                </h2>
                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Ir para Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Faça login para acessar
                </h2>
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Fazer Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Criar Conta
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Recursos Implementados
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-lg mb-2">Proteção de Rotas</h4>
                <p className="text-gray-600">
                  Componentes e HOCs para proteger páginas baseado na autenticação
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-lg mb-2">Middleware</h4>
                <p className="text-gray-600">
                  Proteção a nível de servidor para melhor performance
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-lg mb-2">Supabase Auth</h4>
                <p className="text-gray-600">
                  Integração completa com autenticação do Supabase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
