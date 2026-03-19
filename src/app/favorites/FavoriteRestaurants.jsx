import { LoadingSpinner } from "@/components/ui/Loading";
import { Star, Trash2 } from "lucide-react";
import Link from "next/link";

const FavoriteRestaurants = ({
	restaurants,
	handleRemoveRestaurant,
	isLoading,
	isRemovingRestaurant,
}) => {
	if (isLoading) return <LoadingSpinner />;

	return (
		<section className="mb-12">
			<h2 className="text-2xl font-semibold mb-6">
				Favorite Restaurants ({restaurants?.length})
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{restaurants?.map((restaurant) => (
					<div
						key={restaurant?.id}
						className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
					>
						<Link href={`/restaurant/${restaurant?.id}`}>
							<div className="relative h-48 overflow-hidden">
								<img
									src={restaurant?.restaurants.image_url}
									alt={restaurant?.restaurants.name}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
								<div className="absolute bottom-3 left-3 text-white">
									<h3 className="text-lg font-semibold">
										{restaurant?.restaurants.name}
									</h3>
									{restaurant.restaurants.cuisine && (
										<p className="text-sm text-gray-200">
											{restaurant.restaurants.cuisine}
										</p>
									)}
								</div>
								{restaurant.restaurants.rating && (
									<div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm">
										<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
										<span className="font-medium text-gray-900 dark:text-gray-100">
											{restaurant.restaurants.rating}
										</span>
									</div>
								)}
							</div>
						</Link>
						<div className="p-4 flex items-center justify-between">
							<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
								{restaurant.restaurants.delivery_time && (
									<span>{restaurant.restaurants.delivery_time}</span>
								)}
								{restaurant.restaurants.price_range && <span>•</span>}
								{restaurant.restaurants.price_range && (
									<span>{restaurant.restaurants.price_range}</span>
								)}
							</div>
							<button
								onClick={() => handleRemoveRestaurant(restaurant.restaurants)}
								disabled={isRemovingRestaurant}
								className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors disabled:text-red-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
								aria-label="Remove from favorites"
							>
								<Trash2 className="w-5 h-5" />
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default FavoriteRestaurants;
