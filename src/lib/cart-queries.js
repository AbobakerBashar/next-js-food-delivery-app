import { supabase } from "@/lib/supabase";

// ----------------------------------------------
// GET CART
// ----------------------------------------------
/**
 * Fetch all cart items for a user
 */
export async function getCart(userId) {
	const { data, error } = await supabase
		.from("cart_items")
		.select(
			"*, menu_items(name, description, price, image_url), restaurants(name)",
		)
		.eq("user_id", userId);

	if (error) throw error;

	return data.map((item) => ({
		id: item.menu_item_id,
		restaurantId: item.restaurant_id,
		name: item.menu_items?.name,
		description: item.menu_items?.description,
		price: Number(item.menu_items?.price),
		quantity: item.quantity,
		imageUrl: item.menu_items?.image_url,
		restaurantName: item.restaurants?.name,
		cartItemId: item.id,
	}));
}

// ----------------------------------------------
// ADD TO CART
// ----------------------------------------------
/**
 * Add item to cart (upsert — increments quantity if exists)
 */
export async function addToCart(
	userId,
	{ itemId, restaurantId, quantity = 1 },
) {
	// Check if item already exists in cart
	const { data: existing } = await supabase
		.from("cart_items")
		.select("id, quantity")
		.eq("user_id", userId)
		.eq("menu_item_id", itemId)
		.eq("restaurant_id", restaurantId)
		.maybeSingle();

	if (existing) {
		const { data, error } = await supabase
			.from("cart_items")
			.update({ quantity: existing.quantity + quantity })
			.eq("id", existing.id)
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	const { data, error } = await supabase
		.from("cart_items")
		.insert({
			user_id: userId,
			menu_item_id: itemId,
			restaurant_id: restaurantId,
			quantity,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

// ----------------------------------------------
// UPDATE CART QUANTITY
// ----------------------------------------------
/**
 * Update cart item quantity (removes if quantity <= 0)
 */
export async function updateCartQuantity(
	userId,
	itemId,
	restaurantId,
	quantity,
) {
	if (quantity <= 0) {
		return removeCartItem(userId, itemId, restaurantId);
	}

	const { data, error } = await supabase
		.from("cart_items")
		.update({ quantity })
		.eq("user_id", userId)
		.eq("menu_item_id", itemId)
		.eq("restaurant_id", restaurantId)
		.select()
		.single();

	if (error) {
		console.error("Failed to update cart quantity:", error);
		throw error;
	}
	return data;
}

// ----------------------------------------------
// REMOVE CART ITEM
// ----------------------------------------------
/**
 * Remove a single item from cart
 */
export async function removeCartItem(userId, itemId, restaurantId) {
	const { error } = await supabase
		.from("cart_items")
		.delete()
		.eq("user_id", userId)
		.eq("menu_item_id", itemId)
		.eq("restaurant_id", restaurantId);

	if (error) throw error;
}

/**
 * Clear all items from cart
 */
export async function clearCart(userId) {
	const { error } = await supabase
		.from("cart_items")
		.delete()
		.eq("user_id", userId);

	if (error) throw error;
}
