export default function RestaurantsLoading() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
			{/* Header */}
			<div className="flex items-center gap-4 mb-8 h-16" />

			{/* Table Card */}
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
				<div className="p-6 border-b">
					<div className="flex items-center justify-between h-8">
						<div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
					</div>
				</div>
				<div className="divide-y divide-border">
					{[...Array(7)].map((_, i) => (
						<div key={i} className="p-6 hover:bg-muted/30">
							<div className="flex items-center space-x-4">
								{/* Image */}
								<div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg" />

								{/* Content */}
								<div className="flex-1 min-w-0 space-y-2">
									<div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
									<div className="flex items-center gap-2">
										<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
										<div className="w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
									</div>
								</div>

								{/* Stats */}
								<div className="text-right space-y-1">
									<div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 mx-auto rounded" />
									<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 mx-auto rounded" />
								</div>

								{/* Actions */}
								<div className="flex gap-2 ml-auto">
									<div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
									<div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
