import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  // Rotas que não devem ser acessadas se já estiver logado
  const authRoutes = ['/login', '/register'];

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Verificar se há token de sessão nos cookies
  const token = req.cookies.get('supabase-auth-token')?.value;

  // Se está tentando acessar uma rota protegida sem token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se está tentando acessar rotas de auth com token válido
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};
