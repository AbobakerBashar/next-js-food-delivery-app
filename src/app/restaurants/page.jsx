"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { RestaurantCard } from "@/components/home/RestaurantCard";
import { getRestaurants } from "@/lib/queries";
import { SlidersHorizontal } from "lucide-react";

const sortOptions = [
	{ value: "rating", label: "Top Rated" },
	{ value: "deliveryTime", label: "Fastest Delivery" },
	{ value: "deliveryFee", label: "Lowest Fee" },
	{ value: "name", label: "Name A-Z" },
];

export default function RestaurantsPage() {
	return (
		<Suspense
			fallback={
				<div className="container mx-auto px-4 py-16 text-center">
					<div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-gray-500 dark:text-gray-400">
						Loading restaurants...
					</p>
				</div>
			}
		>
			<RestaurantsContent />
		</Suspense>
	);
}

function RestaurantsContent() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("q") || "";
	const initialCuisine = searchParams.get("cuisine") || "All";

	const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
	const [sortBy, setSortBy] = useState("rating");
	const [allRestaurants, setAllRestaurants] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getRestaurants()
			.then((data) => setAllRestaurants(data))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	const cuisines = ["All", ...new Set(allRestaurants.map((r) => r.cuisine))];

	const filteredRestaurants = allRestaurants
		.filter((restaurant) => {
			const matchesSearch =
				restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCuisine =
				selectedCuisine === "All" || restaurant.cuisine === selectedCuisine;
			return matchesSearch && matchesCuisine;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "rating":
					return b.rating - a.rating;
				case "deliveryTime":
					return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
				case "deliveryFee":
					return a.deliveryFee - b.deliveryFee;
				case "name":
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				<div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
				<p className="text-gray-500 dark:text-gray-400">
					Loading restaurants...
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-4xl mb-2">All Restaurants</h1>
				<p className="text-gray-500 dark:text-gray-400">
					{filteredRestaurants.length} restaurant
					{filteredRestaurants.length !== 1 ? "s" : ""} available
				</p>
			</div>

			{/* Filters & Sort Row */}
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				{/* Cuisine Filter */}
				<div className="flex gap-2 overflow-x-auto pb-2 flex-1">
					{cuisines.map((cuisine) => (
						<button
							key={cuisine}
							onClick={() => setSelectedCuisine(cuisine)}
							className={`px-5 py-2 rounded-full whitespace-nowrap transition-colors text-sm ${
								selectedCuisine === cuisine
									? "bg-orange-500 text-white"
									: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
							}`}
						>
							{cuisine}
						</button>
					))}
				</div>

				{/* Sort Dropdown */}
				<div className="flex items-center gap-2 shrink-0">
					<SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-orange-500 transition-colors"
					>
						{sortOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Restaurant Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredRestaurants.map((restaurant) => (
					<RestaurantCard
						key={restaurant.id}
						restaurant={restaurant}
						imageUrl={restaurant.imageUrl}
					/>
				))}
			</div>

			{filteredRestaurants.length === 0 && (
				<div className="text-center py-16">
					<p className="text-gray-400 dark:text-gray-500 text-xl mb-2">
						No restaurants found
					</p>
					<p className="text-gray-400 dark:text-gray-500 text-sm">
						Try adjusting your search or filters.
					</p>
				</div>
			)}
		</div>
	);
}
