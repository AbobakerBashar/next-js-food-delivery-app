"use client";

import Link from "next/link";
import { Star, Clock, DollarSign, Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

export function RestaurantCard({ restaurant, imageUrl }) {
	const { toggleFavoriteRestaurant, isRestaurantFavorite } = useFavorites();
	const isFav = isRestaurantFavorite(restaurant.id);

	const handleFavorite = (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleFavoriteRestaurant(restaurant, imageUrl);
		toast.success(
			isFav
				? `${restaurant.name} removed from favorites`
				: `${restaurant.name} added to favorites`,
		);
	};

	return (
		<Link
			href={`/restaurant/${restaurant.id}`}
			className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
		>
			<div className="relative h-48 overflow-hidden">
				<img
					src={imageUrl}
					alt={restaurant.name}
					className="w-full h-full object-cover"
				/>
				<button
					onClick={handleFavorite}
					className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors shadow-md"
					aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
				>
					<Heart
						className={`w-5 h-5 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-400"}`}
					/>
				</button>
			</div>

			<div className="p-4">
				<h3 className="text-xl mb-2">{restaurant.name}</h3>
				<p className="text-gray-600 dark:text-gray-400 mb-3">
					{restaurant.cuisine}
				</p>

				<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
					<div className="flex items-center gap-1">
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span>{restaurant.rating}</span>
					</div>

					<div className="flex items-center gap-1">
						<Clock className="w-4 h-4" />
						<span>{restaurant.deliveryTime} min</span>
					</div>

					<div className="flex items-center gap-1">
						<DollarSign className="w-4 h-4" />
						<span>${restaurant.deliveryFee}</span>
					</div>
				</div>

				{restaurant.minOrder && (
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
						Min. order: ${restaurant.minOrder}
					</p>
				)}
			</div>
		</Link>
	);
}
