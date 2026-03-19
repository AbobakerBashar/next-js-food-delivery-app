import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//
// ─────────────────────────────────────────────
//   GET ADDRESSES
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useGetAddresses
// --------------------------------------------------
export function useGetAddresses(userId) {
	return useQuery({
		queryKey: ["addresses", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("addresses")
				.select("*")
				.eq("user_id", userId)
				.order("is_default", { ascending: false });

			if (error) throw error;
			return data;
		},
		enabled: !!userId,
	});
}

//
// ─────────────────────────────────────────────
//   ADD ADDRESS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useAddAddress
// --------------------------------------------------
export function useAddAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, address }) => {
			const { data, error } = await supabase
				.from("addresses")
				.insert({
					user_id: userId,
					...address,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["addresses", userId]);
		},
	});
}

//
// ─────────────────────────────────────────────
//   UPDATE ADDRESS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useUpdateAddress
// --------------------------------------------------
export function useUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ addressId, updates, userId }) => {
			const { data, error } = await supabase
				.from("addresses")
				.update(updates)
				.eq("id", addressId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["addresses", userId]);
		},
	});
}

//
// ─────────────────────────────────────────────
//   DELETE ADDRESS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useDeleteAddress
// --------------------------------------------------
export function useDeleteAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ addressId, userId }) => {
			const { error } = await supabase
				.from("addresses")
				.delete()
				.eq("id", addressId);

			if (error) throw error;
			return true;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["addresses", userId]);
		},
	});
}

//
// ─────────────────────────────────────────────
//   SET DEFAULT ADDRESS
// ─────────────────────────────────────────────
//

// --------------------------------------------------
// useSetDefaultAddress
// --------------------------------------------------
export function useSetDefaultAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ userId, addressId }) => {
			// Remove default from all addresses
			const { error: clearErr } = await supabase
				.from("addresses")
				.update({ is_default: false })
				.eq("user_id", userId);

			if (clearErr) throw clearErr;

			// Set selected address as default
			const { data, error } = await supabase
				.from("addresses")
				.update({ is_default: true })
				.eq("id", addressId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},

		onSuccess: (_, { userId }) => {
			queryClient.invalidateQueries(["addresses", userId]);
		},
	});
}
