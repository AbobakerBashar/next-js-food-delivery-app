import { useRouter } from "next/navigation";

const CuisinesTabs = ({ cuisines, selectedCuisine, sortBy }) => {
	const router = useRouter();

	const handleCuisineChange = (cuisine) => {
		router.push(
			`/restaurants?${cuisine !== "All" ? `cuisine=${cuisine}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}`,
		);
	};

	return (
		<div className="flex gap-2 overflow-x-auto pb-2 flex-1 flex-wrap justify-center md:justify-start">
			{cuisines.map((cuisine) => (
				<button
					key={cuisine}
					aria-label={`Filter by ${cuisine} cuisine`}
					onClick={() => handleCuisineChange(cuisine)}
					className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors text-sm ${
						selectedCuisine === cuisine
							? "bg-orange-500 text-white"
							: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
					}`}
				>
					{cuisine}
				</button>
			))}
		</div>
	);
};

export default CuisinesTabs;
