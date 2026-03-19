import { supabase } from "./supabase";

// ============================================================
// RESTAURANTS
// ============================================================

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

/**
 * Fetch a single restaurant by ID
 */
export async function getRestaurantById(id) {
	const { data, error } = await supabase
		.from("restaurants")
		.select("*")
		.eq("id", id)
		.single();

	if (error) throw error;
	return mapRestaurant(data);
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

/**
 * Fetch all unique cuisines from restaurants
 */
export async function getUniqueCuisines() {
	const { data, error } = await supabase.from("restaurants").select("cuisine");

	if (error) throw error;

	const cuisines = [...new Set(data.map((r) => r.cuisine))];
	return ["All", ...cuisines.sort()];
}

// ============================================================
// MENU ITEMS
// ============================================================

/**
 * Fetch all menu items for a restaurant
 */
export async function getMenuItemsByRestaurantId(restaurantId) {
	const { data, error } = await supabase
		.from("menu_items")
		.select("*")
		.eq("restaurant_id", restaurantId)
		.order("category")
		.order("name");

	if (error) throw error;
	return data.map(mapMenuItem);
}

/**
 * Fetch a single menu item by ID (with restaurant name)
 */
export async function getMenuItemById(id) {
	const { data, error } = await supabase
		.from("menu_items")
		.select("*, restaurants(name, cuisine)")
		.eq("id", id)
		.single();

	if (error) throw error;
	return {
		...mapMenuItem(data),
		restaurantName: data.restaurants?.name,
		restaurantCuisine: data.restaurants?.cuisine,
	};
}

/**
 * Fetch distinct menu categories for a restaurant
 */
export async function getMenuCategories(restaurantId) {
	const { data, error } = await supabase
		.from("menu_items")
		.select("category")
		.eq("restaurant_id", restaurantId);

	if (error) throw error;
	return [...new Set(data.map((item) => item.category))];
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

// ============================================================
// CART (per user)
// ============================================================

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

// ============================================================
// FAVORITES (per user)
// ============================================================

/**
 * Get all favorite restaurants for a user
 */
export async function getFavoriteRestaurants(userId) {
	const { data, error } = await supabase
		.from("favorites")
		.select("*, restaurants(*)")
		.eq("user_id", userId)
		.eq("item_type", "restaurant");

	if (error) throw error;

	return data.map((fav) => ({
		...mapRestaurant(fav.restaurants),
		favoriteId: fav.id,
	}));
}

/**
 * Get all favorite dishes for a user
 */
export async function getFavoriteDishes(userId) {
	const { data, error } = await supabase
		.from("favorites")
		.select("*, menu_items(*, restaurants(name))")
		.eq("user_id", userId)
		.eq("item_type", "dish");

	if (error) throw error;

	return data.map((fav) => ({
		...mapMenuItem(fav.menu_items),
		restaurantName: fav.menu_items?.restaurants?.name,
		favoriteId: fav.id,
	}));
}

/**
 * Toggle a restaurant favorite (add if not favorited, remove if favorited)
 */
export async function toggleFavoriteRestaurant(userId, restaurantId) {
	const { data: existing } = await supabase
		.from("favorites")
		.select("id")
		.eq("user_id", userId)
		.eq("item_type", "restaurant")
		.eq("restaurant_id", restaurantId)
		.maybeSingle();

	if (existing) {
		const { error } = await supabase
			.from("favorites")
			.delete()
			.eq("id", existing.id);
		if (error) throw error;
		return { action: "removed" };
	}

	const { error } = await supabase.from("favorites").insert({
		user_id: userId,
		item_type: "restaurant",
		restaurant_id: restaurantId,
	});
	if (error) throw error;
	return { action: "added" };
}

/**
 * Toggle a dish favorite
 */
export async function toggleFavoriteDish(userId, dishId, restaurantId) {
	const { data: existing } = await supabase
		.from("favorites")
		.select("id")
		.eq("user_id", userId)
		.eq("item_type", "dish")
		.eq("menu_item_id", dishId)
		.eq("restaurant_id", restaurantId)
		.maybeSingle();

	if (existing) {
		const { error } = await supabase
			.from("favorites")
			.delete()
			.eq("id", existing.id);
		if (error) throw error;
		return { action: "removed" };
	}

	const { error } = await supabase.from("favorites").insert({
		user_id: userId,
		item_type: "dish",
		menu_item_id: dishId,
		restaurant_id: restaurantId,
	});
	if (error) throw error;
	return { action: "added" };
}

/**
 * Check if a restaurant is favorited
 */
export async function isFavoriteRestaurant(userId, restaurantId) {
	const { data, error } = await supabase
		.from("favorites")
		.select("id")
		.eq("user_id", userId)
		.eq("item_type", "restaurant")
		.eq("restaurant_id", restaurantId)
		.maybeSingle();

	if (error) throw error;
	return !!data;
}

/**
 * Check if a dish is favorited
 */
export async function isFavoriteDish(userId, dishId, restaurantId) {
	const { data, error } = await supabase
		.from("favorites")
		.select("id")
		.eq("user_id", userId)
		.eq("item_type", "dish")
		.eq("menu_item_id", dishId)
		.eq("restaurant_id", restaurantId)
		.maybeSingle();

	if (error) throw error;
	return !!data;
}

/**
 * Get total favorites count for a user
 */
export async function getFavoritesCount(userId) {
	const { count, error } = await supabase
		.from("favorites")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId);

	if (error) throw error;
	return count || 0;
}

// ============================================================
// AUTH & PROFILE
// ============================================================

/**
 * Sign up a new user with Supabase Auth + create profile
 */
export async function signUp(name, email, password) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: { name },
		},
	});

	if (error) throw error;

	// Create profile record
	if (data.user) {
		const { error: profileError } = await supabase.from("profiles").insert({
			id: data.user.id,
			name,
			email,
			phone: "",
			avatar_url: "",
		});
		if (profileError) throw profileError;
	}

	return data;
}

