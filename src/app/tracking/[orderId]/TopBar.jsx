import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

const TopBar = ({ orderId, isDelivered, eta, mockOrderDetails }) => {
	return (
		<div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-16 z-40 transition-colors">
			<div className="container mx-auto px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Link
						href="/"
						className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<h1 className="font-semibold">Order #{orderId}</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{isDelivered
								? "Delivered"
								: `Estimated arrival: ${mockOrderDetails.estimatedDelivery}`}
						</p>
					</div>
				</div>
				{!isDelivered && (
					<div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full">
						<Clock className="w-4 h-4" />
						<span className="font-semibold text-sm">{eta} min</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default TopBar;
