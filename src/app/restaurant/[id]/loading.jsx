export default function RestaurantLoading() {
	return (
		<div className="pb-8 animate-pulse">
			{/* Header Image Skeleton */}
			<div className="h-64 bg-gray-200 dark:bg-gray-800" />

			<div className="container mx-auto px-4">
				<div className="relative -mt-16 mb-8">
					{/* Back Button Skeleton */}
					<div className="w-44 h-10 bg-gray-300 dark:bg-gray-700 rounded-full mb-4" />

					{/* Restaurant Info Card */}
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
						<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
						<div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
						<div className="flex items-center gap-6">
							<div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
					</div>
				</div>

				{/* Category Tabs Skeleton */}
				<div className="flex gap-3 mb-6 overflow-hidden">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"
						/>
					))}
				</div>

				{/* Menu Items Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="bg-white dark:bg-gray-800 rounded-xl p-4 flex gap-4"
						>
							<div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
							<div className="flex-1 space-y-2">
								<div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
