"use client";

import Link from "next/link";
import { Heart, Trash2, Star } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function FavoritesPage() {
	const { favorites, toggleFavoriteRestaurant, toggleFavoriteDish } =
		useFavorites();
	const { addToCart } = useCart();

	const hasRestaurants = favorites.restaurants.length > 0;
	const hasDishes = favorites.dishes.length > 0;
	const isEmpty = !hasRestaurants && !hasDishes;

	const handleRemoveRestaurant = (restaurant) => {
		toggleFavoriteRestaurant(restaurant, restaurant.imageUrl);
		toast.success(`${restaurant.name} removed from favorites`);
	};

	const handleRemoveDish = (dish) => {
		toggleFavoriteDish(dish, dish.imageUrl);
		toast.success(`${dish.name} removed from favorites`);
	};

	const handleAddToCart = (dish) => {
		addToCart({ ...dish });
		toast.success(`${dish.name} added to cart!`);
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
				<section className="mb-12">
					<h2 className="text-2xl font-semibold mb-6">
						Favorite Restaurants ({favorites.restaurants.length})
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{favorites.restaurants.map((restaurant) => (
							<div
								key={restaurant.id}
								className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
							>
								<Link href={`/restaurant/${restaurant.id}`}>
									<div className="relative h-48 overflow-hidden">
										<img
											src={restaurant.imageUrl}
											alt={restaurant.name}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
										<div className="absolute bottom-3 left-3 text-white">
											<h3 className="text-lg font-semibold">
												{restaurant.name}
											</h3>
											{restaurant.cuisine && (
												<p className="text-sm text-gray-200">
													{restaurant.cuisine}
												</p>
											)}
										</div>
										{restaurant.rating && (
											<div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
												<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
												<span className="font-medium text-gray-900 dark:text-gray-100">
													{restaurant.rating}
												</span>
											</div>
										)}
									</div>
								</Link>
								<div className="p-4 flex items-center justify-between">
									<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
										{restaurant.deliveryTime && (
											<span>{restaurant.deliveryTime}</span>
										)}
										{restaurant.deliveryTime && restaurant.priceRange && (
											<span>•</span>
										)}
										{restaurant.priceRange && (
											<span>{restaurant.priceRange}</span>
										)}
									</div>
									<button
										onClick={() => handleRemoveRestaurant(restaurant)}
										className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
										aria-label="Remove from favorites"
									>
										<Trash2 className="w-5 h-5" />
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Favorite Dishes */}
			{hasDishes && (
				<section>
					<h2 className="text-2xl font-semibold mb-6">
						Favorite Dishes ({favorites.dishes.length})
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{favorites.dishes.map((dish) => (
							<div
								key={`${dish.id}-${dish.restaurantId}`}
								className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
							>
								<div className="relative h-40 overflow-hidden">
									<img
										src={dish.imageUrl}
										alt={dish.name}
										className="w-full h-full object-cover"
									/>
									<div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
										${dish.price?.toFixed(2)}
									</div>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
									{dish.description && (
										<p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
											{dish.description}
										</p>
									)}
									<div className="flex items-center justify-between gap-2">
										<button
											onClick={() => handleAddToCart(dish)}
											className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors"
										>
											Add to Cart
										</button>
										<button
											onClick={() => handleRemoveDish(dish)}
											className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
											aria-label="Remove from favorites"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
