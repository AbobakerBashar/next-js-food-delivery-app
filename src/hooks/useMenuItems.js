import { getPopularDishes } from "@/lib/menu-items-queries";
import { useQuery } from "@tanstack/react-query";

// Get pupular menu items across all restaurants
export function useGetPopularDishes(limit = 8) {
	const {
		data: dishes,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["popular-dishes"],
		queryFn: async () => getPopularDishes(limit),
	});
	return { dishes, error, isLoading };
}
