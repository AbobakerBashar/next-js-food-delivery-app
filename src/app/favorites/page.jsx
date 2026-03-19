"use client";

import { useAddToCart } from "@/hooks/useCart";
import {
	useGetFavoriteDishes,
	useGetFavoriteRestaurants,
	useRemoveFavoriteDish,
	useRemoveFavoriteRestaurant,
} from "@/hooks/useFavorits";
import { useCurrentUser } from "@/hooks/useUser";
import { Heart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FavoriteDishes from "./FavoriteDishes";
import FavoriteRestaurants from "./FavoriteRestaurants";

export default function FavoritesPage() {
	const { data: user } = useCurrentUser();

	const { data: restaurants, isLoading: isLoadingRestaurants } =
		useGetFavoriteRestaurants(user?.id);

	const { data: dishes, isLoading: isLoadingDishes } = useGetFavoriteDishes(
		user?.id,
	);

	const {
		mutateAsync: removeFavoriteRestaurant,
		isPending: isRemovingRestaurant,
	} = useRemoveFavoriteRestaurant();

	const { mutateAsync: removeFavoriteDish, isPending: isRemovingDish } =
		useRemoveFavoriteDish();

	const { mutateAsync: addToCart, isPending: isAddingToCart } = useAddToCart();

	const hasRestaurants = restaurants?.length > 0;
	const hasDishes = dishes?.length > 0;
	const isEmpty = !hasRestaurants && !hasDishes;

	//Remove restaurant from favorites
	const handleRemoveRestaurant = async (restaurant) => {
		if (!user) {
			toast.error("You must be logged in to remove favorites");
			return;
		}
		try {
			await removeFavoriteRestaurant({
				userId: user.id,
				restaurantId: restaurant.id,
			});
		} catch (error) {
			toast.error("Failed to remove favorite");
			console.error("Error removing favorite restaurant:", error);
		}
	};

	//Remove dish from favorites
	const handleRemoveDish = async (dish) => {
		if (!user) {
			toast.error("You must be logged in to remove favorites");
			return;
		}
		try {
			await removeFavoriteDish({ userId: user.id, menuId: dish.id });
		} catch (error) {
			toast.error("Failed to remove favorite");
			console.error("Error removing favorite dish:", error);
		}
	};

	// Add dish to cart
	const handleAddToCart = async (item) => {
		if (!user) {
			toast.error("You must be logged in to add to cart");
			return;
		}
		try {
			await addToCart({ userId: user.id, item });
		} catch (error) {
			toast.error("Failed to add to cart");
			console.error("Error adding to cart:", error);
		}
	};

	if (isEmpty) {
		return (
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-md mx-auto text-center">
					<Heart className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
					<h2 className="text-3xl mb-4">No favorites yet</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-8">
						Start exploring restaurants and dishes, and save your favorites by
						tapping the heart icon!
					</p>
					<Link
						href="/restaurants"
						className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-colors"
					>
						Browse Restaurants
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center gap-3 mb-8">
				<Heart className="w-8 h-8 text-red-500 fill-red-500" />
				<h1 className="text-4xl font-bold">Your Favorites</h1>
			</div>

			{/* Favorite Restaurants */}
			{hasRestaurants && (
				<FavoriteRestaurants
					restaurants={restaurants}
					handleRemoveRestaurant={handleRemoveRestaurant}
					isLoading={isLoadingRestaurants}
					isRemovingRestaurant={isRemovingRestaurant}
				/>
			)}

			{/* Favorite Dishes */}
			{hasDishes && (
				<FavoriteDishes
					dishes={dishes}
					handleRemoveDish={handleRemoveDish}
					handleAddToCart={handleAddToCart}
					isLoading={isLoadingDishes}
					isAddingToCart={isAddingToCart}
				/>
			)}
		</div>
	);
}
