"use client";

import { useAddToCart } from "@/hooks/useCart";
import {
	useAddFavoriteDish,
	useGetFavoriteDishes,
	useRemoveFavoriteDish,
} from "@/hooks/useFavorits";
import { useCurrentUser } from "@/hooks/useUser";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function MenuItemCard({ item, imageUrl }) {
	const { mutateAsync: addToCartAsync, isPending: isAddingToCart } =
		useAddToCart();

	const { data: user } = useCurrentUser();

	const { data: dishes, isLoading: isLoadingDishes } = useGetFavoriteDishes(
		user?.id,
	);

	const { mutateAsync: addFavoriteDish, isPending: isAddingDish } =
		useAddFavoriteDish();

	const { mutateAsync: removeFavoriteDish, isPending: isRemovingDish } =
		useRemoveFavoriteDish();

	const isFavorite = dishes?.some((d) => d.menu_item_id === item.id);

	// Toggle favorite status of the dish
	const handleToggleFavorite = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			toast.error("You must be logged in to manage favorites");
			return;
		}
		try {
			if (!isFavorite)
				await addFavoriteDish({ userId: user.id, menuId: item.id });
			else await removeFavoriteDish({ userId: user.id, menuId: item.id });
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	};

	const handleAddToCart = async () => {
		if (!user) {
			toast.error("You must be logged in to add to cart");
			return;
		}
		try {
			await addToCartAsync({
				userId: user.id,
				item,
			});
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};

	return (
		<div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-row h-44">
			{/* Image Section */}
			<Link
				href={`/menu/${item.id}`}
				className="w-44 shrink-0 relative overflow-hidden block"
			>
				<img
					src={imageUrl}
					alt={item.name}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
				<div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent" />
				<button
					onClick={handleToggleFavorite}
					disabled={isAddingDish || isRemovingDish}
					type="button"
					className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-900 transition-all shadow-md hover:scale-110"
					aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
				>
					<Heart
						className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-400"}`}
					/>
				</button>

				{/* Price Badge */}
				<div className="absolute bottom-3 left-3 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
					${item.price.toFixed(2)}
				</div>
			</Link>

			{/* Content Section */}
			<div className="flex-1 p-5 flex flex-col justify-between min-w-0">
				<div>
					<div className="flex items-start justify-between gap-2">
						<Link
							href={`/menu/${item.id}`}
							className="font-semibold text-gray-900 dark:text-white text-base leading-tight truncate hover:text-orange-500 transition-colors"
						>
							{item.name}
						</Link>
						{item.popular && (
							<span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
								Popular
							</span>
						)}
					</div>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
						{item.description}
					</p>
				</div>

				<button
					onClick={handleAddToCart}
					className="mt-3 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-sm font-medium rounded-xl py-2.5 transition-all duration-200"
				>
					<ShoppingBag className="w-4 h-4" />
					Add to Cart
				</button>
			</div>
		</div>
	);
}
