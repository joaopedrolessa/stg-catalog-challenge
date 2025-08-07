'use client';

import { useAuth } from '../../hooks/useAuth';
import { withAuth } from '../../components/withAuth';

function ProfilePageComponent() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Perfil do Usuário</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID do Usuário
                </label>
                <p className="mt-1 text-lg text-gray-900">{user?.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Criação
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exporta o componente protegido usando o HOC
export default withAuth(ProfilePageComponent, { requireAuth: true, redirectTo: '/login' });
