import { useState } from "react";
import SectionCard from "./SectionCard";
import { Check, CreditCard, Plus, Star, Trash2, X } from "lucide-react";

function PaymentSection({
	user,
	addPaymentMethod,
	removePaymentMethod,
	setDefaultPayment,
}) {
	const [adding, setAdding] = useState(false);
	const [form, setForm] = useState({
		type: "visa",
		last4: "",
		expiry: "",
	});

	const handleAdd = () => {
		if (!form.last4 || !form.expiry) {
			toast.error("Please fill in all payment fields");
			return;
		}
		addPaymentMethod({ ...form, isDefault: user.paymentMethods.length === 0 });
		setForm({ type: "visa", last4: "", expiry: "" });
		setAdding(false);
		toast.success("Payment method added");
	};

	const cardIcons = {
		visa: "💳",
		mastercard: "💳",
		amex: "💳",
		paypal: "🅿️",
	};

	const cardLabels = {
		visa: "Visa",
		mastercard: "Mastercard",
		amex: "American Express",
		paypal: "PayPal",
	};

	return (
		<SectionCard icon={CreditCard} title="Payment Methods">
			{user?.paymentMethods?.length > 0 ? (
				<div className="space-y-3">
					{user.paymentMethods.map((pm) => (
						<div
							key={pm.id}
							className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${pm.isDefault ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10" : "border-gray-100 dark:border-gray-700"}`}
						>
							<span className="text-2xl">{cardIcons[pm.type] || "💳"}</span>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-0.5">
									<span className="font-medium">
										{cardLabels[pm.type] || pm.type} •••• {pm.last4}
									</span>
									{pm.isDefault && (
										<span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
											Default
										</span>
									)}
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Expires {pm.expiry}
								</p>
							</div>
							<div className="flex items-center gap-1 shrink-0">
								{!pm.isDefault && (
									<button
										onClick={() => {
											setDefaultPayment(pm.id);
											toast.success("Default payment updated");
										}}
										className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-500 transition-colors"
										title="Set as default"
									>
										<Star className="w-4 h-4" />
									</button>
								)}
								<button
									onClick={() => {
										removePaymentMethod(pm.id);
										toast.success("Payment method removed");
									}}
									className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-500 dark:text-gray-400 text-sm">
					No saved payment methods.
				</p>
			)}

			{adding ? (
				<div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Card Type
						</label>
						<select
							value={form.type}
							onChange={(e) => setForm({ ...form, type: e.target.value })}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
						>
							<option value="visa">Visa</option>
							<option value="mastercard">Mastercard</option>
							<option value="amex">American Express</option>
							<option value="paypal">PayPal</option>
						</select>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Last 4 Digits
							</label>
							<input
								type="text"
								maxLength={4}
								value={form.last4}
								onChange={(e) =>
									setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })
								}
								placeholder="4242"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Expiry Date
							</label>
							<input
								type="text"
								maxLength={5}
								value={form.expiry}
								onChange={(e) => setForm({ ...form, expiry: e.target.value })}
								placeholder="MM/YY"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleAdd}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors"
						>
							<Check className="w-4 h-4" /> Save Card
						</button>
						<button
							onClick={() => setAdding(false)}
							className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors"
						>
							<X className="w-4 h-4" /> Cancel
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setAdding(true)}
					className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
				>
					<Plus className="w-4 h-4" /> Add Payment Method
				</button>
			)}
		</SectionCard>
	);
}
export default PaymentSection;
