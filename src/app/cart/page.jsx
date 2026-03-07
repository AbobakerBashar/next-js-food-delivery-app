"use client";

import { useCart } from "@/contexts/CartContext";
import EmptyCart from "./EmptyCart";
import CartItemList from "./CartItemList";
import OrderSummary from "./OrderSummary";

export default function CartPage() {
	const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

	const subtotal = getCartTotal();
	const deliveryFee = cartItems.length > 0 ? 2.99 : 0;
	const tax = subtotal * 0.08;
	const total = subtotal + deliveryFee + tax;

	if (cartItems.length === 0) {
		return <EmptyCart />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl mb-8">Your Cart</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<CartItemList
					items={cartItems}
					onUpdateQuantity={updateQuantity}
					onRemove={removeFromCart}
				/>
				<OrderSummary
					subtotal={subtotal}
					deliveryFee={deliveryFee}
					tax={tax}
					total={total}
				/>
			</div>
		</div>
	);
}
