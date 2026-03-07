import Link from "next/link";
import { Star, Clock, DollarSign, ArrowLeft } from "lucide-react";
import { getRestaurantById, getMenuItemsByRestaurantId } from "@/lib/queries";
import { MenuItemCard } from "@/components/MenuItemCard";

export default async function RestaurantPage({ params }) {
	const { id } = await params;

	let restaurant = null;
	let items = [];

	try {
		restaurant = await getRestaurantById(parseInt(id));
		items = await getMenuItemsByRestaurantId(parseInt(id));
	} catch (error) {
		// Restaurant not found
	}

	if (!restaurant) {
		return (
			<div className="container mx-auto px-4 py-8">
				<p className="text-center text-gray-500 dark:text-gray-400">
					Restaurant not found
				</p>
			</div>
		);
	}

	const categories = [...new Set(items.map((item) => item.category))];

	return (
		<div className="pb-8">
			{/* Restaurant Header */}
			<div className="relative h-64 bg-gray-200">
				<img
					src={restaurant.imageUrl}
					alt={restaurant.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
			</div>

			<div className="container mx-auto px-4">
				<div className="relative -mt-16 mb-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-full mb-4 hover:bg-black/70 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Restaurants
					</Link>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg transition-colors">
						<h1 className="text-4xl mb-2">{restaurant.name}</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							{restaurant.cuisine}
						</p>

						<div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
							<div className="flex items-center gap-2">
								<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
								<span>{restaurant.rating} Rating</span>
							</div>

							<div className="flex items-center gap-2">
								<Clock className="w-5 h-5" />
								<span>{restaurant.deliveryTime} min</span>
							</div>

							<div className="flex items-center gap-2">
								<DollarSign className="w-5 h-5" />
								<span>${restaurant.deliveryFee} Delivery</span>
							</div>
						</div>

						{restaurant.minOrder && (
							<p className="text-gray-500 dark:text-gray-400 mt-4">
								Minimum order: ${restaurant.minOrder}
							</p>
						)}
					</div>
				</div>

				{/* Menu Items by Category */}
				<div className="space-y-10">
					{categories.map((category) => (
						<div key={category}>
							<div className="flex items-center gap-3 mb-5">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
									{category}
								</h2>
								<span className="text-sm text-gray-400 dark:text-gray-500 font-medium">
									{items.filter((item) => item.category === category).length}{" "}
									items
								</span>
								<div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
							</div>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
								{items
									.filter((item) => item.category === category)
									.map((item) => (
										<MenuItemCard
											key={item.id}
											item={item}
											imageUrl={item.imageUrl}
										/>
									))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
