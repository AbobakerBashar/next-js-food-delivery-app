"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StripeRedirectHandler() {
	const router = useRouter();

	useEffect(() => {
		// Get query params from URL
		const params = new URLSearchParams(window.location.search);
		const paymentIntent = params.get("payment_intent");
		const redirectStatus = params.get("redirect_status");

		// If redirected from Stripe and payment succeeded
		if (paymentIntent && redirectStatus === "succeeded") {
			// You may want to fetch/create the order here using paymentIntent
			// For now, redirect to a placeholder orderId (should be replaced with real logic)
			// Example: router.push(`/order-confirmation/${orderId}`);
			// If you have a backend endpoint to get orderId from paymentIntent, call it here
			// For demo, just redirect to tracking page
			router.push(`/tracking/${paymentIntent}`);
		}
	}, [router]);

	return null;
}
