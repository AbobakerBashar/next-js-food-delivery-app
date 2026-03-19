import { useRouter } from "next/navigation";

const PagesNanvigations = ({
	totalLength,
	page,
	setPage,
	loading,
	filterStatus,
}) => {
	const router = useRouter();

	const handleCurrentPageOrders = (p) => {
		if (loading) return;
		setPage(p);
		router.push(`/admin/orders?status=${filterStatus}&page=${p}`);
	};

	if (totalLength === 0) return null;
	return (
		<nav className="flex justify-center items-center mt-8 space-x-2 space-y-2">
			<button
				className={`px-3 py-1 border rounded ${
					page === 1
						? "bg-gray-300 text-gray-500 cursor-not-allowed"
						: "hover:bg-gray-200 dark:hover:bg-gray-700"
				}`}
				onClick={() => handleCurrentPageOrders(page - 1)}
				disabled={page === 1}
			>
				Previous
			</button>
			{[...Array(Math.ceil(totalLength / 5))].map((_, index) => (
				<button
					key={index}
					className={`px-3 py-1 border rounded ${
						index === page - 1
							? "bg-blue-500 text-white"
							: "hover:bg-gray-200 dark:hover:bg-gray-700"
					}`}
					onClick={() => handleCurrentPageOrders(index + 1)}
				>
					{index + 1}
				</button>
			))}
			<button
				className={`px-3 py-1 border rounded ${
					page === Math.ceil(totalLength / 5)
						? "bg-gray-300 text-gray-500 cursor-not-allowed"
						: "hover:bg-gray-200 dark:hover:bg-gray-700"
				}`}
				onClick={() => handleCurrentPageOrders(page + 1)}
				disabled={page === Math.ceil(totalLength / 5)}
			>
				Next
			</button>
		</nav>
	);
};

export default PagesNanvigations;
