import { supabase } from "./supabase";

/**
 * Get current user
 */
export async function getCurrentUser() {
	const { data, error } = await supabase.auth.getUser();
	if (error) throw error;
	return data.user;
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

// Go with Google OAuth
export async function signInWithGoogle() {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${window.location.origin}/callback`,
		},
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
