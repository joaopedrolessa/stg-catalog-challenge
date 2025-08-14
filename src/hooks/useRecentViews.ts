/**
 * Hook placeholder para futura implementação de "produtos vistos recentemente".
 * No momento retorna array vazio e função addView que apenas faz log.
 * Pode ser depois conectado a localStorage ou tabela recent_views no backend.
 */
import { useCallback, useState } from 'react';

export interface RecentView {
  productId: string;
  viewedAt: number; // timestamp
}

export function useRecentViews() {
  const [views, setViews] = useState<RecentView[]>([]);

  const addView = useCallback((productId: string) => {
    setViews((prev) => {
      const filtered = prev.filter(v => v.productId !== productId);
      const next: RecentView[] = [{ productId, viewedAt: Date.now() }, ...filtered].slice(0, 20);
      return next;
    });
  }, []);

  return { views, addView };
}
