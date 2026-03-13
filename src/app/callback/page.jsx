"use client";

import { supabase } from "@/lib/supabase";
import { UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
	const router = useRouter();

	useEffect(() => {
		async function process() {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) return router.push("/login");

			const user = session.user;

			// Create or update profile
			const { data: existing, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("user_id", session.user.id)
				.maybeSingle();
			if (error) throw error;
			if (!existing) {
				const { data: insertData, error } = await supabase
					.from("profiles")
					.insert([
						{
							name: user.user_metadata.full_name || user.email,
							email: user.email,
							avatar: user.user_metadata.avatar_url,
							phone: user.user_metadata.phone,
						},
					]);
				if (error) throw error;
			}

			router.push("/");
		}

		process();
	}, []);

	return (
		<div className="w-full h-20 my-8 flex items-center justify-center gap-3">
			<p className="text-lg font-medium">Signing you in...</p>
			<div className="relative">
				<div className="w-8 h-8 rounded-full border-4 border-orange-200 dark:border-orange-900/40 border-t-orange-500 dark:border-t-orange-500 animate-spin" />
				<div className="absolute inset-0 flex items-center justify-center">
					<UtensilsCrossed className="w-4 h-4 text-orange-500 animate-pulse" />
				</div>
			</div>
		</div>
	);
}
