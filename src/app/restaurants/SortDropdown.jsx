import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const SortDropdown = ({ sortBy, sortOptions, cuisine }) => {
	const router = useRouter();

	const handleSortChange = (newSort) => {
		router.push(
			`/restaurants?${cuisine ? `cuisine=${cuisine}` : ""}&${newSort !== "rating" ? `sortBy=${newSort}` : ""}`,
		);
	};

	return (
		<div className="flex items-center gap-2 shrink-0">
			<SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
			<select
				value={sortBy}
				onChange={(e) => handleSortChange(e.target.value)}
				className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-orange-500 transition-colors"
			>
				{sortOptions.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default SortDropdown;
