import {
	getAddresses,
	getCurrentUser,
	getPaymentMethods,
	getProfile,
	signIn,
	signInWithGoogle,
} from "@/lib/auth-queries";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetSessionUser = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["session-user"],
		queryFn: async () => await supabase.auth.getSession(),
	});
	const session = data?.data?.session || null;
	return { session, isLoading, error };
};

export const useProfile = (userId) =>
	useQuery({
		queryKey: ["profile", userId],
		queryFn: () => getProfile(userId),
		enabled: !!userId,
	});

export const useCurrentUser = () =>
	useQuery({
		queryKey: ["current-user"],
		queryFn: getCurrentUser,
	});

export const useAddresses = (userId) =>
	useQuery({
		queryKey: ["addresses", userId],
		queryFn: () => getAddresses(userId),
		enabled: !!userId,
	});

export const usePaymentMethods = (userId) =>
	useQuery({
		queryKey: ["payment-methods", userId],
		queryFn: () => getPaymentMethods(userId),
		enabled: !!userId,
	});

//
export const useLogin = () => {
	const queryClient = useQueryClient();

	const {
		mutateAsync: login,
		isPending: isLoggingIn,
		error,
	} = useMutation({
		mutationKey: ["auth", "login"],
		mutationFn: ({ email, password }) => signIn(email, password),

		onSuccess: () => {
			// refresh all user-related queries after successful login
			queryClient.invalidateQueries(["session"]);
			queryClient.invalidateQueries(["current-user"]);
			queryClient.invalidateQueries(["profile"]);
			queryClient.invalidateQueries(["addresses"]);
			queryClient.invalidateQueries(["payment-methods"]);
		},
	});

	return { login, isLoggingIn, error };
};

// GO With Google
export const useGoogleLogin = () => {
	const queryClient = useQueryClient();
	const {
		mutateAsync: googleLogin,
		isPending: isLoggingIn,
		error,
	} = useMutation({
		mutationKey: ["auth", "google-login"],
		mutationFn: signInWithGoogle,
		onSuccess: () => {
			// refresh all user-related queries after successful login
			queryClient.invalidateQueries(["session"]);
			queryClient.invalidateQueries(["current-user"]);
			queryClient.invalidateQueries(["profile"]);
			queryClient.invalidateQueries(["addresses"]);
			queryClient.invalidateQueries(["payment-methods"]);
		},
	});
	return { googleLogin, isLoggingIn, error };
};
