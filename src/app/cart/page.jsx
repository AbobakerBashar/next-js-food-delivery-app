"use client";

import { useClearCart, useGetCart } from "@/hooks/useCart";
import { useCurrentUser } from "@/hooks/useUser";
import { Trash2 } from "lucide-react";
import CartItemList from "./CartItemList";
import EmptyCart from "./EmptyCart";
import OrderSummary from "./OrderSummary";

export default function CartPage() {
	const { data: user } = useCurrentUser();
	const { data: cart, isLoading } = useGetCart(user?.id);
	const { mutateAsync: clearCart, isPending: isClearingCart } = useClearCart();

	const subtotal =
		cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

	const deliveryFee = cart?.length > 0 ? 2.99 : 0;
	const tax = subtotal * 0.08;
	const total = subtotal + deliveryFee + tax;

	// Handle Clear Cart
	const handleClearCart = async () => {
		if (!user) return;
		try {
			await clearCart(user.id);
		} catch (error) {
			console.error("Error clearing cart:", error);
			toast.error("Failed to clear cart");
		}
	};

	if (cart?.length === 0) {
		return <EmptyCart />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center justify-between">
				<h1 className="text-4xl mb-8">Your Cart</h1>
				<button
					onClick={handleClearCart}
					aria-label="Clear Cart"
					className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition-colors text-gray-100 px-3 py-1 rounded disabled:cursor-not-allowed disabled:bg-red-400 dark:disabled:bg-red-400"
					disabled={isClearingCart}
				>
					<span>Clear Cart</span>
					<Trash2 className="w-5 h-5" />
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<CartItemList items={cart} isLoading={isLoading} />
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
