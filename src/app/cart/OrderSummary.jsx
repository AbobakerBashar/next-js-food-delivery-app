import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderSummary({ subtotal, deliveryFee, tax, total }) {
	const router = useRouter();

	return (
		<div className="lg:col-span-1">
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24 transition-colors">
				<h2 className="text-2xl mb-6">Order Summary</h2>

				<div className="space-y-3 mb-6">
					<div className="flex justify-between text-gray-600 dark:text-gray-400">
						<span>Subtotal</span>
						<span>${subtotal.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-gray-600 dark:text-gray-400">
						<span>Delivery Fee</span>
						<span>${deliveryFee.toFixed(2)}</span>
					</div>
					<div className="flex justify-between text-gray-600 dark:text-gray-400">
						<span>Tax (8%)</span>
						<span>${tax.toFixed(2)}</span>
					</div>
					<div className="border-t dark:border-gray-700 pt-3 flex justify-between text-xl">
						<span>Total</span>
						<span className="text-orange-500">${total.toFixed(2)}</span>
					</div>
				</div>

				<button
					onClick={() => router.push("/checkout")}
					className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full transition-colors"
				>
					Proceed to Checkout
				</button>

				<Link
					href="/"
					className="block text-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mt-4"
				>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
}
