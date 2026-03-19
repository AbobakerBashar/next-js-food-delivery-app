import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

function mapMenuItem(row) {
	if (!row) return null;
	return {
		id: row.id,
		restaurantId: row.restaurant_id,
		name: row.name,
		description: row.description,
		price: Number(row.price),
		category: row.category,
		imageUrl: row.image_url,
		popular: row.popular,
	};
}

// --------------------------------------------------
// useGetMenuItemsByRestaurantId
// --------------------------------------------------
export function useGetMenuItemsByRestaurantId(restaurantId) {
	return useQuery({
		queryKey: ["menu-items", restaurantId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("menu_items")
				.select("*")
				.eq("restaurant_id", restaurantId);

			if (error) throw error;
			return data;
		},
		enabled: !!restaurantId,
	});
}

// --------------------------------------------------
// useGetMenuItemById
// --------------------------------------------------
export function useGetMenuItemById(id) {
	return useQuery({
		queryKey: ["menu-item", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("menu_items")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;
			return data;
		},
		enabled: !!id,
	});
}

// --------------------------------------------------
// useGetMenuCategories
// --------------------------------------------------
export function useGetMenuCategories() {
	return useQuery({
		queryKey: ["menu-categories"],
		queryFn: async () => {
			const { data, error } = await supabase.rpc("get_menu_categories");

			if (error) throw error;
			return data;
		},
	});
}

/**
 * Fetch popular dishes across all restaurants
 */
export async function getPopularDishes(limit = 8) {
	const { data, error } = await supabase
		.from("menu_items")
		.select("*, restaurants(name)")
		.eq("popular", true)
		.limit(limit);

	if (error) throw error;
	return data.map((item) => ({
		...mapMenuItem(item),
		restaurantName: item.restaurants?.name,
	}));
}