/**
 *
 * Go with Google OAuth */

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;
	return data;
}

/**
 * Sign out
 */
export async function signOut() {
	const { error } = await supabase.auth.signOut({ scope: "global" });
	if (error) throw error;
}

/**
 * Get current session
 */
export async function getSession() {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	return data.session;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
	const { data, error } = await supabase.auth.getUser();
	if (error) throw error;
	return data.user;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback) {
	const {
		data: { subscription },
	} = supabase.auth.onAuthStateChange((_event, session) => {
		callback(session);
	});
	return subscription;
}

// ============================================================
// PROFILES
// ============================================================

/**
 * Fetch user profile by ID
 */

// All profiles

export async function getProfile(userId) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	if (!data) return null;
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone || "",
		avatar_url: data.avatar || "",
		role: data.role || "user",
	};
}

/**
 * Update user profile
 */
export async function updateProfile(userId, { name, email, phone }) {
	const updates = {};
	if (name !== undefined) updates.name = name;
	if (email !== undefined) updates.email = email;
	if (phone !== undefined) updates.phone = phone;

	const { data, error } = await supabase
		.from("profiles")
		.update(updates)
		.eq("user_id", userId)
		.select()
		.single();

	if (error) throw error;
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone || "",
		avatar: data.avatar_url || "",
	};
}

