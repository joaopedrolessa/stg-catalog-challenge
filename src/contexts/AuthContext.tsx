'use client';

/**
 * Contexto de autenticação que expõe o retorno do hook useAuth
 * para toda a árvore de componentes dentro do provider.
 */
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

// Cria o contexto tipado. undefined indica que o provider não está presente.
const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

/**
 * Provider que inicializa o hook de autenticação e injeta no contexto.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook de conveniência para consumir o contexto com verificação de uso correto.
 * Lança erro se usado fora do <AuthProvider>.
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
