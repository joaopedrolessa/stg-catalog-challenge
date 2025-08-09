'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

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
    <>
      <Navbar />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Catálogo de Produtos</h4>
                <p className="text-gray-600">Visualize todos os produtos cadastrados.</p>
                <Link href="/catalog" className="text-blue-600 hover:underline">Ver Catálogo</Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Dashboard</h4>
                <p className="text-gray-600">Área protegida para usuários autenticados.</p>
                <Link href="/dashboard" className="text-blue-600 hover:underline">Acessar Dashboard</Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Perfil do Usuário</h4>
                <p className="text-gray-600">Gerencie seus dados e visualize informações do perfil.</p>
                <Link href="/profile" className="text-blue-600 hover:underline">Ver Perfil</Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Autenticação Completa</h4>
                <p className="text-gray-600">Login, registro, recuperação e redefinição de senha.</p>
                <div className="flex flex-col gap-1">
                  <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                  <Link href="/register" className="text-blue-600 hover:underline">Registrar</Link>
                  <Link href="/recovery" className="text-blue-600 hover:underline">Recuperar Senha</Link>
                  <Link href="/reset-password" className="text-blue-600 hover:underline">Redefinir Senha</Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Proteção de Rotas</h4>
                <p className="text-gray-600">Componentes, HOC e middleware para proteger páginas.</p>
                <Link href="/dashboard" className="text-blue-600 hover:underline">Exemplo Protegido</Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Exemplo de Busca</h4>
                <p className="text-gray-600">Página de busca de produtos.</p>
                <Link href="/search" className="text-blue-600 hover:underline">Buscar Produtos</Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Página de Teste</h4>
                <p className="text-gray-600">Página para testes e demonstrações de recursos.</p>
                <Link href="/teste" className="text-blue-600 hover:underline">Acessar Teste</Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h4 className="font-semibold text-lg mb-2">Produto Detalhado</h4>
                <p className="text-gray-600">Veja detalhes de um produto pelo ID.</p>
                <Link href="/produto/1" className="text-blue-600 hover:underline">Exemplo Produto #1</Link>
              </div>
            </div>
            <div className="mt-10 text-center">
              <span className="text-gray-500 text-sm">Desenvolvido com Next.js, Supabase e TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
