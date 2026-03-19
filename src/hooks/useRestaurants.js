import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/lib/queries";
import { getFeaturedRestaurants } from "@/lib/restaurants-queries";

// -----------------------------
// useGetRestaurants
// -----------------------------
export function useGetRestaurants() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["restaurants"],
		queryFn: getRestaurants,
	});
	return { data, error, isLoading };
}

// -----------------------------
// useGetFeaturedRestaurants
// -----------------------------
export function useGetFeaturedRestaurants() {
	const {
		data: restaurants,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["featured-restaurants"],
		queryFn: getFeaturedRestaurants,
	});
	return { restaurants, error, isLoading };
}
