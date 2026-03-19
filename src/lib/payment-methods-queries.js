import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//
// ─────────────────────────────────────────────
//   GET PAYMENT METHODS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetPaymentMethods
// --------------------------------------------------
export function useGetPaymentMethods(userId) {
	return useQuery({
		queryKey: ["paymentMethods", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("payment_methods")
				.select("*")
				.eq("user_id", userId)
				.order("is_default", { ascending: false })
				.order("created_at", { ascending: false });

			if (error) throw error;
			return data;
		},
		enabled: !!userId,
	});
}

//
// ─────────────────────────────────────────────
//   ADD PAYMENT METHOD
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useAddPaymentMethod
// --------------------------------------------------
export function useAddPaymentMethod() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, payment }) => {
			if (payment.isDefault) {
				// Unset other defaults
				const { error: clearError } = await supabase
					.from("payment_methods")
					.update({ is_default: false })
					.eq("user_id", userId);
				if (clearError) throw clearError;
			}

			const { data, error } = await supabase
				.from("payment_methods")
				.insert({
					user_id: userId,
					...payment,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["paymentMethods", userId]);
		},
	});
}

//
// ─────────────────────────────────────────────
//   DELETE PAYMENT METHOD
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useDeletePaymentMethod
// --------------------------------------------------
export function useDeletePaymentMethod() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ paymentId, userId }) => {
			const { error } = await supabase
				.from("payment_methods")
				.delete()
				.eq("id", paymentId);

			if (error) throw error;
			return true;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["paymentMethods", userId]);
		},
	});
}

//
// ─────────────────────────────────────────────
//   SET DEFAULT PAYMENT METHOD
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useSetDefaultPaymentMethod
// --------------------------------------------------
export function useSetDefaultPaymentMethod() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, paymentId }) => {
			// Remove default from all
			const { error: clearError } = await supabase
				.from("payment_methods")
				.update({ is_default: false })
				.eq("user_id", userId);
			if (clearError) throw clearError;

			// Set chosen one as default
			const { data, error } = await supabase
				.from("payment_methods")
				.update({ is_default: true })
				.eq("id", paymentId)
				.select()
				.single();
			if (error) throw error;

			return data;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["paymentMethods", userId]);
		},
	});
}
