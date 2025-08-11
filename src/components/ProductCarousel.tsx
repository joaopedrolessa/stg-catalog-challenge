'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';

type AutoplayOptions = {
  intervalMs?: number;
};

export default function ProductCarousel({ intervalMs = 3500 }: AutoplayOptions) {
  const { products, loading, error } = useProducts();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const visibleProducts: Product[] = useMemo(() => {
    // Show latest up to 12 to keep it light
    return (products || []).slice(0, 12);
  }, [products]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (loading || !visibleProducts.length) return;

    const el = containerRef.current;
    let timer: NodeJS.Timeout | null = null;

    const getStep = () => {
      const firstSlide = el.querySelector<HTMLElement>('[data-slide]');
      return firstSlide ? firstSlide.getBoundingClientRect().width : el.clientWidth;
    };

    const start = () => {
      stop();
      timer = setInterval(() => {
        if (!el) return;
        const step = getStep();
        const maxScrollLeft = el.scrollWidth - el.clientWidth - 2; // small buffer
        if (el.scrollLeft + step >= maxScrollLeft) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollTo({ left: el.scrollLeft + step, behavior: 'smooth' });
        }
      }, intervalMs);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    if (!isHovering) start();
    return () => stop();
  }, [loading, visibleProducts.length, isHovering, intervalMs]);

  const scrollByStep = (dir: 1 | -1) => {
    const el = containerRef.current;
    if (!el) return;
    const firstSlide = el.querySelector<HTMLElement>('[data-slide]');
    const step = firstSlide ? firstSlide.getBoundingClientRect().width : el.clientWidth;
    el.scrollTo({ left: el.scrollLeft + dir * step, behavior: 'smooth' });
  };

  return (
    <section className="relative">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Destaques</h2>
          <p className="text-gray-500 text-sm">Produtos mais recentes do catálogo</p>
        </div>
        {!loading && !!visibleProducts.length && (
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollByStep(-1)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              ◀
            </button>
            <button
              onClick={() => scrollByStep(1)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%] bg-white rounded-lg shadow animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && error && (
          <div className="text-red-600">Erro ao carregar produtos: {error}</div>
        )}

        {!loading && !error && visibleProducts.length === 0 && (
          <div className="text-gray-600">Nenhum produto encontrado.</div>
        )}

        {!loading && !error &&
          visibleProducts.map((p) => (
            <article
              key={p.uuid}
              data-slide
              className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%] bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden rounded-t-lg">
                <Image
                  src={p.image_url || '/placeholder-product.png'}
                  alt={`Produto ${p.category}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 32vw"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{p.category}</span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {p.category} — #{p.uuid?.slice(-6)}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${p.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.quantity > 0 ? 'Disponível' : 'Esgotado'}
                  </span>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