// Update avatar URL
export const updateAvatar = async (newAvatar, userId) => {
	if (!newAvatar) return;
	try {
		const ext = newAvatar.name.split(".").pop();
		const uniqueName = `${userId}-${crypto.randomUUID()}.${ext}`;

		const { data, error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(`${uniqueName}`, newAvatar);

		if (uploadError) {
			console.error("Avatar upload error:", uploadError);
			throw uploadError;
		}

		const { data: urlData } = await supabase.storage
			.from("avatars")
			.getPublicUrl(uniqueName);

		const avatar = urlData.publicUrl;

		const { data: insetData, error: updateError } = await supabase
			.from("profiles")
			.update({ avatar })
			.eq("user_id", userId)
			.select()
			.single();
		if (updateError) {
			console.error("Profile update error:", updateError);
			throw updateError;
		}
		return insetData;
	} catch (error) {
		console.error("Error in updateAvatar:", error);
		throw error;
	}
};

// ============================================================
// ADDRESSES (per user)
// ============================================================

/**
 * Fetch all addresses for a user
 */
export async function getAddresses(userId) {
	const { data, error } = await supabase
		.from("addresses")
		.select("*")
		.eq("user_id", userId)
		.order("is_default", { ascending: false })
		.order("created_at", { ascending: false });

	if (error) throw error;

	return data.map((addr) => ({
		id: addr.id,
		label: addr.label,
		street: addr.street,
		city: addr.city,
		state: addr.state,
		zip: addr.zip,
		isDefault: addr.is_default,
	}));
}

/**
 * Add a new address
 */
export async function addAddress(
	userId,
	{ label, street, city, state, zip, isDefault = false },
) {
	// If setting as default, unset other defaults first
	if (isDefault) {
		await supabase
			.from("addresses")
			.update({ is_default: false })
			.eq("user_id", userId);
	}

	const { data, error } = await supabase
		.from("addresses")
		.insert({
			user_id: userId,
			label,
			street,
			city,
			state,
			zip,
			is_default: isDefault,
		})
		.select()
		.single();

	if (error) throw error;
	return {
		id: data.id,
		label: data.label,
		street: data.street,
		city: data.city,
		state: data.state,
		zip: data.zip,
		isDefault: data.is_default,
	};
}

/**
 * Update an address
 */
export async function updateAddress(addressId, updates) {
	const dbUpdates = {};
	if (updates.label !== undefined) dbUpdates.label = updates.label;
	if (updates.street !== undefined) dbUpdates.street = updates.street;
	if (updates.city !== undefined) dbUpdates.city = updates.city;
	if (updates.state !== undefined) dbUpdates.state = updates.state;
	if (updates.zip !== undefined) dbUpdates.zip = updates.zip;

	const { data, error } = await supabase
		.from("addresses")
		.update(dbUpdates)
		.eq("id", addressId)
		.select()
		.single();

	if (error) throw error;
	return {
		id: data.id,
		label: data.label,
		street: data.street,
		city: data.city,
		state: data.state,
		zip: data.zip,
		isDefault: data.is_default,
	};
}

/**
 * Remove an address
 */
export async function removeAddress(addressId) {
	try {
		const { error } = await supabase
			.from("addresses")
			.delete()
			.eq("id", addressId);

		if (error) throw error;
	} catch (error) {
		console.error("Failed to remove address:", error);
		throw error;
	}
}

/**
 * Set an address as default (unsets all others for the user)
 */
export async function setDefaultAddress(userId, addressId) {
	// Unset all defaults
	await supabase
		.from("addresses")
		.update({ is_default: false })
		.eq("user_id", userId);

	// Set the chosen one
	const { error } = await supabase
		.from("addresses")
		.update({ is_default: true })
		.eq("id", addressId);

	if (error) throw error;
}

// ============================================================
// PAYMENT METHODS (per user)
// ============================================================

/**
 * Fetch all payment methods for a user
 */
export async function getPaymentMethods(userId) {
	const { data, error } = await supabase
		.from("payment_methods")
		.select("*")
		.eq("user_id", userId)
		.order("is_default", { ascending: false })
		.order("created_at", { ascending: false });

	if (error) throw error;

	return data.map((pm) => ({
		id: pm.id,
		type: pm.type,
		last4: pm.last4,
		expiry: pm.expiry,
		isDefault: pm.is_default,
	}));
}

/**
 * Add a new payment method
 */
export async function addPaymentMethod(
	userId,
	{ type, last4, expiry, isDefault = false },
) {
	if (isDefault) {
		await supabase
			.from("payment_methods")
			.update({ is_default: false })
			.eq("user_id", userId);
	}

	const { data, error } = await supabase
		.from("payment_methods")
		.insert({
			user_id: userId,
			type,
			last4,
			expiry,
			is_default: isDefault,
		})
		.select()
		.single();

	if (error) throw error;
	return {
		id: data.id,
		type: data.type,
		last4: data.last4,
		expiry: data.expiry,
		isDefault: data.is_default,
	};
}

/**
 * Remove a payment method
 */
export async function removePaymentMethod(paymentId) {
	const { error } = await supabase
		.from("payment_methods")
		.delete()
		.eq("id", paymentId);

	if (error) throw error;
}

/**
 * Set a payment method as default
 */
export async function setDefaultPayment(userId, paymentId) {
	await supabase
		.from("payment_methods")
		.update({ is_default: false })
		.eq("user_id", userId);

	const { error } = await supabase
		.from("payment_methods")
		.update({ is_default: true })
		.eq("id", paymentId);

	if (error) throw error;
}

// ============================================================
// ORDERS
// ============================================================

/**
 * Create a new order with its items
 */
export async function createOrder(
	userId,
	stripe_payment_id,
	{
		items,
		deliveryAddress,
		subtotal,
		deliveryFee,
		tax,
		total,
		deliveryCity,
		deliveryZipCode,
	},
) {
	// Create the order

	const { data: orders, error: ordersError } = await supabase
		.from("orders")
		.select("*")
		.eq("user_id", userId);

	if (ordersError) {
		console.error("Failed to fetch orders:", ordersError);
		throw new Error("Failed to fetch orders: " + ordersError.message);
	}

	const order_number = orders.length >= 0 ? orders.length + 1 : 1;

	const { data: order, error: orderError } = await supabase
		.from("orders")
		.insert({
			user_id: userId,
			status: "confirmed",
			delivery_address: deliveryAddress,
			delivery_city: deliveryCity,
			delivery_zip: deliveryZipCode,
			subtotal,
			delivery_fee: deliveryFee,
			tax,
			total,
			stripe_payment_id,
			order_number,
		})
		.select()
		.single();

	if (orderError) {
		console.error("Failed to create order:", orderError);
		throw new Error("Failed to create order: " + orderError.message);
	}

	// Create order items
	const orderItems = items.map((item) => ({
		order_id: order.id,
		menu_item_id: item.id,
		restaurant_id: item.restaurantId,
		name: item.name,
		price: item.price,
		quantity: item.quantity,
		image_url: item.imageUrl || null,
	}));

	const { error: itemsError } = await supabase
		.from("order_items")
		.insert(orderItems);

	if (itemsError) {
		console.error("Failed to create order items:", itemsError);
		throw new Error("Failed to create order items: " + itemsError.message);
	}

	return mapOrder(order);
}

/**
 * Fetch an order by ID with its items
 */
export async function getOrderById(orderId) {
	const { data, error } = await supabase
		.from("orders")
		.select(
			`
			*,
			order_items (
				id,
				name,
				price,
				quantity,
				image_url,
				menu_item_id,
				restaurant_id,
				restaurants(name)
			)
		`,
		)
		.eq("id", orderId)
		.single();

	if (error) throw error;

	return {
		...mapOrder(data),
		items:
			data.order_items?.map((item) => ({
				id: item.menu_item_id,
				restaurantId: item.restaurant_id,
				restaurantName: item.restaurants?.name || "Unknown",
				name: item.name,
				price: Number(item.price),
				quantity: item.quantity,
				imageUrl: item.image_url,
			})) || [],
		delivery_address: data.delivery_address,
	};
}

/**
 * Fetch all orders for a user
 */
export async function getOrdersByUser(userId) {
	const { data, error } = await supabase
		.from("orders")
		.select("*, order_items(*)")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) throw error;

	return data.map((order) => ({
		...mapOrder(order),
		items: order.order_items.map((item) => ({
			id: item.menu_item_id,
			restaurantId: item.restaurant_id,
			name: item.name,
			price: Number(item.price),
			quantity: item.quantity,
			imageUrl: item.image_url,
		})),
	}));
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status) {
	const { data, error } = await supabase
		.from("orders")
		.update({ status })
		.eq("id", orderId)
		.select()
		.single();
	console.log("Order status updated:", data);
	if (error) throw error;
	return mapOrder(data);
}

