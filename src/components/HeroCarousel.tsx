'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Slide = {
  title: string;
  description: string;
  cta: { label: string; href: string };
};

export default function HeroCarousel() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: 'DIVERSÃO GARANTIDA',
        description:
          'Válido até 31/08/2025. Use o cupom DIVERSAO40 e ganhe até 40% OFF e FRETE GRÁTIS!',
        cta: { label: 'Ver Ofertas', href: '/catalog?tag=diversao' },
      },
      {
        title: 'ELETRÔNICOS EM CONTA',
        description:
          'Só hoje! Cupom ELETRON20: 20% OFF em eletrônicos selecionados. Corra e aproveite.',
        cta: { label: 'Comprar Agora', href: '/catalog?category=eletronicos' },
      },
      {
        title: 'CASA & JARDIM EM DOBRO',
        description:
          'Fim de semana de ofertas! Use CASA15FRETE e leve 15% OFF + frete grátis acima de R$ 199.',
        cta: { label: 'Ver Coleção', href: '/catalog?category=casa' },
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hover) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hover, slides.length]);

  const go = (dir: 1 | -1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  };

  return (
    <div
      className="relative min-w-0 w-full max-w-none overflow-hidden bg-gray-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}vw)`, width: `${slides.length * 100}vw` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="w-screen shrink-0 px-4 md:px-8 xl:px-14 py-8 sm:py-12 lg:py-14 bg-gray-100 min-h-[288px] sm:min-h-[360px] lg:min-h-[468px] flex justify-center items-center"
          >
            <div className="w-[80%] max-w-5xl bg-white/90 backdrop-blur shadow rounded-xl px-4 md:px-8 xl:px-14 py-16 sm:py-24 lg:py-32 text-center flex flex-col justify-center items-center min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                {s.title}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-8">
                {s.description}
              </p>
              <a
                href={s.cta.href}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 text-white px-6 sm:px-7 lg:px-8 py-3 text-sm sm:text-base font-semibold hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {s.cta.label}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        aria-label="Slide anterior"
        onClick={() => go(-1)}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
      >
        ◀
      </button>
      <button
        aria-label="Próximo slide"
        onClick={() => go(1)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
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
