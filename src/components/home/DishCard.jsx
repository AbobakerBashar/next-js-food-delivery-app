"use client";

import { useAddToCart } from "@/hooks/useCart";
import {
	useAddFavoriteDish,
	useGetFavoriteDishes,
	useRemoveFavoriteDish,
} from "@/hooks/useFavorits";
import { useCurrentUser } from "@/hooks/useUser";
import { ChevronRight, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

export default function DishCard({ dish }) {
	const { mutateAsync: addToCartAsync, isPending: isAddingToCart } =
		useAddToCart();

	const { data: user } = useCurrentUser();
	const { data: favDishes, isLoading: dishesLoading } = useGetFavoriteDishes(
		user?.id,
	);

	const { mutateAsync: removeFavorite, isPending: isRemovingDish } =
		useRemoveFavoriteDish();
	const { mutateAsync: addFavoriteDish, isPending: isAddingDish } =
		useAddFavoriteDish();

	const isFavorite = favDishes?.some(
		(favDish) => favDish.menu_item_id === dish.id,
	);

	// --------- ADD Favorits Restaurant-----------------------------------------
	const handleAddToCart = async (item) => {
		if (!user) {
			toast.error("You must be logged in to add items to cart");
			return;
		}

		try {
			await addToCartAsync({ userId: user.id, item });
		} catch (error) {
			toast.error("Failed to add item to cart");
			console.error("Error adding item to cart:", error);
		}
	};

	// --------- ADD/REMOVE Favorits Dish-----------------------------------------
	const handleFavorite = async (dish) => {
		if (!user) {
			toast.error("You must be logged in to manage favorites");
			return;
		}

		try {
			if (isFavorite)
				await removeFavorite({ userId: user.id, menuId: dish.id });
			else await addFavoriteDish({ userId: user.id, menuId: dish.id });
		} catch (error) {
			toast.error("Failed to update favorite status");
			console.error("Error updating favorite status:", error);
		}
	};

	return (
		<div className="snap-start shrink-0 w-56 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
			<div className="relative h-40 overflow-hidden">
				<img
					src={dish.imageUrl}
					alt={dish.name}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<button
					onClick={() => handleFavorite(dish)}
					className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md transition-all duration-200 hover:scale-110 ${
						isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
					} ${isRemovingDish || isAddingDish ? "cursor-not-allowed opacity-50" : ""}`}
					aria-label="Toggle favorite"
				>
					<Heart
						className={`w-4 h-4 transition-colors ${
							isFavorite
								? "fill-red-500 text-red-500"
								: "text-gray-500 dark:text-gray-400"
						}`}
					/>
				</button>
				<button
					onClick={() => handleAddToCart(dish)}
					disabled={isAddingToCart}
					aria-label="Add to cart"
					className={`absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-colors opacity-0 group-hover:opacity-100 ${
						isAddingToCart ? "cursor-not-allowed opacity-50" : ""
					}`}
				>
					<Plus className="w-4 h-4" />
				</button>
			</div>
			<div className="p-3">
				<Link
					href={`/menu/${dish.id}`}
					className="font-semibold text-sm mb-0.5 truncate block hover:text-orange-500 transition-colors"
				>
					{dish.name}
				</Link>
				<p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
					{dish.restaurantName}
				</p>
				<div className="flex items-center justify-between">
					<span className="text-orange-500 font-semibold">
						${dish.price.toFixed(2)}
					</span>
					<Link
						href={`/restaurant/${dish.restaurantId}`}
						className="text-xs text-gray-400 dark:text-gray-500 hover:text-orange-500 flex items-center gap-0.5"
					>
						View <ChevronRight className="w-3 h-3" />
					</Link>
				</div>
			</div>
		</div>
	);
}
