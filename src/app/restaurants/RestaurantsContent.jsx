"use client";

import { RestaurantCard } from "@/components/home/RestaurantCard";
import { useSearchParams } from "next/navigation";
import CuisinesTabs from "./CuisinesTabs";
import SortDropdown from "./SortDropdown";

const sortOptions = [
	{ value: "rating", label: "Top Rated" },
	{ value: "deliveryTime", label: "Fastest Delivery" },
	{ value: "deliveryFee", label: "Lowest Fee" },
	{ value: "name", label: "Name A-Z" },
];

export default function RestaurantsContent({ allRestaurants }) {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("q") || "";
	const selectedCuisine = searchParams.get("cuisine") || "All";
	const sortBy = searchParams.get("sortBy") || "rating";

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
			<div className="flex flex-col items-center md:items-start gap-4 mb-8 ">
				{/* Cuisine Filter */}
				<CuisinesTabs
					cuisines={cuisines}
					selectedCuisine={selectedCuisine}
					sortBy={sortBy}
				/>

				{/* Sort Dropdown */}
				<SortDropdown
					sortBy={sortBy}
					sortOptions={sortOptions}
					cuisine={selectedCuisine}
				/>
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
