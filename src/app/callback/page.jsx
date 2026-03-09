"use client";

import { supabase } from "@/lib/supabase";
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
			console.log("Auth callback received user:", user);
			// Create or update profile
			const { data: existing, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("email", session.user.email)
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

	return <p>Signing you in...</p>;
}
