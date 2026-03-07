export default function MenuItemLoading() {
	return (
		<div className="pb-12 animate-pulse">
			{/* Hero Image Skeleton */}
			<div className="h-72 sm:h-96 bg-gray-200 dark:bg-gray-800" />

			<div className="container mx-auto px-4 -mt-6 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Quick Info */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
									<div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
								</div>
								<div className="h-12 w-36 bg-gray-200 dark:bg-gray-700 rounded-xl" />
							</div>
							<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="flex gap-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"
									/>
								))}
							</div>
						</div>

						{/* Nutrition */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
							<div className="grid grid-cols-5 gap-3">
								{[1, 2, 3, 4, 5].map((i) => (
									<div
										key={i}
										className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center space-y-2"
									>
										<div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
										<div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
									</div>
								))}
							</div>
						</div>

						{/* Health Assessment */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
							<div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
							<div className="grid grid-cols-2 gap-6 mt-4">
								{[1, 2].map((i) => (
									<div key={i} className="space-y-3">
										<div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
										{[1, 2, 3].map((j) => (
											<div
												key={j}
												className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"
											/>
										))}
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-3">
							<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl"
								/>
							))}
						</div>
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-3">
							<div className="h-6 w-44 bg-gray-200 dark:bg-gray-700 rounded" />
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-14 bg-gray-100 dark:bg-gray-700 rounded-xl"
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