// ============================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================

/**
 * Subscribe to order status updates
 */
export function subscribeToOrderStatus(orderId, callback) {
	const subscription = supabase
		.channel(`order-${orderId}`)
		.on(
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "orders",
				filter: `id=eq.${orderId}`,
			},
			(payload) => {
				callback(mapOrder(payload.new));
			},
		)
		.subscribe();

	return () => {
		supabase.removeChannel(subscription);
	};
}

/**
 * Subscribe to cart changes for a user
 */
export function subscribeToCart(userId, callback) {
	const subscription = supabase
		.channel(`cart-${userId}`)
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
				table: "cart_items",
				filter: `user_id=eq.${userId}`,
			},
			() => {
				// Refetch full cart on any change
				getCart(userId).then(callback);
			},
		)
		.subscribe();

	return () => {
		supabase.removeChannel(subscription);
	};
}

// ============================================================
// STORAGE HELPERS
// ============================================================

/**
 * Get public URL for an image in Supabase Storage
 */
export function getImageUrl(path) {
	if (!path) return null;
	// If already a full URL, return as-is
	if (path.startsWith("http")) return path;

	const { data } = supabase.storage.from("images").getPublicUrl(path);
	return data.publicUrl;
}

// ============================================================
// MAPPING HELPERS (DB snake_case → app camelCase)
// ============================================================

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

