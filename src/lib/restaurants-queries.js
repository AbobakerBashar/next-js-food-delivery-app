import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch all restaurants with optional search, cuisine filter, and sorting
 */
export async function getRestaurants({ search, cuisine, sortBy } = {}) {
	let query = supabase.from("restaurants").select("*");

	if (search) {
		query = query.or(`name.ilike.%${search}%,cuisine.ilike.%${search}%`);
	}

	if (cuisine && cuisine !== "All") {
		query = query.eq("cuisine", cuisine);
	}

	switch (sortBy) {
		case "rating":
			query = query.order("rating", { ascending: false });
			break;
		case "deliveryTime":
			query = query.order("delivery_time", { ascending: true });
			break;
		case "deliveryFee":
			query = query.order("delivery_fee", { ascending: true });
			break;
		case "name":
			query = query.order("name", { ascending: true });
			break;
		default:
			query = query.order("rating", { ascending: false });
	}

	const { data, error } = await query;
	if (error) throw error;

	return data.map(mapRestaurant);
}

// -----------------------------
// useGetRestaurants
// -----------------------------

// export async function getRestaurants() {
// 	const { data, error } = await supabase.from("restaurants").select("*");

// 	if (error) throw error;
// 	return data.map(mapRestaurant);
// }

export function useGetRestaurants() {
	return useQuery({
		queryKey: ["restaurants"],
		queryFn: async () => {
			const { data, error } = await supabase.from("restaurants").select("*");

			if (error) throw error;
			return data;
		},
	});
}

// -----------------------------
// useGetRestaurantById
// -----------------------------
export function useGetRestaurantById(id) {
	return useQuery({
		queryKey: ["restaurant", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("restaurants")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;
			return data;
		},
		enabled: !!id,
	});
}

/**
 * Fetch top-rated restaurants (featured)
 */
export async function getFeaturedRestaurants(limit = 3) {
	const { data, error } = await supabase
		.from("restaurants")
		.select("*")
		.order("rating", { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data.map(mapRestaurant);
}

// -----------------------------
// useGetUniqueCuisines
// -----------------------------
export function useGetUniqueCuisines() {
	return useQuery({
		queryKey: ["unique-cuisines"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_unique_cuisines");

			if (error) throw error;
			return data;
		},
	});
}

// Raw functions for server components
function mapRestaurant(row) {
	if (!row) return null;
	return {
		id: row.id,
		name: row.name,
		cuisine: row.cuisine,
		rating: Number(row.rating),
		deliveryTime: row.delivery_time,
		deliveryFee: Number(row.delivery_fee),
		minOrder: Number(row.min_order),
		imageUrl: row.image_url,
		image: row.image_url, // alias for backward compatibility
	};
}
