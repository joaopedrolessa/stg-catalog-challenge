
"use client";
import { useEffect, useState } from "react";
import { validateCoupon, Coupon } from "../../services/couponService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState<number>(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const cartLS = localStorage.getItem("checkout_cart");
    const freteLS = localStorage.getItem("checkout_frete");
    if (cartLS) setCart(JSON.parse(cartLS));
    if (freteLS) setFrete(Number(freteLS));
  }, []);

  useEffect(() => {
    const sub = cart.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
    setSubtotal(sub);
  }, [cart]);

  useEffect(() => {
    let desc = 0;
    if (coupon) {
      if (coupon.type === "compra") {
        desc = subtotal * (coupon.value / 100);
      } else if (coupon.type === "frete") {
        desc = frete * (coupon.value / 100);
      }
    }
    setDiscount(desc);
    setTotal(subtotal + frete - desc);
  }, [subtotal, frete, coupon]);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="text-gray-700 text-lg">Seu carrinho está vazio ou expirou.</span>
      </div>
    );
  }

  // Função para montar mensagem do pedido
  function montarMensagemWhatsapp() {
    let mensagem = `Olá! Gostaria de finalizar minha compra:%0A`;
    cart.forEach((item) => {
      mensagem += `• ${item.product?.name} (Qtd: ${item.quantity}) - R$ ${(item.product?.price * item.quantity).toFixed(2)}%0A`;
    });
    mensagem += `Frete: R$ ${(frete || 0).toFixed(2)}%0A`;
    if (coupon) {
      mensagem += `Cupom: ${coupon.code} (${coupon.type === "compra" ? "Desconto na compra" : "Desconto no frete"} - ${coupon.value}%)%0A`;
      mensagem += `Desconto: -R$ ${discount.toFixed(2)}%0A`;
    }
    mensagem += `Total: R$ ${total.toFixed(2)}`;
    return mensagem;
  }

  async function finalizarCompra() {
    // Salva o pedido no Supabase antes de limpar o carrinho
    if (user && user.id) {
      // Serializa os itens do carrinho para garantir que name e image_url estejam presentes
      const serializedItems = cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        image_url: item.product.image_url,
        price: item.product.price,
        quantity: item.quantity
      }));
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          items: serializedItems,
          total: total,
          frete: frete,
          created_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        toast.error("Erro ao salvar pedido: " + error.message);
        return;
      }
    }
    // Limpa o carrinho local
    localStorage.removeItem("checkout_cart");
    localStorage.removeItem("checkout_frete");
    localStorage.removeItem("cart");
    setCart([]);
    setFrete(0);
    setTotal(0);
    // Limpa o carrinho do Supabase se estiver autenticado
    if (user && user.id) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
    // Abre o WhatsApp
    const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const mensagem = montarMensagemWhatsapp();
    window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
    // Redireciona para a página principal
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 max-w-3xl w-full mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">Resumo do Pedido</h1>
        <ul className="mb-6 divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="py-3 flex items-center gap-4">
              <img
                src={item.product?.image_url}
                alt={item.product?.name}
                className="w-16 h-16 object-cover rounded border"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.product?.name}</div>
                <div className="text-gray-600 text-sm">Qtd: {item.quantity}</div>
              </div>
              <div className="font-bold text-lg text-gray-900">
                R$ {(item.product?.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        {/* Cupom de desconto */}
        <div className="mb-4">
          <label htmlFor="cupom" className="block text-sm font-medium text-gray-700 mb-1">Cupom de desconto</label>
          <div className="flex gap-2">
            <input
              id="cupom"
              type="text"
              className="border rounded px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Digite o cupom"
              maxLength={20}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              type="button"
              onClick={async () => {
                setCouponError("");
                setCoupon(null);
                if (!couponCode) {
                  setCouponError("Digite o código do cupom.");
                  return;
                }
                const result = await validateCoupon(couponCode);
                if (!result) {
                  setCouponError("Cupom inválido ou expirado.");
                  return;
                }
                setCoupon(result);
                toast.success("Cupom aplicado com sucesso!");
              }}
            >Aplicar</button>
          </div>
          {couponError && <div className="text-red-600 text-sm mt-1">{couponError}</div>}
          {coupon && (
            <div className="text-green-700 text-sm mt-1">
              Cupom <b>{coupon.code}</b> aplicado: {coupon.type === "compra" ? `Desconto de ${coupon.value}% na compra` : `Desconto de ${coupon.value}% no frete`}.
            </div>
          )}
        </div>
        <div className="mb-2 flex justify-between text-gray-700">
          <span>Frete</span>
          <span className="font-semibold">R$ {(frete || 0).toFixed(2)}</span>
        </div>
        {coupon && discount > 0 && (
          <div className="mb-2 flex justify-between text-gray-700">
            <span>Desconto ({coupon.code})</span>
            <span className="font-semibold text-green-700">-R$ {discount.toFixed(2)}</span>
          </div>
        )}
        <div className="mb-6 flex justify-between text-xl font-bold text-gray-900">
          <span>Total</span>
          <span className="text-green-700">R$ {total.toFixed(2)}</span>
        </div>
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg mt-4"
          type="button"
          onClick={finalizarCompra}
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}