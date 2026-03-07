import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-md mx-auto text-center">
				<ShoppingBag className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
				<h2 className="text-3xl mb-4">Your cart is empty</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					Add some delicious items from our restaurants to get started!
				</p>
				<Link
					href="/"
					className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors"
				>
					Browse Restaurants
				</Link>
			</div>
		</div>
	);
}
