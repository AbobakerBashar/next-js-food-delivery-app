"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { useUser } from "@/contexts/UserContext";
import {
	getCart as fetchCart,
	addToCart as dbAddToCart,
	updateCartQuantity as dbUpdateCartQuantity,
	removeCartItem as dbRemoveCartItem,
	clearCart as dbClearCart,
} from "@/lib/queries";

const CartContext = createContext(null);

export function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user, isLoggedIn } = useUser();

	// Load cart from database when user logs in
	const loadCart = useCallback(async () => {
		if (!isLoggedIn || !user?.id) return;
		try {
			setLoading(true);
			const items = await fetchCart(user.id);
			setCartItems(items);
		} catch (error) {
			console.error("Failed to load cart:", error);
		} finally {
			setLoading(false);
		}
	}, [isLoggedIn, user?.id]);

	useEffect(() => {
		if (isLoggedIn && user?.id) {
			loadCart();
		} else {
			setCartItems([]);
		}
	}, [isLoggedIn, user?.id, loadCart]);

	const addToCart = async (item) => {
		console.log("Adding to cart:", item);
		// Optimistic local update
		setCartItems((prev) => {
			const existingItem = prev.find(
				(i) => i.id === item.id && i.restaurantId === item.restaurantId,
			);
			if (existingItem) {
				return prev.map((i) =>
					i.id === item.id && i.restaurantId === item.restaurantId
						? { ...i, quantity: i.quantity + 1 }
						: i,
				);
			}
			return [...prev, { ...item, quantity: 1 }];
		});

		// Persist to database if logged in
		if (isLoggedIn && user?.id) {
			try {
				await dbAddToCart(user.id, {
					itemId: item.id,
					restaurantId: item.restaurantId,
					quantity: 1,
				});
			} catch (error) {
				console.error("Failed to save cart item:", error);
				// Reload cart from DB to stay in sync
				await loadCart();
			}
		}
	};

	const removeFromCart = async (itemId, restaurantId) => {
		// Optimistic local update
		setCartItems((prev) =>
			prev.filter(
				(item) => !(item.id === itemId && item.restaurantId === restaurantId),
			),
		);

		// Persist to database if logged in
		if (isLoggedIn && user?.id) {
			try {
				await dbRemoveCartItem(user.id, itemId, restaurantId);
			} catch (error) {
				console.error("Failed to remove cart item:", error);
				await loadCart();
			}
		}
	};

	const updateQuantity = async (itemId, restaurantId, quantity) => {
		if (quantity === 0) {
			return removeFromCart(itemId, restaurantId);
		}

		// Optimistic local update
		setCartItems((prev) =>
			prev.map((item) =>
				item.id === itemId && item.restaurantId === restaurantId
					? { ...item, quantity }
					: item,
			),
		);

		// Persist to database if logged in
		if (isLoggedIn && user?.id) {
			try {
				await dbUpdateCartQuantity(user.id, itemId, restaurantId, quantity);
			} catch (error) {
				console.error("Failed to update cart quantity:", error);
				await loadCart();
			}
		}
	};

	const clearCart = async () => {
		setCartItems([]);

		// Persist to database if logged in
		if (isLoggedIn && user?.id) {
			try {
				await dbClearCart(user.id);
			} catch (error) {
				console.error("Failed to clear cart:", error);
				await loadCart();
			}
		}
	};

	const getCartTotal = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);
	};

	const getCartCount = () => {
		return cartItems.reduce((count, item) => count + item.quantity, 0);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				loading,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				getCartTotal,
				getCartCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within CartProvider");
	}
	return context;
}
