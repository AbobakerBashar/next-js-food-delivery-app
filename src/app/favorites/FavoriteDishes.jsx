import { LoadingSpinner } from "@/components/ui/Loading";
import { Trash2 } from "lucide-react";

const FavoriteDishes = ({
	dishes,
	handleRemoveDish,
	handleAddToCart,
	isLoading,
	isAddingToCart,
}) => {
	if (isLoading) return <LoadingSpinner />;

	return (
		<section>
			<h2 className="text-2xl font-semibold mb-6">
				Favorite Dishes ({dishes.length})
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{dishes.map((dish) => (
					<div
						key={`${dish.id}-${dish.restaurantId}`}
						className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
					>
						<div className="relative h-40 overflow-hidden">
							<img
								src={dish.menu_items.image_url}
								alt={dish.menu_items.name}
								className="w-full h-full object-cover"
							/>
							<div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
								${dish.menu_items.price?.toFixed(2)}
							</div>
						</div>
						<div className="p-4">
							<h3 className="font-semibold text-lg mb-1">
								{dish.menu_items.name}
							</h3>
							{dish.menu_items.description && (
								<p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
									{dish.menu_items.description}
								</p>
							)}
							<div className="flex items-center justify-between gap-2">
								<button
									onClick={() => handleAddToCart(dish.menu_items)}
									disabled={isAddingToCart}
									className={`flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors ${
										isAddingToCart ? "cursor-not-allowed opacity-50" : ""
									}`}
								>
									Add to Cart
								</button>
								<button
									onClick={() => handleRemoveDish(dish.menu_items)}
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
	);
};

export default FavoriteDishes;
