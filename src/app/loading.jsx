import { UtensilsCrossed } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4">
			<div className="relative">
				<div className="w-16 h-16 rounded-full border-4 border-orange-200 dark:border-orange-900/40 border-t-orange-500 dark:border-t-orange-500 animate-spin" />
				<div className="absolute inset-0 flex items-center justify-center">
					<UtensilsCrossed className="w-6 h-6 text-orange-500 animate-pulse" />
				</div>
			</div>
			<p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
				Loading...
			</p>
		</div>
	);
}
