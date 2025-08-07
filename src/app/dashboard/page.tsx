'use client';

import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Olá, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bem-vindo ao Dashboard!
                </h2>
                <p className="text-gray-600">
                  Esta é uma página protegida que só pode ser acessada por usuários autenticados.
                </p>
                <p className="text-gray-600 mt-2">
                  Usuário: <strong>{user?.email}</strong>
                </p>
                <p className="text-gray-600 mt-2">
                  ID: <strong>{user?.id}</strong>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
