export default function CartLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Title */}
			<div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Cart Items */}
				<div className="lg:col-span-2 space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-white dark:bg-gray-800 rounded-xl p-4 flex gap-4"
						>
							<div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
							<div className="flex-1 space-y-2">
								<div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="flex items-center gap-3">
									<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
									<div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Order Summary */}
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-fit space-y-4">
					<div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="space-y-3">
						<div className="flex justify-between">
							<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
						<div className="flex justify-between">
							<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
						<div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
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
