import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
	try {
		const { amount, currency = "usd", metadata = {} } = await request.json();

		if (!amount || amount <= 0) {
			return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
		}

		// Stripe expects amount in cents
		const amountInCents = Math.round(amount * 100);

		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountInCents,
			currency,
			payment_method_types: ["card"],
			metadata,
		});

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		console.error("Stripe error:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
