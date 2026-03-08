"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, Clock } from "lucide-react";

export function FeaturedRestaurants({ restaurants }) {
	const [loading, setLoading] = useState();
	useEffect(() => {
		if (restaurants.length) setLoading(false);
		else setLoading(true);
	}, [restaurants]);
	if (!restaurants.length && !loading) return null;

	return (
		<section className="mb-14">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Star className="w-6 h-6 text-orange-500 fill-orange-500" />
					<h2 className="text-3xl">Featured Restaurants</h2>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{restaurants.map((restaurant) => (
					<Link
						key={restaurant.id}
						href={`/restaurant/${restaurant.id}`}
						className="group relative rounded-2xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-all"
					>
						<img
							src={restaurant.imageUrl}
							alt={restaurant.name}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
						<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
						<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
							<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
							<span className="text-sm font-semibold">{restaurant.rating}</span>
						</div>
						<div className="absolute bottom-0 left-0 right-0 p-5">
							<h3 className="text-white text-xl font-semibold mb-1">
								{restaurant.name}
							</h3>
							<div className="flex items-center gap-3 text-white/80 text-sm">
								<span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
									{restaurant.cuisine}
								</span>
								<span className="flex items-center gap-1">
									<Clock className="w-3.5 h-3.5" />
									{restaurant.deliveryTime} min
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
