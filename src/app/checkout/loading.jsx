export default function CheckoutLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Title */}
			<div className="h-9 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Form Section */}
				<div className="space-y-6">
					{/* Delivery Address */}
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
						<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						<div className="grid grid-cols-2 gap-4">
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						</div>
					</div>

					{/* Payment Method */}
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
						<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="space-y-3">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"
								/>
							))}
						</div>
					</div>
				</div>

				{/* Order Summary */}
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-fit space-y-4">
					<div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
							<div className="flex-1">
								<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
								<div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>
							<div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
					))}
					<div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
						<div className="flex justify-between">
							<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
						<div className="flex justify-between">
							<div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
					</div>
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
				</div>
			</div>
		</div>
	);
}