function mapOrder(row) {
	if (!row) return null;
	return {
		id: row.id,
		userId: row.user_id,
		status: row.status,
		deliveryAddress: row.delivery_address,
		paymentMethodId: row.payment_method_id,
		subtotal: Number(row.subtotal),
		deliveryFee: Number(row.delivery_fee),
		tax: Number(row.tax),
		total: Number(row.total),
		createdAt: row.created_at,
	};
}

// ============================================================
// ADMIN QUERIES
// ============================================================

/**
 * Get admin dashboard stats
 */
export async function getAdminStats() {
	const [
		{ count: orderCount },
		{ count: restaurantCount },
		{ count: userCount },
		{ data: revenueData },
		{ data: avgRating },
		{ data: avgDeliveryTime },
	] = await Promise.all([
		supabase.from("orders").select("*", { count: "exact", head: true }),
		supabase.from("restaurants").select("*", { count: "exact", head: true }),
		supabase.from("profiles").select("*", { count: "exact", head: true }),
		supabase
			.from("orders")
			.select("sum(total)::numeric", { count: "exact", head: true }),
		supabase.from("restaurants").select("avg(rating)::numeric"),
		supabase.from("restaurants").select("avg(delivery_time)"),
	]);

	const totalRevenue = revenueData?.[0]?.sum || 0;
	const averageRating = avgRating?.[0]?.avg || 0;
	const averageDeliveryTime = avgDeliveryTime?.[0]?.avg || 0;

	return {
		orderCount: orderCount || 0,
		restaurantCount: restaurantCount || 0,
		userCount: userCount || 0,
		totalRevenue: parseFloat(totalRevenue),
		averageRating: parseFloat(averageRating).toFixed(1),
		averageDeliveryTime: Math.round(parseFloat(averageDeliveryTime)),
	};
}

/**
 * Get recent orders for admin (with basic item info)
 */
export async function getRecentOrders({ limit = 10, status } = {}) {
	let query = supabase
		.from("orders")
		.select(
			`
			*, 
			profiles(name),
			order_items!inner(name,quantity,price),
			restaurants(name)
		`,
		)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (status) {
		query = query.eq("status", status);
	}

	const { data, error } = await query;
	if (error) throw error;

	return data.map((order) => ({
		...mapOrder(order),
		userName: order.profiles?.name,
		restaurantName: order.restaurants?.name,
		itemCount: order.order_items?.length || 0,
		itemsPreview:
			order.order_items
				?.slice(0, 3)
				.map((item) => `${item.name} x${item.quantity}`) || [],
	}));
}

