"use client";
import { useEffect, useState } from "react";
// Função para montar mensagem do pedido

import type { User } from '@supabase/supabase-js';

function montarMensagemPedido(
    user: User | null,
    cart: CartItem[],
    total: number
) {
    const nome =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        "Não informado";
    const email = user?.email || "Não informado";
    const produtos = cart
        .map(
            (item) =>
                `- ${item.product?.name} - Qtd: ${item.quantity} - R$ ${(item.product?.price * item.quantity).toFixed(2)}`
        )
        .join("\n");
    return (
        `️ NOVO PEDIDO - STG CATALOG\n` +
        ` Cliente: ${nome}\n` +
        ` Email: ${email}\n` +
        ` PRODUTOS:\n${produtos}\n` +
        ` TOTAL: R$ ${total.toFixed(2)}\n` +
        `---\nPedido via STG Catalog`
    );
}

function abrirWhatsapp(mensagem: string) {
    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
}
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabaseClient";
import Link from "next/link";
import type { Product } from "../../types/product";

interface CartItem {
    id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    created_at: string;
    product: Product;
}

export default function CartPage() {
    const [showConfirm, setShowConfirm] = useState(false);
    const { user, loading } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    // Estados para simulação de frete
    const [cep, setCep] = useState('');
    const [frete, setFrete] = useState<number | null>(null);
    const [freteError, setFreteError] = useState('');

    useEffect(() => {
        if (!user) return;
        setLoadingCart(true);
        supabase
            .from("cart_items")
            .select("*, product:product_id(*)")
            .eq("user_id", user.id)
            .then(({ data, error }) => {
                if (error && error.code !== "PGRST116") {
                    console.log("Erro Supabase:", error);
                    setError("Erro ao buscar carrinho");
                } else {
                    setError(null);
                }
                setCart(data || []);
                setLoadingCart(false);
            });
    }, [user]);

    async function handleRemove(itemId: string) {
        await supabase.from("cart_items").delete().eq("id", itemId);
        setCart((prev) => prev.filter((item) => item.id !== itemId));
    }

    async function handleUpdateQuantity(itemId: string, newQuantity: number) {
        if (newQuantity < 1) return;
        setUpdating(itemId);
        await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId);
        setCart((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
        setUpdating(null);
    }

    // Função para simular cálculo de frete
    function calcularFrete(cep: string) {
        if (!/^\d{8}$/.test(cep)) {
            setFreteError('Digite um CEP válido (apenas números, 8 dígitos)');
            setFrete(null);
            return;
        }
        setFreteError('');
        const prefixo = Number(cep.substring(0, 1));
        let valor = 29.9;
        if (prefixo === 1) valor = 49.9;
        if (prefixo === 8) valor = 19.9;
        setFrete(valor);
    }

    if (loading || loadingCart) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-lg">Você precisa estar logado para ver o carrinho.</p>
                <Link href="/login" className="text-blue-600 hover:underline">Fazer login</Link>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 mt-10">{error}</div>;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Meu Carrinho</h1>
                {cart.length === 0 ? (
                    <div className="text-center text-gray-700">Seu carrinho está vazio.</div>
                ) : (
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center bg-white rounded-lg shadow p-4 gap-4 border border-gray-300"
                            >
                                <img
                                    src={item.product?.image_url}
                                    alt={item.product?.name}
                                    className="w-20 h-20 object-cover rounded border border-gray-200"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-lg text-gray-900">
                                        {item.product?.name || "Produto"}
                                    </div>
                                    <div className="text-gray-700">{item.product?.description}</div>
                                    <div className="mt-2 flex gap-4 items-center">
                                        <span className="text-sm flex items-center gap-2 text-gray-800">
                                            Qtd:
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                disabled={updating === item.id}
                                                onChange={e => handleUpdateQuantity(item.id, Number(e.target.value))}
                                                className="w-16 border border-gray-400 rounded px-2 py-1 bg-gray-50 text-gray-900"
                                            />
                                        </span>
                                        <span className="text-sm text-gray-800">
                                            Preço: <b className="text-green-700">R$ {item.product?.price?.toFixed(2)}</b>
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            Subtotal: <span className="text-green-700">R$ {(item.product?.price * item.quantity).toFixed(2)}</span>
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        {/* Simulador de frete */}
                        <div className="mb-6 flex items-center gap-2 justify-end">
                            <input
                                type="text"
                                placeholder="Digite seu CEP"
                                value={cep}
                                onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                className="border border-gray-400 rounded px-2 py-1 w-40"
                            />
                            <button
                                onClick={() => calcularFrete(cep)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                type="button"
                            >
                                Calcular Frete
                            </button>
                            {freteError && <span className="text-red-600 text-sm ml-2">{freteError}</span>}
                        </div>
                        {frete !== null && (
                            <div className="text-right text-green-700 font-semibold mb-2">
                                Frete: R$ {frete.toFixed(2)}
                            </div>
                        )}
                        <div className="text-right text-xl font-bold mt-6 text-gray-900">
                            Total: <span className="text-green-700">R$ {(subtotal + (frete || 0)).toFixed(2)}</span>
                        </div>
                        {/* Botão finalizar pedido */}
                        <div className="mt-8 text-center">
                          <button
                            className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 transition"
                            onClick={() => {
                              const mensagem = montarMensagemPedido(user, cart, subtotal + (frete || 0));
                              abrirWhatsapp(mensagem);
                              setShowConfirm(true);
                            }}
                          >
                            Finalizar pedido no WhatsApp
                          </button>
                        </div>
                        {/* Modal de confirmação */}
                        {showConfirm && (
                          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded shadow-lg text-center">
                              <p className="mb-4 text-lg">Pedido enviado pelo WhatsApp?</p>
                              <button
                                className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
                                onClick={async () => {
                                  for (const item of cart) {
                                    await supabase
                                      .from("products")
                                      .update({ quantity: (item.product.quantity || 0) - item.quantity })
                                      .eq("id", item.product_id);
                                  }
                                  await supabase.from("cart_items").delete().eq("user_id", user.id);
                                  setCart([]);
                                  setShowConfirm(false);
                                }}
                              >
                                Confirmar e limpar carrinho
                              </button>
                              <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowConfirm(false)}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                )}
                <div className="mt-10 text-center">
                    <Link href="/catalog" className="text-blue-700 hover:underline font-semibold">Continuar comprando</Link>
                </div>
            </div>
        </div>
    );
}
