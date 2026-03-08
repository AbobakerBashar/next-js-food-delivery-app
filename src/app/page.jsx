import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedRestaurants } from "@/components/home/FeaturedRestaurants";
import { HeroSection } from "@/components/home/HeroSection";
import Loader from "@/components/home/Loader";
import { PopularDishes } from "@/components/home/PopularDishes";
import { getFeaturedRestaurants, getPopularDishes } from "@/lib/queries";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const getData = async () => {
	const [featuredRestaurants, popularDishes] = await Promise.all([
		getFeaturedRestaurants(3),
		getPopularDishes(9),
	]);
	return { featuredRestaurants, popularDishes };
};

export default async function HomePage() {
	const { featuredRestaurants, popularDishes } = await getData();
	// const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
	// const [popularDishes, setPopularDishes] = useState([]);
	// const [loading, setLoading] = useState(true);

	// useEffect(() => {
	// 	Promise.all([getFeaturedRestaurants(3), getPopularDishes(9)])
	// 		.then(([restaurants, dishes]) => {
	// 			setFeaturedRestaurants(restaurants);
	// 			setPopularDishes(dishes);
	// 		})
	// 		.catch(console.error)
	// 		.finally(() => setLoading(false));
	// }, []);

	return (
		<div>
			<HeroSection />

			<div className="container mx-auto px-4 py-12 transition-colors">
				<Suspense fallback={<Loader message="Lading Categories..." />}>
					<CategoryGrid />
				</Suspense>

				<Suspense
					fallback={<Loader message="Lading Featured Restaurants..." />}
				>
					<FeaturedRestaurants
						restaurants={featuredRestaurants}
						// loading={loading}
					/>
				</Suspense>
				<Suspense fallback={<Loader message="Lading Popular Dishes..." />}>
					<PopularDishes dishes={popularDishes} />
				</Suspense>

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
