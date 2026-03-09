"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { createOrder } from "@/lib/queries";
import { toast } from "sonner";
import PersonalInfoSection from "./PersonalInfoSection";
import DeliveryAddressSection from "./DeliveryAddressSection";
import PaymentSection from "./PaymentSection";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

export default function CheckoutForm({
	formData,
	handleChange,
	total,
	subtotal,
	deliveryFee,
	tax,
	cartItems,
}) {
	const stripe = useStripe();
	const elements = useElements();
	const { user, isLoggedIn } = useUser();

	const { clearCart } = useCart();
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isLoggedIn) {
			toast.error("Please log in to place an order");
			router.push("/login?redirect=/checkout");
			return;
		}

		if (!stripe || !elements) {
			return;
		}

		setIsProcessing(true);

		try {
			const { error: submitError } = await elements.submit();

			if (submitError) {
				toast.error(submitError.message);
				setIsProcessing(false);
				return;
			}

			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				redirect: "if_required",
			});
			if (error) {
				toast.error(error.message);
				setIsProcessing(false);
				return;
			}

			if (!paymentIntent || paymentIntent.status !== "succeeded") {
				toast.error("Payment was not completed. Please try again.");
				setIsProcessing(false);

				return;
			}

			try {
				const stripe_method_id = paymentIntent.id;
				const order = await createOrder(user.id, stripe_method_id, {
					items: cartItems,
					deliveryAddress: `${formData.address}, ${formData.city} ${formData.zipCode}`,
					paymentMethodId: paymentIntent.id,
					subtotal,
					deliveryFee,
					tax,
					total,
				});

				await clearCart();
				toast.success("Payment successful!");
				router.push(`/order-confirmation/${order.id}`);
			} catch (orderError) {
				console.log("Order creation error:", orderError);
				toast.error(
					"Payment succeeded but failed to create order. Please contact support.",
				);
				setIsProcessing(false);
			}
		} catch (error) {
			toast.error("Failed to place order. Please try again.");
			console.error("Order error:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="grid grid-cols-1 lg:grid-cols-3 gap-8"
		>
			<div className="lg:col-span-2 space-y-6">
				<PersonalInfoSection formData={formData} handleChange={handleChange} />
				<DeliveryAddressSection
					formData={formData}
					handleChange={handleChange}
				/>
				<PaymentSection />
			</div>

			<CheckoutOrderSummary
				cartItems={cartItems}
				subtotal={subtotal}
				deliveryFee={deliveryFee}
				tax={tax}
				total={total}
				isProcessing={isProcessing}
				isStripeReady={!!stripe}
			/>
		</form>
	);
}
