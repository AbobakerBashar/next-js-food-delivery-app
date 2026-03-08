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
	const { error } = await supabase.auth.signOut();
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
export async function getProfile(userId) {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	if (!data) return null;
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		phone: data.phone || "",
		avatar: data.avatar_url || "",
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
		.eq("id", userId)
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
	const { error } = await supabase
		.from("addresses")
		.delete()
		.eq("id", addressId);

	if (error) throw error;
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
		paymentMethodId,
		subtotal,
		deliveryFee,
		tax,
		total,
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
	const { data: order, error: orderError } = await supabase
		.from("orders")
		.select("*, order_items(*)")
		.eq("id", orderId)
		.single();

	if (orderError) throw orderError;

	return {
		...mapOrder(order),
		items: order.order_items.map((item) => ({
			id: item.menu_item_id,
			restaurantId: item.restaurant_id,
			name: item.name,
			price: Number(item.price),
			quantity: item.quantity,
			imageUrl: item.image_url,
		})),
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
