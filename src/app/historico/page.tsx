"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

interface ProductInOrder {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Pedido {
  id: string;
  user_id: string;
  produtos: ProductInOrder[];
  total: number;
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
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-black">Histórico de Compras</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : pedidos.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold text-black">Pedido #{pedido.id}</div>
              <div className="text-sm text-gray-700 mb-2">{new Date(pedido.created_at).toLocaleString()}</div>
              <div className="mb-2">
                <span className="font-medium text-black">Produtos:</span>
                <ul className="list-disc ml-6 text-black">
                  {pedido.produtos.map((prod, idx) => (
                    <li key={idx}>{prod.name} - Qtd: {prod.quantity} - R$ {prod.price}</li>
                  ))}
                </ul>
              </div>
              <div className="font-bold text-black">Total: R$ {pedido.total}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
