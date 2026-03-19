import { supabase } from "./supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// MAPPING HELPERS
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
		image: row.image_url,
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
		orderNumber: row.order_number,
	};
}

// ────────────────────────────────
// useGetAdminStats
// ────────────────────────────────
export function useGetAdminStats() {
	return useQuery({
		queryKey: ["adminStats"],
		queryFn: async () => {
			const [
				{ count: orderCount },
				{ count: restaurantCount },
				{ count: userCount },
				{ data: revenueData },
				{ data: avgRating },
				{ data: avgDeliveryTime },
			] = await Promise.all([
				supabase.from("orders").select("*", { count: "exact", head: true }),
				supabase
					.from("restaurants")
					.select("*", { count: "exact", head: true }),
				supabase.from("profiles").select("*", { count: "exact", head: true }),
				supabase.from("orders").select("total"),
				supabase.from("restaurants").select("rating"),
				supabase.from("restaurants").select("avg(delivery_time)"),
			]);

			const totalRevenue =
				revenueData?.reduce(
					(acc, row) => acc + parseFloat(row.total || 0),
					0,
				) || 0;

			const ratings = avgRating.map((r) => r.rating);
			const averageRating = parseFloat(
				(ratings.reduce((a, b) => a + b, 0) / ratings.length)?.toFixed(2) ||
					"0.0",
			);

			const averageDeliveryTime = avgDeliveryTime?.[0]?.avg || 0;

			return {
				orderCount: orderCount || 0,
				restaurantCount: restaurantCount || 0,
				userCount: userCount || 0,
				totalRevenue: parseFloat(totalRevenue.toFixed(2)),
				averageRating,
				averageDeliveryTime: Math.round(parseFloat(averageDeliveryTime)),
			};
		},
	});
}

// ────────────────────────────────
// useGetRecentOrders
// ────────────────────────────────
export function useGetRecentOrders({ limit = 10, status } = {}) {
	return useQuery({
		queryKey: ["adminRecentOrders", limit, status],
		queryFn: async () => {
			let query = supabase
				.from("orders")
				.select(
					`*,profiles(name), order_items!inner(name,quantity,price,restaurants(name,id))`,
				)
				.order("created_at", { ascending: false });

			if (limit && limit !== "all") query = query.limit(limit);
			if (status && status !== "all") query = query.eq("status", status);

			const { data, error } = await query;
			if (error) throw error;

			return data.map((order) => ({
				...mapOrder(order),
				userName: order.profiles?.name,
				restaurantName: order.order_items[0]?.restaurants?.name,
				restaurantId: order.order_items[0]?.restaurants?.id,
				itemCount: order.order_items?.length || 0,
				itemsPreview:
					order.order_items
						?.slice(0, 3)
						.map((item) => `${item.name} x${item.quantity}`) || [],
			}));
		},
	});
}

// ────────────────────────────────
// useGetAllRestaurantsAdmin
// ────────────────────────────────
export function useGetAllRestaurantsAdmin({ limit = 50 } = {}) {
	return useQuery({
		queryKey: ["adminAllRestaurants", limit],
		queryFn: async () => {
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
		},
	});
}

// ────────────────────────────────
// useGetAllUsersAdmin
// ────────────────────────────────
export function useGetAllUsersAdmin({ limit = 50 } = {}) {
	return useQuery({
		queryKey: ["adminAllUsers", limit],
		queryFn: async () => {
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
		},
	});
}

// ────────────────────────────────
// useUpdateUserRole
// ────────────────────────────────
export function useUpdateUserRole() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ userId, role }) => {
			const { data, error } = await supabase
				.from("profiles")
				.update({ role })
				.eq("id", userId)
				.select()
				.single();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["adminAllUsers"]);
		},
	});
}
