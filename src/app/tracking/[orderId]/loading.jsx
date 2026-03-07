export default function TrackingLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Back Button */}
			<div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left: Order Status */}
				<div className="lg:col-span-2 space-y-6">
					{/* Status Header */}
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
						<div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />

						{/* Progress Steps */}
						<div className="flex items-center justify-between mt-6">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="flex flex-col items-center gap-2">
									<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
									<div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
								</div>
							))}
						</div>
					</div>

					{/* Map Placeholder */}
					<div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
						<div className="h-64 bg-gray-200 dark:bg-gray-700" />
					</div>
				</div>

				{/* Right: Driver & Order Info */}
				<div className="space-y-6">
					{/* Driver Card */}
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
						<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="flex items-center gap-3">
							<div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
							<div className="space-y-2">
								<div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>
						</div>
						<div className="flex gap-3">
							<div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							<div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
						</div>
					</div>

					{/* Order Summary Card */}
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
						<div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex justify-between">
								<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
