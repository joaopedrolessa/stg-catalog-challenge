"use client";
import { useEffect, useState } from "react";
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
	const { user, loading } = useAuth();
	const [cart, setCart] = useState<CartItem[]>([]);
	const [loadingCart, setLoadingCart] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) return;
		setLoadingCart(true);
		supabase
			.from("cart_items")
			.select("*, product:product_id(*)")
			.eq("user_id", user.id)
			.then(({ data, error }) => {
				if (error && error.code !== "PGRST116") {
					console.log("Erro Supabase:", error); // <-- Adicione esta linha
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

	const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
			<div className="container mx-auto px-4 max-w-3xl">
				<h1 className="text-3xl font-bold mb-8 text-center">Meu Carrinho</h1>
				{cart.length === 0 ? (
					<div className="text-center text-gray-600">Seu carrinho está vazio.</div>
				) : (
					<div className="space-y-6">
						{cart.map((item) => (
							<div key={item.id} className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
								<img src={item.product?.image_url} alt={item.product?.name} className="w-20 h-20 object-cover rounded" />
								<div className="flex-1">
									<div className="font-semibold text-lg">{item.product?.name || "Produto"}</div>
									<div className="text-gray-500">{item.product?.description}</div>
									<div className="mt-2 flex gap-4 items-center">
										<span className="text-sm">Qtd: <b>{item.quantity}</b></span>
										<span className="text-sm">Preço: <b>R$ {item.product?.price?.toFixed(2)}</b></span>
									</div>
								</div>
								<button
									onClick={() => handleRemove(item.id)}
									className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
								>
									Remover
								</button>
							</div>
						))}
						<div className="text-right text-xl font-bold mt-6">
							Total: R$ {total.toFixed(2)}
						</div>
					</div>
				)}
				<div className="mt-10 text-center">
					<Link href="/catalog" className="text-blue-600 hover:underline">Continuar comprando</Link>
				</div>
			</div>
		</div>
	);
}