/**
 * Get all restaurants for admin view (with stats)
 */
export async function getAllRestaurantsAdmin({ limit = 50 } = {}) {
	const { data, error } = await supabase
		.from("restaurants")
		.select(
			`
			*, 
			count(orders.id) as order_count,
			sum(orders.total)::numeric as total_revenue
		`,
		)
		.limit(limit);

	if (error) throw error;
	return data.map((restaurant) => ({
		...mapRestaurant(restaurant),
		orderCount: parseInt(restaurant.order_count) || 0,
		totalRevenue: parseFloat(restaurant.total_revenue) || 0,
	}));
}

/**
 * Get all users for admin
 */
export async function getAllUsersAdmin({ limit = 50 } = {}) {
	const { data, error } = await supabase
		.from("profiles")
		.select(
			`
			*, 
			count(orders.id) as order_count
		`,
		)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) throw error;
	return data.map((profile) => ({
		id: profile.id,
		name: profile.name,
		email: profile.email,
		phone: profile.phone || "",
		orderCount: parseInt(profile.order_count) || 0,
		role: profile.role || "user",
		createdAt: profile.created_at,
	}));
}

/**
 * Update profile role (admin only)
 */
export async function updateUserRole(userId, role) {
	const { data, error } = await supabase
		.from("profiles")
		.update({ role })
		.eq("id", userId)
		.select()
		.single();

	if (error) throw error;
	return data;
}

// ============================================================
// Get Available Drivers
// ============================================================
export async function getAvailableDrivers() {
	try {
		const { data, error } = await supabase
			.from("drivers")
			.select("*")
			.eq("status", "available");

		return data;
	} catch (error) {
		console.log("Error fetching available drivers:", error);
		throw error;
	}
}

// ============================================================
// Update Driver Status
// ============================================================
export async function updateDriver(id, updates) {
	try {
		const { data, error } = await supabase
			.from("drivers")
			.update(updates)
			.eq("id", id);

		if (error) throw error;
		console.log("Driver updated:", data);
		return data;
	} catch (error) {
		console.log("Error updating driver status:", error);
		throw error;
	}
}

// ============================================================
// Create Delivery
// ============================================================
export async function createDelivery(delivery) {
	try {
		const { data, error } = await supabase.from("deliveries").insert(delivery);

		if (error) throw error;
		return data;
	} catch (error) {
		console.log("Create Delivery Error:", error.message);
	}
}
// ============================================================
// Update Delivery
// ============================================================
export async function updateDelivery(delivery) {
	try {
		const { data, error } = await supabase
			.from("deliveries")
			.update(delivery)
			.eq("id", delivery.id);

		if (error) throw error;
		return data;
	} catch (error) {
		console.log("Update Delivery Error:", error.message);
	}
}
// ============================================================
// Get Delivery
// ============================================================
export async function getDelivery(id) {
	try {
		const { data, error } = await supabase
			.from("deliveries")
			.select("*, drivers(*)")
			.eq("order_id", id)
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.log("Get Delivery Error:", error.message);
	}
}

// ============================================================
// Get Order Driver
// ============================================================
export async function getOrderDriver(orderId) {
	try {
		const { data, error } = await supabase
			.from("deliveries")
			.select("drivers(*)")
			.eq("order_id", orderId)
			.maybeSingle();

		if (error) throw error;
		return data?.drivers || data;
	} catch (error) {
		console.log("Get Order Driver Error:", error.message);
	}
}

// ============================================================
// Send Support Message
// ============================================================
export async function sendSupportMessage(sender_id, orderId, message) {
	try {
		const { data, error } = await supabase.from("support_messages").insert({
			order_id: orderId,
			message,
			sender_id,
		});

		if (error) throw error;
		return data;
	} catch (error) {
		console.log("Send Support Message Error:", error.message);
	}
}
