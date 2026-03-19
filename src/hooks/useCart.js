import {
	addToCart,
	clearCart,
	getCart,
	removeCartItem,
	updateCartQuantity,
} from "@/lib/cart-queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// --------- CART HOOK -----------------------------------------

// Get Cart Items
export function useGetCart(userId) {
	return useQuery({
		queryKey: ["cart", userId],
		queryFn: () => getCart(userId),
	});
}

// Add to Cart
export function useAddToCart() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, item }) =>
			addToCart(userId, {
				itemId: item.id,
				restaurantId: item.restaurantId || item.restaurant_id,
				quantity: item.quantity,
			}),

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["cart", userId]);
			toast.success("Item added to cart");
		},
		onError: (error) => {
			toast.error("Failed to add item to cart");
			console.error("Error adding to cart:", error);
		},
	});
}

// Update Cart Quantity
export function useUpdateCartQuantity() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, itemId, restaurantId, quantity }) =>
			updateCartQuantity(userId, itemId, restaurantId, quantity),
		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["cart", userId]);
			toast.success("Cart quantity updated");
		},
		onError: (error) => {
			toast.error("Failed to update cart quantity");
			console.error("Error updating cart quantity:", error);
		},
	});
}

// Clear Cart
export function useClearCart() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId) => clearCart(userId),

		onSuccess: (_, userId) => {
			queryClient.invalidateQueries(["cart", userId]);
			toast.success("Cart cleared");
		},
		onError: (error) => {
			toast.error("Failed to clear cart");
			console.error("Error clearing cart:", error);
		},
	});
}

// Remove from Cart
export function useRemoveFromCart() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, itemId, restaurantId }) =>
			removeCartItem(userId, itemId, restaurantId),
		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["cart", userId]);
			toast.success("Item removed from cart");
		},
		onError: (error) => {
			toast.error("Failed to remove item from cart");
			console.error("Error removing from cart:", error);
		},
	});
}
