"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFeaturedRestaurants, getPopularDishes } from "@/lib/queries";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedRestaurants } from "@/components/FeaturedRestaurants";
import { PopularDishes } from "@/components/PopularDishes";

export default function HomePage() {
	const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
	const [popularDishes, setPopularDishes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([getFeaturedRestaurants(3), getPopularDishes(9)])
			.then(([restaurants, dishes]) => {
				setFeaturedRestaurants(restaurants);
				setPopularDishes(dishes);
			})
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	return (
		<div>
			<HeroSection />

			<div className="container mx-auto px-4 py-12 transition-colors">
				<CategoryGrid />
				<FeaturedRestaurants
					restaurants={featuredRestaurants}
					loading={loading}
				/>
				<PopularDishes dishes={popularDishes} loading={loading} />

				{/* View All Restaurants CTA */}
				<div className="text-center py-8">
					<Link
						href="/restaurants"
						className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg transition-colors"
					>
						View All Restaurants
						<ArrowRight className="w-5 h-5" />
					</Link>
				</div>
			</div>
		</div>
	);
}
