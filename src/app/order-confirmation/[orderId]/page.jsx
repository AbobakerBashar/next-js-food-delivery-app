import Link from "next/link";
import { CheckCircle, Package, Clock } from "lucide-react";

export default async function OrderConfirmationPage({ params }) {
	const { orderId } = await params;
	const estimatedDelivery = "30-40";

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-2xl mx-auto text-center">
				<div className="bg-green-100 dark:bg-green-900/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
					<CheckCircle className="w-16 h-16 text-green-500" />
				</div>

				<h1 className="text-4xl mb-4">Order Confirmed!</h1>
				<p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
					Thank you for your order. We&apos;ve received your payment and are
					preparing your delicious meal!
				</p>

				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8 transition-colors">
					<div className="flex items-center justify-center gap-2 mb-4">
						<Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						<span className="text-gray-600 dark:text-gray-400">
							Order Number
						</span>
					</div>
					<p className="text-3xl text-orange-500 mb-6">#{orderId}</p>

					<div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
						<Clock className="w-5 h-5" />
						<span>Estimated delivery: {estimatedDelivery} minutes</span>
					</div>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8 transition-colors">
					<h2 className="text-2xl mb-4">What&apos;s Next?</h2>
					<div className="space-y-4 text-left">
						<div className="flex gap-4">
							<div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
								1
							</div>
							<div>
								<h3 className="mb-1">Restaurant is preparing your order</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									The kitchen is working on your delicious meal
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
								2
							</div>
							<div>
								<h3 className="mb-1">Driver will pick up your order</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									A driver will be assigned shortly
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">
								3
							</div>
							<div>
								<h3 className="mb-1">Order arrives at your doorstep</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Enjoy your meal!
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex gap-4 justify-center">
					<Link
						href={`/tracking/${orderId}`}
						className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors"
					>
						Track Order
					</Link>
					<Link
						href="/"
						className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-full transition-colors"
					>
						Order Again
					</Link>
				</div>
			</div>
		</div>
	);
}
