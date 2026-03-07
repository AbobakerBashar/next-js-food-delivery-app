export default function RestaurantsLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Page Title */}
			<div className="h-9 w-56 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

			{/* Search & Filters Skeleton */}
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				<div className="h-12 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
				<div className="flex gap-3">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"
						/>
					))}
				</div>
			</div>

			{/* Restaurant Grid Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm"
					>
						<div className="h-48 bg-gray-200 dark:bg-gray-700" />
						<div className="p-4 space-y-3">
							<div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="flex items-center gap-4">
								<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
