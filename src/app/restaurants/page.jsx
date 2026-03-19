import { Suspense } from "react";
import RestaurantsContent from "./RestaurantsContent";
import { getRestaurants } from "@/lib/restaurants-queries";

export default async function RestaurantsPage() {
	const allRestaurants = await getRestaurants();

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
			<RestaurantsContent allRestaurants={allRestaurants} />
		</Suspense>
	);
}
