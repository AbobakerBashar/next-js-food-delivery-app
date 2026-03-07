"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";

export function AddToCartButton({ item }) {
	const { addToCart } = useCart();

	const handleAddToCart = () => {
		addToCart(item);
		toast.success(`${item.name} added to cart!`);
	};

	return (
		<button
			onClick={handleAddToCart}
			className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.97] text-white font-semibold px-6 py-3 rounded-xl transition-all"
		>
			<ShoppingBag className="w-5 h-5" />
			Add to Cart
		</button>
	);
}
