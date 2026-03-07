"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
	const [favorites, setFavorites] = useState({ restaurants: [], dishes: [] });

	// Load from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("favorites");
		if (stored) {
			try {
				setFavorites(JSON.parse(stored));
			} catch {
				// ignore bad data
			}
		}
	}, []);

	// Persist to localStorage
	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	const toggleFavoriteRestaurant = (restaurant, imageUrl) => {
		setFavorites((prev) => {
			const exists = prev.restaurants.some((r) => r.id === restaurant.id);
			if (exists) {
				return {
					...prev,
					restaurants: prev.restaurants.filter((r) => r.id !== restaurant.id),
				};
			}
			return {
				...prev,
				restaurants: [...prev.restaurants, { ...restaurant, imageUrl }],
			};
		});
	};

	const toggleFavoriteDish = (dish, imageUrl) => {
		setFavorites((prev) => {
			const exists = prev.dishes.some(
				(d) => d.id === dish.id && d.restaurantId === dish.restaurantId,
			);
			if (exists) {
				return {
					...prev,
					dishes: prev.dishes.filter(
						(d) => !(d.id === dish.id && d.restaurantId === dish.restaurantId),
					),
				};
			}
			return {
				...prev,
				dishes: [...prev.dishes, { ...dish, imageUrl }],
			};
		});
	};

	const isRestaurantFavorite = (id) => {
		return favorites.restaurants.some((r) => r.id === id);
	};

	const isDishFavorite = (id, restaurantId) => {
		return favorites.dishes.some(
			(d) => d.id === id && d.restaurantId === restaurantId,
		);
	};

	const getFavoritesCount = () => {
		return favorites.restaurants.length + favorites.dishes.length;
	};

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				toggleFavoriteRestaurant,
				toggleFavoriteDish,
				isRestaurantFavorite,
				isDishFavorite,
				getFavoritesCount,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
}
