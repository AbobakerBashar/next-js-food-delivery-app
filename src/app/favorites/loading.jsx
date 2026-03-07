export default function FavoritesLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Title */}
			<div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />

			{/* Favorites Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
					>
						<div className="h-40 bg-gray-200 dark:bg-gray-700" />
						<div className="p-4 space-y-3">
							<div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="flex items-center justify-between">
								<div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
