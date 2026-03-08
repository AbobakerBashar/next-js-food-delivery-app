"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import {
	signUp as supabaseSignUp,
	signIn as supabaseSignIn,
	signOut as supabaseSignOut,
	getProfile,
	updateProfile as supabaseUpdateProfile,
	getAddresses,
	addAddress as supabaseAddAddress,
	updateAddress as supabaseUpdateAddress,
	removeAddress as supabaseRemoveAddress,
	setDefaultAddress as supabaseSetDefaultAddress,
	getPaymentMethods,
	addPaymentMethod as supabaseAddPaymentMethod,
	removePaymentMethod as supabaseRemovePaymentMethod,
	setDefaultPayment as supabaseSetDefaultPayment,
} from "@/lib/queries";

const UserContext = createContext(null);

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	const loadUserData = useCallback(async (userId) => {
		try {
			const [profile, addresses, paymentMethods] = await Promise.all([
				getProfile(userId),
				getAddresses(userId),
				getPaymentMethods(userId),
			]);
			setUser({ id: userId, ...profile, addresses, paymentMethods });
			setIsLoggedIn(true);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error loading user data:", error.message, error.stack);
			} else if (typeof error === "object" && error !== null) {
				console.error("Error loading user data:", JSON.stringify(error));
			} else {
				console.error("Error loading user data:", error);
			}
			setUser(null);
			setIsLoggedIn(false);
		}
	}, []);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) {
				loadUserData(session.user.id).then(() => setLoading(false));
			} else {
				setLoading(false);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				await loadUserData(session.user.id);
			} else {
				setUser(null);
				setIsLoggedIn(false);
			}
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, [loadUserData]);

	const login = async (email, password) => {
		try {
			await supabaseSignIn(email, password);
			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	const signup = async (name, email, password) => {
		try {
			await supabaseSignUp(name, email, password);
			return { success: true };
		} catch (error) {
			return { success: false, error: error.message };
		}
	};

	const logout = async () => {
		try {
			await supabaseSignOut();
			setUser(null);
			setIsLoggedIn(false);
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const updateProfile = async (updates) => {
		if (!user) return;
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) return;
			const updated = await supabaseUpdateProfile(userId, updates);
			setUser((prev) => ({ ...prev, ...updated }));
		} catch (error) {
			console.error("Update profile error:", error);
		}
	};

	const addAddress = async (address) => {
		if (!user) return;
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) return;
			const newAddress = await supabaseAddAddress(userId, address);
			setUser((prev) => ({
				...prev,
				addresses: [...(prev.addresses || []), newAddress],
			}));
		} catch (error) {
			console.error("Add address error:", error);
		}
	};

	const updateAddress = async (id, updates) => {
		try {
			const updated = await supabaseUpdateAddress(id, updates);
			setUser((prev) => ({
				...prev,
				addresses: prev.addresses.map((a) => (a.id === id ? updated : a)),
			}));
		} catch (error) {
			console.error("Update address error:", error);
		}
	};

	const removeAddress = async (id) => {
		try {
			await supabaseRemoveAddress(id);
			setUser((prev) => ({
				...prev,
				addresses: prev.addresses.filter((a) => a.id !== id),
			}));
		} catch (error) {
			console.error("Remove address error:", error);
		}
	};

	const setDefaultAddress = async (id) => {
		if (!user) return;
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) return;
			await supabaseSetDefaultAddress(userId, id);
			setUser((prev) => ({
				...prev,
				addresses: prev.addresses.map((a) => ({
					...a,
					isDefault: a.id === id,
				})),
			}));
		} catch (error) {
			console.error("Set default address error:", error);
		}
	};

	const addPaymentMethod = async (method) => {
		if (!user) return;
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) return;
			const newMethod = await supabaseAddPaymentMethod(userId, method);
			setUser((prev) => ({
				...prev,
				paymentMethods: [...(prev.paymentMethods || []), newMethod],
			}));
		} catch (error) {
			console.error("Add payment method error:", error);
		}
	};

	const removePaymentMethod = async (id) => {
		try {
			await supabaseRemovePaymentMethod(id);
			setUser((prev) => ({
				...prev,
				paymentMethods: prev.paymentMethods.filter((p) => p.id !== id),
			}));
		} catch (error) {
			console.error("Remove payment method error:", error);
		}
	};

	const setDefaultPayment = async (id) => {
		if (!user) return;
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) return;
			await supabaseSetDefaultPayment(userId, id);
			setUser((prev) => ({
				...prev,
				paymentMethods: prev.paymentMethods.map((p) => ({
					...p,
					isDefault: p.id === id,
				})),
			}));
		} catch (error) {
			console.error("Set default payment error:", error);
		}
	};

	return (
		<UserContext.Provider
			value={{
				user,
				isLoggedIn,
				loading,
				login,
				signup,
				updateProfile,
				addAddress,
				updateAddress,
				removeAddress,
				setDefaultAddress,
				addPaymentMethod,
				removePaymentMethod,
				setDefaultPayment,
				logout,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
