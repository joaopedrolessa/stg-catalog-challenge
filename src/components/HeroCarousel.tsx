'use client';
/**
 * Carousel simples para exibir cupons pré-definidos.
 * Faz autoplay trocando o índice a cada 4.5s (pausa no hover) e permite navegar manualmente.
 */
import { useEffect, useRef, useState } from 'react';

// Lista estática de cupons (não consulta servidor)
const predefinedCoupons = [
  { code: 'DESCONTO10', description: '10% OFF em todas as compras!' },
  { code: 'FRETEGRATIS', description: 'Frete grátis em todas as compras!' },
  { code: 'PROMO20', description: '20% OFF em qualquer produto!' },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);           // slide atual
  const [hover, setHover] = useState(false);       // pausa autoplay quando true
  const timerRef = useRef<NodeJS.Timeout | null>(null); // referência do intervalo

  // Autoplay
  useEffect(() => {
    if (hover) return; // pausa se o usuário está sobre o componente
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(i => (predefinedCoupons.length ? (i + 1) % predefinedCoupons.length : 0));
    }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [hover]);

  // Navegação manual
  const go = (dir: 1 | -1) => {
    setIndex(i => {
      const next = i + dir;
      if (!predefinedCoupons.length) return 0;
      if (next < 0) return predefinedCoupons.length - 1;
      if (next >= predefinedCoupons.length) return 0;
      return next;
    });
  };

  return (
    <div
      className="relative min-w-0 w-full max-w-none overflow-hidden bg-gray-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Faixa de slides */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}vw)`, width: `${(predefinedCoupons.length || 1) * 100}vw` }}
      >
        {(predefinedCoupons.length === 0 ? [null] : predefinedCoupons).map((coupon, i) => (
          <div
            key={i}
            className="w-screen shrink-0 px-4 md:px-8 xl:px-14 py-8 sm:py-12 lg:py-14 bg-gray-100 min-h-[288px] sm:min-h-[360px] lg:min-h-[468px] flex justify-center items-center"
          >
            <div className="w-[80%] max-w-5xl bg-white/90 backdrop-blur shadow rounded-xl px-4 md:px-8 xl:px-14 py-16 sm:py-24 lg:py-32 text-center flex flex-col justify-center items-center min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                {coupon ? `CUPOM ${coupon.code}` : 'CUPOM INDISPONÍVEL'}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-8">
                {coupon ? coupon.description : 'Sem descrição disponível'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controles / botões de navegação */}
      <button
        aria-label="Slide anterior"
        onClick={() => go(-1)}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        disabled={predefinedCoupons.length === 0}
      >
        ◀
      </button>
      <button
        aria-label="Próximo slide"
        onClick={() => go(1)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        disabled={predefinedCoupons.length === 0}
      >
        ▶
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {predefinedCoupons.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-gray-800' : 'bg-gray-400/70'} transition-colors`}
          />)
        )}
      </div>
    </div>
  );
}
