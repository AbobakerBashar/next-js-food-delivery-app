import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//
// ─────────────────────────────────────────────
//   GET ORDERS BY USER
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetOrdersByUser
// --------------------------------------------------
export function useGetOrdersByUser(userId) {
	return useQuery({
		queryKey: ["orders", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select("*, order_items(*)")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return data.map((order) => ({
				...mapOrder(order),
				items:
					order.order_items?.map((item) => ({
						id: item.menu_item_id,
						restaurantId: item.restaurant_id,
						name: item.name,
						price: Number(item.price),
						quantity: item.quantity,
						imageUrl: item.image_url,
					})) || [],
			}));
		},
		enabled: !!userId,
	});
}

//
// ─────────────────────────────────────────────
//   GET SINGLE ORDER
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetOrderById
// --------------------------------------------------
export function useGetOrderById(orderId) {
	return useQuery({
		queryKey: ["order", orderId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("orders")
				.select(
					`
          *,
          order_items(
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
			};
		},
		enabled: !!orderId,
	});
}

//
// ─────────────────────────────────────────────
//   CREATE ORDER
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useCreateOrder
// --------------------------------------------------
export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, stripe_payment_id, orderData }) => {
			const { data: orders, error: ordersError } = await supabase
				.from("orders")
				.select("*")
				.eq("user_id", userId);

			if (ordersError) throw ordersError;

			const order_number = orders.length + 1;

			const { data: order, error: orderError } = await supabase
				.from("orders")
				.insert({
					user_id: userId,
					status: "confirmed",
					delivery_address: orderData.deliveryAddress,
					delivery_city: orderData.deliveryCity,
					delivery_zip: orderData.deliveryZipCode,
					subtotal: orderData.subtotal,
					delivery_fee: orderData.deliveryFee,
					tax: orderData.tax,
					total: orderData.total,
					stripe_payment_id,
					order_number,
				})
				.select()
				.single();

			if (orderError) throw orderError;

			const orderItems = orderData.items.map((item) => ({
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

			if (itemsError) throw itemsError;

			return mapOrder(order);
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["orders", userId]);
		},
	});
}

//
// ─────────────────────────────────────────────
//   UPDATE ORDER STATUS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useUpdateOrderStatus
// --------------------------------------------------
export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ orderId, status }) => {
			const { data, error } = await supabase
				.from("orders")
				.update({ status })
				.eq("id", orderId)
				.select()
				.single();

			if (error) throw error;
			return mapOrder(data);
		},

		onSuccess: (data, { userId }) => {
			queryClient.invalidateQueries(["orders", userId]);
			queryClient.invalidateQueries(["order", data.id]);
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
