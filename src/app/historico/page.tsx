"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

interface ProductInOrder {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface Pedido {
  id: string;
  user_id: string;
  items: ProductInOrder[];
  total: number;
  frete?: number;
  created_at: string;
}

export default function HistoricoPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPedidos([]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setPedidos(data || []);
      setLoading(false);
    }
    fetchPedidos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-6 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-900 text-center">Histórico de Compras</h1>
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : pedidos.length === 0 ? (
          <p className="text-center">Você ainda não fez nenhum pedido.</p>
        ) : (
          <ul className="space-y-4 sm:space-y-6">
            {pedidos.map((pedido) => (
              <li key={pedido.id} className="border rounded-xl p-3 sm:p-6 bg-white shadow flex flex-col items-center w-full">
                <div className="font-semibold text-gray-900 text-base sm:text-lg mb-1 text-center break-all">Pedido #{pedido.id}</div>
                <div className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 text-center">{new Date(pedido.created_at).toLocaleString()}</div>
                <div className="mb-2 w-full">
                  <span className="font-medium text-gray-900">Produtos:</span>
                  <ul className="flex flex-col items-center w-full">
                    {pedido.items && pedido.items.map((prod, idx) => (
                      <li key={idx} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 w-full justify-center">
                        {prod.image_url && (
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded border mb-1 sm:mb-0"
                          />
                        )}
                        <span className="font-semibold text-gray-900 text-center sm:text-left">{prod.name}</span>
                        <span className="ml-0 sm:ml-2 text-gray-600 text-xs sm:text-sm">Qtd: {prod.quantity}</span>
                        <span className="ml-0 sm:ml-2 text-gray-900 text-xs sm:text-base">R$ {prod.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="font-bold text-gray-900 text-base sm:text-lg">Total: R$ {pedido.total}</div>
                {pedido.frete !== undefined && (
                  <div className="text-gray-700 text-xs sm:text-base">Frete: R$ {pedido.frete}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
