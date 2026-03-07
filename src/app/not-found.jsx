import Link from "next/link";
import { Home, Search, UtensilsCrossed } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-6">
					<UtensilsCrossed className="w-12 h-12 text-orange-500" />
				</div>

				<h1 className="text-8xl font-bold text-orange-500 mb-2">404</h1>
				<h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
				<p className="text-gray-500 dark:text-gray-400 mb-8">
					Oops! Looks like this page got lost on the way to delivery. The page
					you&apos;re looking for doesn&apos;t exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<Link
						href="/"
						className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
					>
						<Home className="w-4 h-4" />
						Back to Home
					</Link>
					<Link
						href="/restaurants"
						className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
					>
						<Search className="w-4 h-4" />
						Browse Restaurants
					</Link>
				</div>
			</div>
		</div>
	);
}
