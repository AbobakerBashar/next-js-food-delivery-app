import {
	addFavoriteDish,
	addFavoriteRestaurant,
	getFavoriteDishes,
	getFavoriteRestaurants,
	removeFavoriteDish,
	removeFavoriteRestaurant,
} from "@/lib/favorites-queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// --------- GET Favorits Reataurants-----------------------------------------
export function useGetFavoriteRestaurants(userId) {
	return useQuery({
		queryKey: ["favorite-restaurants", userId],
		queryFn: () => getFavoriteRestaurants(userId),
		enabled: !!userId,
	});
}

// --------- GET Favorits Dishes-----------------------------------------
export function useGetFavoriteDishes(userId) {
	return useQuery({
		queryKey: ["favorite-dishes", userId],
		queryFn: () => getFavoriteDishes(userId),
		enabled: !!userId,
	});
}

// --------- ADD Favorits Reataurant-----------------------------------------
export function useAddFavoriteRestaurant() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, restaurantId }) =>
			addFavoriteRestaurant(userId, restaurantId),

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["favorite-restaurants", userId]);
			toast.success("Restaurant added to favorites");
		},
		onError: (error) => {
			toast.error("Failed to add restaurant to favorites");
			console.error("Error adding favorite restaurant:", error);
		},
	});
}

// --------- REMOVE Favorits Reataurant-----------------------------------------
export function useRemoveFavoriteRestaurant() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, restaurantId }) =>
			removeFavoriteRestaurant(userId, restaurantId),

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["favorite-restaurants", userId]);
			toast.success("Restaurant removed from favorites");
		},
		onError: (error) => {
			toast.error("Failed to remove restaurant from favorites");
			console.error("Error removing favorite restaurant:", error);
		},
	});
}

// --------- ADD Favorits Dish-----------------------------------------
export function useAddFavoriteDish() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, menuId }) => addFavoriteDish(userId, menuId),

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["favorite-dishes", userId]);
			toast.success("Dish added to favorites");
		},
		onError: (error) => {
			toast.error("Failed to add dish to favorites");
			console.error("Error adding favorite dish:", error);
		},
	});
}

// --------- REMOVE Favorits Dish-----------------------------------------
export function useRemoveFavoriteDish() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, menuId }) => removeFavoriteDish(userId, menuId),

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["favorite-dishes", userId]);
			toast.success("Dish removed from favorites");
		},
		onError: (error) => {
			toast.error("Failed to remove dish from favorites");
			console.error("Error removing favorite dish:", error);
		},
	});
}
