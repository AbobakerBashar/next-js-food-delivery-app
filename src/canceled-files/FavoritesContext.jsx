"use client";

import {
	useAddFavoriteDish,
	useAddFavoriteRestaurant,
	useGetFavoriteDishes,
	useGetFavoriteRestaurants,
	useRemoveFavoriteDish,
	useRemoveFavoriteRestaurant,
} from "@/hooks/useFavorits";
import { useCurrentUser } from "@/hooks/useUser";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
	const [favoritsRestaurants, setFavoritsRestaurants] = useState([]);
	const [favoritsDishes, setFavoritsDishes] = useState([]);
	const { data: user, isLoading, error } = useCurrentUser();
	const {
		data: restaurants,
		isLoading: restaurantsLoading,
		error: restaurantsError,
	} = useGetFavoriteRestaurants(user?.id);
	const {
		data: dishes,
		isLoading: dishesLoading,
		error: dishesError,
	} = useGetFavoriteDishes(user?.id);
	const {
		mutateAsync: addFavoriteRestaurant,
		isPending: addFavoriteRestaurantPending,
		error: addFavoriteRestaurantError,
	} = useAddFavoriteRestaurant();
	const {
		mutateAsync: addFavoriteDish,
		isPending: addFavoriteDishPending,
		error: addFavoriteDishError,
	} = useAddFavoriteDish();
	const {
		mutateAsync: removeFavoriteRestaurant,
		isPending: removeFavoriteRestaurantPending,
		error: removeFavoriteRestaurantError,
	} = useRemoveFavoriteRestaurant();
	const {
		mutateAsync: removeFavoriteDish,
		isPending: removeFavoriteDishPending,
		error: removeFavoriteDishError,
	} = useRemoveFavoriteDish();

	const [favorites, setFavorites] = useState({ restaurants: [], dishes: [] });

	// Load Favortis Restaurants

	useEffect(() => {
		try {
			if (restaurants) {
				setFavoritsRestaurants(restaurants);
			}
		} catch (err) {
			console.error("Error loading favorite restaurants:", err);
		}
	}, [restaurantsLoading, restaurantsError, restaurants, user?.id]);

	// Load Favortis Dishes
	useEffect(() => {
		try {
			if (dishes) {
				setFavoritsDishes(dishes);
			}
		} catch (err) {
			console.error("Error loading favorite dishes:", err);
		}
	}, [dishesLoading, dishesError, dishes, user?.id]);

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

	const toggleFavoriteRsturant = (restId) => {
		if (!restaurantsLoading && !restaurantsError) {
			const isExisting = favoritsRestaurants.find((r) => r.id === restId);
			try {
				if (isExisting) {
					removeFavoriteRestaurant(restId);
				} else {
					addFavoriteRestaurant(restId);
				}
			} catch (error) {
				console.error("Error toggling favorite restaurant:", error);
				toast.error("Failed to update favorite restaurant. Please try again.");
			}
		}
	};

	return (
		<FavoritesContext.Provider
			value={{
				favoritsRestaurants,
				favoritsDishes,
				addFavoriteRestaurant,
				addFavoriteDish,
				removeFavoriteRestaurant,
				removeFavoriteDish,
				addFavoriteRestaurantPending,
				addFavoriteDishPending,
				removeFavoriteRestaurantPending,
				removeFavoriteDishPending,
				addFavoriteRestaurantError,
				addFavoriteDishError,
				removeFavoriteRestaurantError,
				removeFavoriteDishError,
				favorites,
				toggleFavoriteRestaurant,
				toggleFavoriteDish,
				isRestaurantFavorite,
				isDishFavorite,
				getFavoritesCount,
				loading: isLoading || restaurantsLoading || dishesLoading,
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
