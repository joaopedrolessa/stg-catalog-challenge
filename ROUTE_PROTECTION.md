# Sistema de Proteção de Rotas

Este projeto implementa um sistema completo de proteção de rotas usando Next.js 15, Supabase e TypeScript.

## Arquivos Criados

### 1. Componente de Proteção (`src/components/ProtectedRoute.tsx`)
Componente que envolve páginas para controlar acesso baseado no status de autenticação.

**Uso:**
```tsx
<ProtectedRoute requireAuth={true} redirectTo="/login">
  {/* Conteúdo protegido */}
</ProtectedRoute>
```

### 2. Hook de Autenticação (`src/hooks/useAuth.ts`)
Hook customizado que gerencia o estado de autenticação.

**Funcionalidades:**
- `user`: usuário atual ou null
- `loading`: estado de carregamento
- `signIn(email, password)`: fazer login
- `signUp(email, password)`: criar conta
- `signOut()`: fazer logout

### 3. HOC (Higher Order Component) (`src/components/withAuth.tsx`)
Alternativa ao ProtectedRoute para proteger componentes.

**Uso:**
```tsx
export default withAuth(MeuComponente, { 
  requireAuth: true, 
  redirectTo: '/login' 
});
```

### 4. Middleware (`middleware.ts`)
Proteção a nível de servidor que redireciona usuários antes da página carregar.

### 5. Contexto de Autenticação (`src/contexts/AuthContext.tsx`)
Contexto React para compartilhar estado de autenticação globalmente.

## Páginas de Exemplo

### Login (`/login`)
- Página de login com validação
- Redireciona usuários logados para `/dashboard`

### Register (`/register`)
- Página de registro com confirmação de senha
- Redireciona usuários logados para `/dashboard`

### Dashboard (`/dashboard`)
- Página protegida que requer autenticação
- Mostra informações do usuário logado

### Profile (`/profile`)
- Exemplo usando HOC `withAuth`
- Página de perfil do usuário

## Como Usar

### 1. Proteger uma página com componente:
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function MinhaPageProtegida() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  );
}
```

### 2. Proteger uma página com HOC:
```tsx
import { withAuth } from '../components/withAuth';

function MinhaPage() {
  return <div>Conteúdo protegido</div>;
}

export default withAuth(MinhaPage, { requireAuth: true });
```

### 3. Usar o hook de autenticação:
```tsx
import { useAuth } from '../hooks/useAuth';

function MeuComponente() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          Olá, {user.email}!
          <button onClick={signOut}>Sair</button>
        </div>
      ) : (
        <div>Usuário não logado</div>
      )}
    </div>
  );
}
```

## Configuração do Middleware

O middleware protege rotas automaticamente:

### Rotas Protegidas (requerem login):
- `/dashboard/*`
- `/profile/*`
- `/admin/*`

### Rotas de Autenticação (redirecionam se já logado):
- `/login`
- `/register`

## Configuração do Supabase

Certifique-se de ter as variáveis de ambiente configuradas:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## Vantagens da Implementação

1. **Flexibilidade**: Múltiplas formas de proteger rotas
2. **Performance**: Middleware protege no servidor
3. **UX**: Loading states e redirecionamentos suaves
4. **Type Safety**: Totalmente tipado com TypeScript
5. **Manutenibilidade**: Código organizado e reutilizável

## Exemplos de Uso Avançado

### Proteção baseada em roles:
```tsx
<ProtectedRoute 
  requireAuth={true}
  requireRole="admin"
  redirectTo="/unauthorized"
>
  {/* Conteúdo apenas para admins */}
</ProtectedRoute>
```

### Proteção condicional:
```tsx
const { user } = useAuth();
const isOwner = user?.id === itemOwnerId;

return (
  <ProtectedRoute requireAuth={isOwner}>
    {/* Conteúdo apenas para o dono */}
  </ProtectedRoute>
);
```
