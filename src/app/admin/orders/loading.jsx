export default function OrdersLoading() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
			{/* Header */}
			<div className="flex items-center gap-4 mb-8 h-16" />

			{/* Filters Card */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
					<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
					<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
				</div>
			</div>

			{/* Table Card */}
			<div className="bg-white dark:bg-gray-800 rounded-xl">
				<div className="p-6 border-b">
					<div className="flex items-center justify-between h-8">
						<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
				</div>
				<div className="overflow-hidden">
					<div className="divide-y divide-border">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="flex p-4 items-center space-x-4">
								<div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
								<div className="flex-1 min-w-0 space-y-2">
									<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
									<div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
								</div>
								<div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
								<div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
