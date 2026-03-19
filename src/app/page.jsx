import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedRestaurants } from "@/components/home/FeaturedRestaurants";
import { HeroSection } from "@/components/home/HeroSection";
import { PopularDishes } from "@/components/home/PopularDishes";
// import { getFeaturedRestaurants, getPopularDishes } from "@/lib/queries";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<div>
			<HeroSection />

			<div className="container mx-auto px-4 py-12 transition-colors">
				<CategoryGrid />
				<FeaturedRestaurants />
				<PopularDishes />

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
