import { CheckCircle } from "lucide-react";

export default function OrderConfirmationLoading() {
	return (
		<div className="container mx-auto px-4 py-16 animate-pulse">
			<div className="max-w-2xl mx-auto text-center">
				{/* Success Icon */}
				<div className="bg-green-100 dark:bg-green-900/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
					<CheckCircle className="w-16 h-16 text-green-300 dark:text-green-800" />
				</div>

				{/* Title & Description */}
				<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4" />
				<div className="h-5 w-96 max-w-full bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8" />

				{/* Order Info Card */}
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8 space-y-4">
					<div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
					<div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
					<div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
					<div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
				</div>
			</div>
		</div>
	);
}
