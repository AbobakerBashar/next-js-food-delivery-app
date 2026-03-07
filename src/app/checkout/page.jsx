"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import LoadingIndicator from "./LoadingIndicator";
import { useCart } from "@/contexts/CartContext";
import { getStripe } from "@/lib/stripe";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage() {
	const { cartItems, loading: cartLoading, getCartTotal } = useCart();
	const router = useRouter();

	const [clientSecret, setClientSecret] = useState("");
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		zipCode: "",
	});

	const subtotal = getCartTotal();
	const deliveryFee = 2.99;
	const tax = subtotal * 0.08;
	const total = subtotal + deliveryFee + tax;

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Create PaymentIntent only after cart is loaded
	useEffect(() => {
		if (cartLoading || cartItems.length === 0 || total <= 0) return;

		fetch("/api/create-payment-intent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				amount: total,
				metadata: {
					itemCount: cartItems.length,
				},
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.clientSecret) {
					setClientSecret(data.clientSecret);
				}
			})
			.catch((err) => console.error("Payment intent error:", err));
	}, [cartLoading, total, cartItems.length]);

	// Only redirect to cart after loading is done and cart is truly empty
	useEffect(() => {
		if (!cartLoading && cartItems.length === 0) {
			router.push("/cart");
		}
	}, [cartLoading, cartItems.length, router]);

	if (cartLoading || cartItems.length === 0) {
		return <LoadingIndicator message="Loading cart..." />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl mb-8">Checkout</h1>

			{clientSecret ? (
				<Elements
					stripe={getStripe()}
					options={{
						clientSecret,
						appearance: {
							theme: "stripe",
							variables: {
								colorPrimary: "#f97316",
								borderRadius: "8px",
							},
						},
					}}
				>
					<CheckoutForm
						formData={formData}
						handleChange={handleChange}
						total={total}
						subtotal={subtotal}
						deliveryFee={deliveryFee}
						tax={tax}
						cartItems={cartItems}
					/>
				</Elements>
			) : (
				<LoadingIndicator message="Loading payment..." />
			)}
		</div>
	);
}
