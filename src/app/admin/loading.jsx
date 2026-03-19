export default function AdminLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Header */}
			<div className="flex items-center gap-4 mb-8">
				<div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
				<div className="space-y-2 flex-1">
					<div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
					<div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded" />
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg" />
							<div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
						<div className="space-y-2">
							<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
							<div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
					</div>
				))}
			</div>

			{/* Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Table Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6">
					<div className="flex items-center justify-between mb-6">
						<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
						<div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="flex items-center p-4 border-b last:border-b-0"
							>
								<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
								<div className="flex-1 ml-4 space-y-2">
									<div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
									<div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Actions Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
