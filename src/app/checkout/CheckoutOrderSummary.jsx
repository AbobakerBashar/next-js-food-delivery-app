import { Loader2 } from "lucide-react";

export default function CheckoutOrderSummary({
	cartItems,
	subtotal,
	deliveryFee,
	tax,
	total,
	isProcessing,
	isStripeReady,
}) {
	return (
		<div className="lg:col-span-1">
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm sticky top-24 transition-colors">
				<h2 className="text-2xl mb-6">Order Summary</h2>

				<div className="space-y-3 mb-6">
					{cartItems.map((item) => (
						<div
							key={`${item.id}-${item.restaurantId}`}
							className="flex justify-between text-sm"
						>
							<span className="text-gray-600 dark:text-gray-400">
								{item.name} x{item.quantity}
							</span>
							<span>${(item.price * item.quantity).toFixed(2)}</span>
						</div>
					))}
				</div>

				<div className="border-t dark:border-gray-700 pt-4 space-y-3 mb-6">
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
					type="submit"
					disabled={isProcessing || !isStripeReady}
					className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-3 rounded-full transition-colors flex items-center justify-center gap-2"
				>
					{isProcessing ? (
						<>
							<Loader2 className="w-5 h-5 animate-spin" />
							Processing...
						</>
					) : (
						`Pay $${total.toFixed(2)}`
					)}
				</button>
			</div>
		</div>
	);
}
