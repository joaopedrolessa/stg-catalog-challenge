"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    const canGoBack = typeof window !== "undefined" && window.history.length > 1;
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      if (!menuOpen) return;
      const target = e.target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, [menuOpen]);

  return (
    <nav
      className="w-full h-16 bg-[#42789C] shadow"
      style={{
        boxShadow: "0px 0px 1px #171a1fDD, 0px 0px 2px #171a1f14",
      }}
    >
  <div className="w-full flex flex-row items-center justify-between h-16 gap-2 sm:gap-3 md:gap-4 px-4 md:px-8 xl:px-14 min-h-0">
        {/* Marca/Site Name (esquerda) */}
        <Link
          href="/"
          aria-label="Ir para a página inicial"
          className="flex items-center h-12 min-h-0 flex-shrink-0 text-white font-bold tracking-tight text-lg md:text-xl whitespace-nowrap hover:opacity-90 transition-opacity"
          style={{ lineHeight: '1.2' }}
        >
          STG Catalog
        </Link>

  <div className="flex-1 flex items-center justify-center min-h-0 h-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchTerm.trim();
              if (!q) return;
              router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
  className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-3 sm:mx-6 min-h-0"
          >
            <div className="flex items-center h-10 w-full rounded-full border border-white/60 bg-transparent focus-within:border-white focus-within:ring-2 focus-within:ring-white/70 transition px-3 min-h-0">
              <span className="pl-8 md:pl-10 pr-3 text-white/80 flex items-center pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-3.5-3.5" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="busca produto"
                className="flex-1 h-full leading-[2.5rem] bg-transparent text-white placeholder-white/70 px-4 outline-none border-0"
              />
            </div>
          </form>
        </div>

        {/* Botões Carrinho e Conta */}
  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 pl-2 sm:pl-4 h-12 min-h-0 flex-shrink-0">
          <Link
            href="/catalog"
      aria-label="Abrir catálogo"
      className="flex items-center gap-2 text-white font-bold text-sm sm:text-base md:text-lg px-2 sm:px-3 md:px-4 py-2 bg-transparent hover:bg-white/10 focus:bg-white/10 rounded-full transition-all"
            tabIndex={0}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              className="-ml-1"
            >
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
      <span className="hidden sm:inline">Produto</span>
          </Link>
          <Link
            href="/cart"
      aria-label="Ir para o carrinho"
      className="flex items-center gap-2 text-white font-bold text-sm sm:text-base md:text-lg px-2 sm:px-3 md:px-4 py-2 bg-transparent hover:bg-white/10 focus:bg-white/10 rounded-full transition-all"
            tabIndex={0}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              className="-ml-1"
            >
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="21" r="1" />
              <circle cx="17" cy="21" r="1" />
            </svg>
            <span className="hidden sm:inline">Carrinho</span>
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              aria-label="Abrir menu de compras"
              className="flex items-center justify-center h-10 w-10 sm:w-auto px-0 sm:px-3 md:px-4 gap-0 sm:gap-2 font-['Roboto',sans-serif] text-sm md:text-base leading-[1.375] font-medium text-[#171A1F] bg-white rounded-md hover:bg-[#DEE1E6] active:bg-[#BDC1CA] disabled:opacity-40 transition-colors sm:min-w-[9rem]"
              tabIndex={0}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                width="1.25rem"
                height="1.25rem"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                className="inline-block align-middle"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a7.5 7.5 0 0113 0" />
              </svg>
              <span className="hidden sm:inline align-middle">Minhas Compras</span>
              <svg className="hidden sm:inline ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-3 min-w-[11rem] bg-white rounded-xl shadow-xl border border-gray-200 py-2 px-1 z-50 transition-all duration-200 animate-fade-in flex flex-col gap-1 text-black">
                {user ? (
                  <>
                    <Link
                      href="/historico"
                      className="block px-4 py-2 rounded-lg !text-black hover:bg-blue-50 hover:!text-blue-700 transition-colors font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      Minhas Compras
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 rounded-lg !text-black hover:bg-red-50 hover:!text-red-700 transition-colors font-medium"
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 rounded-lg !text-black hover:bg-blue-50 hover:!text-blue-700 transition-colors font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ...existing code... (Logo, Menus, Busca, etc) */}
      </div>
    </nav>
  );
}
