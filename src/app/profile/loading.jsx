export default function ProfileLoading() {
	return (
		<div className="container mx-auto px-4 py-8 animate-pulse">
			{/* Profile Header */}
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
				<div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
				<div className="space-y-2 text-center sm:text-left">
					<div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-5 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center space-y-2"
					>
						<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
						<div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
						<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
					</div>
				))}
			</div>

			{/* Order History */}
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
				<div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-xl"
					>
						<div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
						<div className="flex-1 space-y-2">
							<div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
							<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
						<div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
				))}
			</div>
		</div>
	);
}
