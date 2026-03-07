"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Flame, Plus, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

export function PopularDishes({ dishes, loading }) {
	const scrollRef = useRef(null);
	const { addToCart } = useCart();
	const { toggleFavoriteDish, isDishFavorite } = useFavorites();

	const scroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = 240;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const handleAddToCart = (dish) => {
		addToCart(dish);
		toast.success(`${dish.name} added to cart!`);
	};

	const handleFavorite = (dish) => {
		const isFav = isDishFavorite(dish.id, dish.restaurantId);
		toggleFavoriteDish(dish, dish.imageUrl);
		toast.success(
			isFav
				? `${dish.name} removed from favorites`
				: `${dish.name} added to favorites`,
		);
	};

	if (!dishes.length && !loading) return null;

	return (
		<section className="mb-14">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Flame className="w-6 h-6 text-orange-500" />
					<h2 className="text-3xl">Popular Dishes</h2>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => scroll("left")}
						className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors shadow-sm"
						aria-label="Scroll left"
					>
						<ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
					</button>
					<button
						onClick={() => scroll("right")}
						className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-500 transition-colors shadow-sm"
						aria-label="Scroll right"
					>
						<ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
					</button>
				</div>
			</div>
			<div
				ref={scrollRef}
				className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent hover:scrollbar-thumb-orange-400"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#fdba74 transparent",
				}}
			>
				{dishes.map((dish) => (
					<div
						key={dish.id}
						className="snap-start shrink-0 w-56 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
					>
						<div className="relative h-40 overflow-hidden">
							<img
								src={dish.imageUrl}
								alt={dish.name}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							/>
							<button
								onClick={() => handleFavorite(dish)}
								className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md transition-all duration-200 hover:scale-110 ${
									isDishFavorite(dish.id, dish.restaurantId)
										? "opacity-100"
										: "opacity-0 group-hover:opacity-100"
								}`}
								aria-label="Toggle favorite"
							>
								<Heart
									className={`w-4 h-4 transition-colors ${
										isDishFavorite(dish.id, dish.restaurantId)
											? "fill-red-500 text-red-500"
											: "text-gray-500 dark:text-gray-400"
									}`}
								/>
							</button>
							<button
								onClick={() => handleAddToCart(dish)}
								className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-colors opacity-0 group-hover:opacity-100"
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
				))}
			</div>
		</section>
	);
}
