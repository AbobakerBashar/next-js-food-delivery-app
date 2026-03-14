"use client";

import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	createDelivery,
	createOrder,
	getAvailableDrivers,
	updateDriver,
} from "@/lib/queries";
import { toast } from "react-toastify";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import DeliveryAddressSection from "./DeliveryAddressSection";
import PaymentSection from "./PaymentSection";
import PersonalInfoSection from "./PersonalInfoSection";

export default function CheckoutForm({
	total,
	subtotal,
	deliveryFee,
	tax,
	cartItems,
	personalInfo,
	address,
	setAddress,
	handlePersonalInfoChange,
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
					deliveryAddress: `${address.street}, ${address.city} ${address.zipCode}`,
					paymentMethodId: paymentIntent.id,
					subtotal,
					deliveryFee,
					tax,
					total,
					deliveryCity: address.city,
					deliveryZipCode: address.zipCode,
				});

				/*
					Create Delivery
				*/
				// Get an available driver
				const drivers = await getAvailableDrivers();
				const driver = drivers.length > 0 ? drivers[0] : null;

				const deliveryData = driver
					? {
							order_id: order.id,
							driver_id: driver.id,
							assigned_at: new Date().toISOString(),
							status: "assigned",
							picked_up_at: null,
							delivered_at: null,
						}
					: {
							order_id: order.id,
							driver_id: null,
							assigned_at: null,
							status: "pending",
							picked_up_at: null,
							delivered_at: null,
						};

				// Update Driver Status if Has been Assigned
				if (driver) await updateDriver(driver.id, { status: "busy" });

				const delivery = await createDelivery(deliveryData);

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
				<PersonalInfoSection
					personalInfo={personalInfo}
					handleChange={handlePersonalInfoChange}
				/>
				<DeliveryAddressSection
					personalInfo={personalInfo}
					address={address}
					setAddress={setAddress}
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
