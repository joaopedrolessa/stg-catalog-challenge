"use client";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
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

    // Sincroniza o estado do carrinho com o localStorage (para limpeza automática)
    useEffect(() => {
        function syncCartFromStorage() {
            const cartLS = localStorage.getItem('cart');
            if (cartLS) {
                try {
                    setCart(JSON.parse(cartLS));
                } catch {
                    setCart([]);
                }
            } else {
                setCart([]);
            }
        }
        window.addEventListener('storage', syncCartFromStorage);
        return () => window.removeEventListener('storage', syncCartFromStorage);
    }, []);

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

        // Agrupamento simulado por loja (usando product.category como loja fictícia)
        const grouped = cart.reduce((acc: Record<string, CartItem[]>, item) => {
            const loja = item.product?.category || 'Loja Única';
            if (!acc[loja]) acc[loja] = [];
            acc[loja].push(item);
            return acc;
        }, {});

                // Função para finalizar pedido com verificação do frete
                const handleFinalizarPedido = () => {
                            if (frete === null) {
                                toast.warn('Por favor, adicione o CEP antes de continuar.', {
                            position: 'top-center',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'colored',
                        });
                        return;
                    }
                    const mensagem = montarMensagemPedido(user, cart, subtotal + (frete || 0));
                    abrirWhatsapp(mensagem);
                    setShowConfirm(true);
                };

                return (
                    <div className="min-h-screen bg-[#f2f2f2] py-6 flex flex-col items-center justify-start">
                        <div className="w-full max-w-7xl px-2 sm:px-4 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start justify-center">
                            {/* Coluna esquerda: Produtos */}
                            <div className="flex-1 max-w-3xl w-full">
                                {Object.entries(grouped).map(([loja, items]) => (
                                    <div key={loja} className="bg-white rounded-xl shadow mb-4 sm:mb-6">
                                        <div className="border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2">
                                            <input type="checkbox" disabled className="accent-blue-500" />
                                            <span className="font-semibold text-base sm:text-lg text-gray-800">Produtos de {loja}</span>
                                        </div>
                                        {items.map(item => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-center px-4 sm:px-12 py-4 sm:py-8 border-b last:border-b-0 text-base sm:text-[120%] gap-4 sm:gap-0">
                                                <input type="checkbox" disabled className="accent-blue-500 mb-2 sm:mb-0 sm:mr-8 scale-125 sm:scale-150" />
                                                <Image src={item.product?.image_url || '/placeholder-product.png'} alt={item.product?.name || 'Produto'} width={112} height={112} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded border mb-2 sm:mb-0 sm:mr-8" />
                                                <div className="flex-1 w-full">
                                                    <div className="font-bold text-base sm:text-xl mb-1 sm:mb-2 truncate max-w-xs text-gray-900">{item.product?.name}</div>
                                                    <button onClick={() => handleRemove(item.id)} className="text-blue-600 text-sm sm:text-base hover:underline">Excluir</button>
                                                </div>
                                                {/* Controle de quantidade estilizado */}
                                                <div className="flex items-center border rounded px-2 sm:px-4 py-2 sm:py-3 mb-2 sm:mb-0 sm:mr-12">
                                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1 || updating === item.id} className="text-gray-700 px-2 sm:px-4 text-lg sm:text-xl font-bold disabled:opacity-40">-</button>
                                                    <span className="mx-2 sm:mx-4 w-8 sm:w-12 text-center select-none text-gray-900 text-lg sm:text-xl">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={updating === item.id} className="text-blue-600 px-2 sm:px-4 text-lg sm:text-xl font-bold disabled:opacity-40">+</button>
                                                </div>
                                                <div className="text-right font-semibold text-base sm:text-xl min-w-[100px] sm:min-w-[225px] text-gray-900 flex items-center justify-end" style={{height: '48px', minHeight: '48px'}}>
                                                    R$ {item.product?.price?.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {/* Coluna direita: Resumo */}
                            <div className="w-full lg:w-[340px] mt-4 lg:mt-0">
                                <div className="bg-white rounded-xl shadow p-4 sm:p-6 sticky top-8">
                                    <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800">Resumo da compra</h2>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-800">Total</span>
                                        <span className="font-bold text-base sm:text-lg text-gray-900">R$ {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col gap-2 mb-4">
                                        <label htmlFor="frete" className="text-xs sm:text-sm text-gray-800">Calcule o frete</label>
                                        <div className="flex gap-2">
                                            <input
                                                id="frete"
                                                type="text"
                                                placeholder="Digite seu CEP"
                                                className="border rounded px-2 sm:px-3 py-2 w-24 sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                                                maxLength={8}
                                                value={cep}
                                                onChange={e => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                            />
                                            <button
                                                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700"
                                                type="button"
                                                onClick={() => calcularFrete(cep)}
                                            >
                                                Calcular
                                            </button>
                                        </div>
                                        {freteError && <span className="text-red-600 text-xs sm:text-sm ml-2">{freteError}</span>}
                                        {frete !== null && !freteError && (
                                            <div className="text-green-700 font-semibold mt-2">Frete: R$ {frete.toFixed(2)}</div>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-base sm:text-lg font-bold mt-4">
                                        <span className="text-gray-800">Total</span>
                                        <span className="text-green-700">R$ {(subtotal + (frete || 0)).toFixed(2)}</span>
                                    </div>
                                    <button
                                        className="w-full mt-4 sm:mt-6 bg-blue-600 text-white py-2 sm:py-3 rounded font-semibold hover:bg-blue-700 transition text-base sm:text-lg"
                                        onClick={() => {
                                            if (frete === null) {
                                                toast.warn('Por favor, adicione o CEP antes de continuar.', {
                                                    position: 'top-center',
                                                    autoClose: 3000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: 'colored',
                                                });
                                                return;
                                            }
                                            // Salva dados do carrinho e frete no localStorage
                                            localStorage.setItem('checkout_cart', JSON.stringify(cart));
                                            localStorage.setItem('checkout_frete', String(frete));
                                            window.location.href = '/checkout';
                                        }}
                                    >
                                        Continuar a compra
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Modal de confirmação (inalterado) */}
                        {showConfirm && (
                            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                <div className="bg-white p-6 sm:p-8 rounded shadow-lg text-center w-11/12 max-w-md">
                                    <p className="mb-4 text-base sm:text-lg">Pedido enviado pelo WhatsApp?</p>
                                    <button
                                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded mr-2 sm:mr-4"
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
                                        className="bg-gray-300 px-3 sm:px-4 py-2 rounded"
                                        onClick={() => setShowConfirm(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="mt-8 sm:mt-10 text-center w-full">
                            <Link href="/catalog" className="text-blue-700 hover:underline font-semibold">Continuar comprando</Link>
                        </div>
            </div>
        );
}
