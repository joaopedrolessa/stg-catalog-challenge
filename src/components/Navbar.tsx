"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");
  return (
    <nav className="w-full h-16 bg-[#42789C] rounded-none shadow" style={{boxShadow: "0px 0px 1px #171a1fDD, 0px 0px 2px #171a1f14"}}>
      <div className="w-full flex items-center h-16 gap-4 px-4 md:px-8 xl:px-16">
        {/* ...existing code... (Logo, Menus, Busca, etc) */}

        <div className="flex-1 flex items-center">
          {/* ...existing code... (pode incluir barra de busca ou menus centrais) */}
        </div>

        {/* Botões Carrinho e Minha Conta idênticos ao design */}
        <div className="flex items-center gap-4 pl-4">
          <Link href="/cart" className="flex items-center gap-2 text-white font-bold text-base md:text-lg px-3 md:px-4 py-2 bg-transparent hover:bg-white/10 focus:bg-white/10 rounded-full transition-all" tabIndex={0}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="-ml-1">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="21" r="1"/>
              <circle cx="17" cy="21" r="1"/>
            </svg>
            Carrinho
          </Link>
          <button
            className="flex items-center justify-center min-w-[8rem] md:min-w-[9rem] h-10 px-3 md:px-4 gap-2 font-['Roboto',sans-serif] text-sm md:text-base leading-[1.375] font-medium text-[#171A1F] bg-white rounded-md hover:bg-[#DEE1E6] active:bg-[#BDC1CA] disabled:opacity-40 transition-colors"
            tabIndex={0}
          >
            <svg width="1.375rem" height="1.375rem" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="inline-block align-middle">
              <circle cx="12" cy="7" r="4"/>
              <path d="M5.5 21a7.5 7.5 0 0113 0"/>
            </svg>
            <span className="inline-block align-middle">Minha Conta</span>
          </button>
        </div>

        {/* ...existing code... (Logo, Menus, Busca, etc) */}
      </div>
    </nav>
  );
}