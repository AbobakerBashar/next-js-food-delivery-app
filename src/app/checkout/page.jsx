"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import LoadingIndicator from "./LoadingIndicator";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage() {
	const { cartItems, loading: cartLoading, getCartTotal } = useCart();
	const { user } = useUser();
	const router = useRouter();
	const [clientSecret, setClientSecret] = useState("");
	const [personalInfo, setPersonalInfo] = useState({
		fullName: "",
		email: "",
		phone: "",
	});

	const [address, setAddress] = useState({
		label: "",
		street: "",
		city: "",
		zipCode: "",
	});

	const subtotal = getCartTotal();
	const deliveryFee = 2.99;
	const tax = subtotal * 0.08;
	const total = subtotal + deliveryFee + tax;

	// Check if user is logged in to set default info and redirect to login if not
	useEffect(() => {
		if (!user) {
			router.push("/login?redirect=/checkout");
		} else {
			setPersonalInfo({
				fullName: user.name,
				email: user.email,
				phone: user.phone,
			});
			setAddress(
				user.addresses?.find((addr) => addr.isDefault === true) || {
					label: "",
					street: "",
					city: "",
					zipCode: "",
				},
			);
		}
	}, [user, router]);

	// Create PaymentIntent only after cart is loaded
	useEffect(() => {
		if (cartLoading || cartItems.length === 0 || total <= 0) return;
		const fetchPaymentIntent = async () => {
			try {
				const response = await fetch("/api/create-payment-intent", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						amount: total,
						metadata: {
							itemCount: cartItems.length,
						},
					}),
				});
				const data = await response.json();
				if (data.clientSecret) {
					setClientSecret(data.clientSecret);
				} else {
					console.error("No client secret returned from API");
				}
			} catch (err) {
				console.error("Payment intent error:", err);
			}
		};
		fetchPaymentIntent();
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

	const handlePersonalInfoChange = (e) => {
		setPersonalInfo({
			...personalInfo,
			[e.target.name]: e.target.value,
		});
	};

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
						personalInfo={personalInfo}
						setPersonalInfo={setPersonalInfo}
						address={address}
						setAddress={setAddress}
						handlePersonalInfoChange={handlePersonalInfoChange}
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
