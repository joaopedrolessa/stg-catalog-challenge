'use client';

import { useRouter } from 'next/navigation';
import ProductGrid from '../../components/ProductGrid';
import { Product } from '../../types/product';

export default function CatalogPage() {
  const router = useRouter();
  const handleProductClick = (product: Product) => {
    router.push(`/produto/${product.id || product.uuid}`);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#171A1F]">Catálogo</h1>
      </div>

  <ProductGrid onProductClick={handleProductClick} />
    </div>
  );
}