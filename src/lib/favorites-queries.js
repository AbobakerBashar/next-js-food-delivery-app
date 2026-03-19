import { supabase } from "@/lib/supabase";

//
// ─────────────────────────────────────────────
//   RESTAURANT FAVORITES
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// Get Favorite Restaurants
// --------------------------------------------------
export async function getFavoriteRestaurants(userId) {
	const { data, error } = await supabase
		.from("favorites_restaurants")
		.select("*, restaurants(*)")
		.eq("user_id", userId);

	if (error) throw error;
	return data;
}

// --------------------------------------------------
// Add Favorite Restaurant
// --------------------------------------------------
export async function addFavoriteRestaurant(userId, restaurantId) {
	const { data, error } = await supabase
		.from("favorites_restaurants")
		.insert({
			user_id: userId,
			restaurant_id: restaurantId,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

// --------------------------------------------------
// Remove Favorite Restaurant
// --------------------------------------------------
export async function removeFavoriteRestaurant(userId, restaurantId) {
	const { data, error } = await supabase
		.from("favorites_restaurants")
		.delete()
		.eq("user_id", userId)
		.eq("restaurant_id", restaurantId);

	if (error) throw error;
	return data;
}

//
// ─────────────────────────────────────────────
//   DISH FAVORITES
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// Get Favorite Dishes
// --------------------------------------------------
export async function getFavoriteDishes(userId) {
	const { data, error } = await supabase
		.from("favorites_dishes")
		.select("*, menu_items(*)")
		.eq("user_id", userId);

	if (error) throw error;
	return data;
}

// --------------------------------------------------
// Add Favorite Dish
// --------------------------------------------------
export async function addFavoriteDish(userId, dishId) {
	const { data, error } = await supabase
		.from("favorites_dishes")
		.insert({
			user_id: userId,
			menu_item_id: dishId,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

// --------------------------------------------------
// Remove Favorite Dish
// --------------------------------------------------
export async function removeFavoriteDish(userId, dishId) {
	const { data, error } = await supabase
		.from("favorites_dishes")
		.delete()
		.eq("user_id", userId)
		.eq("menu_item_id", dishId);

	if (error) throw error;
	return data;
}
