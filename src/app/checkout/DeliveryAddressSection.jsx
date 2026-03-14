import { Briefcase, Home, MapPin } from "lucide-react";

const inputClassName =
	"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors";

export default function DeliveryAddressSection({ address, setAddress }) {
	const labelIcons = { Home: Home, Work: Briefcase };
	const LabelIcon = labelIcons[address.label] || MapPin;

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
			<div className="flex items-center gap-2 mb-6">
				<LabelIcon className="w-6 h-6 text-orange-500" />
				<h2 className="text-2xl">Delivery Address</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						Label (e.g., Home, Work)
						<span className="text-xs text-gray-400 ml-1">
							(Optional, helps you identify the address)
						</span>
					</label>
					<input
						type="text"
						name="label"
						value={address.label || ""}
						onChange={(e) =>
							setAddress({
								...address,
								label:
									e.target.value.charAt(0).toUpperCase() +
									e.target.value.slice(1),
							})
						}
						className={inputClassName}
					/>
				</div>
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						Street Address
					</label>
					<input
						type="text"
						name="street"
						value={address.street || ""}
						onChange={(e) => setAddress({ ...address, street: e.target.value })}
						required
						className={inputClassName}
					/>
				</div>
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						City
					</label>
					<input
						type="text"
						name="city"
						value={address.city || ""}
						onChange={(e) => setAddress({ ...address, city: e.target.value })}
						required
						className={inputClassName}
					/>
				</div>
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						ZIP Code
					</label>
					<input
						type="text"
						name="zipCode"
						value={address.zipCode || ""}
						onChange={(e) =>
							setAddress({ ...address, zipCode: e.target.value })
						}
						required={address.city.toLowerCase() !== "kigali"}
						className={inputClassName}
					/>
				</div>
			</div>
		</div>
	);
}
