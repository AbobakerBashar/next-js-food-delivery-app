import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

//
// ─────────────────────────────────────────────
//   GET ADMIN DASHBOARD STATS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetAdminStats
// --------------------------------------------------
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
		},
	});
}

//
// ─────────────────────────────────────────────
//   GET RECENT ORDERS FOR ADMIN
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetRecentOrders
// --------------------------------------------------
export function useGetRecentOrders({ limit = 10, status } = {}) {
	return useQuery({
		queryKey: ["adminOrders", limit, status],
		queryFn: async () => {
			let query = supabase
				.from("orders")
				.select(
					`
          *,
          profiles(name),
          order_items!inner(name, quantity, price),
          restaurants(name)
        `,
				)
				.order("created_at", { ascending: false })
				.limit(limit);

			if (status) query = query.eq("status", status);

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
		},
	});
}

//
// ─────────────────────────────────────────────
//   GET ALL RESTAURANTS FOR ADMIN
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetAllRestaurantsAdmin
// --------------------------------------------------
export function useGetAllRestaurantsAdmin({ limit = 50 } = {}) {
	return useQuery({
		queryKey: ["adminRestaurants", limit],
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

//
// ─────────────────────────────────────────────
//   GET ALL USERS FOR ADMIN
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetAllUsersAdmin
// --------------------------------------------------
export function useGetAllUsersAdmin({ limit = 50 } = {}) {
	return useQuery({
		queryKey: ["adminUsers", limit],
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

//
// ─────────────────────────────────────────────
//   MAPPING HELPERS
// ─────────────────────────────────────────────
//

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
	};
}
