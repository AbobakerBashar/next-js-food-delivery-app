import { CreditCard } from "lucide-react";
import { PaymentElement } from "@stripe/react-stripe-js";

export default function PaymentSection() {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
			<div className="flex items-center gap-2 mb-6">
				<CreditCard className="w-6 h-6 text-orange-500" />
				<h2 className="text-2xl">Payment Information</h2>
			</div>

			<PaymentElement
				options={{
					layout: "tabs",
				}}
			/>
		</div>
	);
}
