import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollArrows({ scroll }) {
	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => scroll("left")}
				className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors shadow-sm"
				aria-label="Scroll left"
			>
				<ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
			</button>
			<button
				onClick={() => scroll("right")}
				className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors shadow-sm"
				aria-label="Scroll right"
			>
				<ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
			</button>
		</div>
	);
}
