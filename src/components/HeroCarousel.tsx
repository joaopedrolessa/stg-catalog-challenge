
'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Coupon } from '../services/couponService';

export default function HeroCarousel() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  useEffect(() => {
    async function fetchCoupons() {
      const { data } = await supabase
        .from('coupons')
        .select('*')
        .eq('ativo', true);
      setCoupons((data as Coupon[]) || []);
    }
    fetchCoupons();
  }, []);

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (hover) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (coupons.length ? (i + 1) % coupons.length : 0));
    }, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hover, coupons.length]);

  const go = (dir: 1 | -1) => {
    setIndex((i) => {
      const next = i + dir;
      if (coupons.length === 0) return 0;
      if (next < 0) return coupons.length - 1;
      if (next >= coupons.length) return 0;
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
        style={{ transform: `translateX(-${index * 100}vw)`, width: `${(coupons.length || 1) * 100}vw` }}
      >
        {(coupons.length === 0 ? [null] : coupons).map((coupon, i) => (
          <div
            key={i}
            className="w-screen shrink-0 px-4 md:px-8 xl:px-14 py-8 sm:py-12 lg:py-14 bg-gray-100 min-h-[288px] sm:min-h-[360px] lg:min-h-[468px] flex justify-center items-center"
          >
            <div className="w-[80%] max-w-5xl bg-white/90 backdrop-blur shadow rounded-xl px-4 md:px-8 xl:px-14 py-16 sm:py-24 lg:py-32 text-center flex flex-col justify-center items-center min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                {coupon ? `CUPOM ${coupon.code}` : 'Nenhum cupom disponível'}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl mb-8">
                {coupon
                  ? `Use o cupom ${coupon.code} e ganhe ${coupon.type === 'compra' ? `${coupon.value}% OFF na compra` : `${coupon.value}% OFF no frete`}.`
                  : 'Nenhum cupom ativo no momento.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        aria-label="Slide anterior"
        onClick={() => go(-1)}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        disabled={coupons.length === 0}
      >
        ◀
      </button>
      <button
        aria-label="Próximo slide"
        onClick={() => go(1)}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
        disabled={coupons.length === 0}
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {coupons.map((_, i) => (
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
