import { MapPin } from "lucide-react";

const inputClassName =
	"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors";

export default function DeliveryAddressSection({ formData, handleChange }) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
			<div className="flex items-center gap-2 mb-6">
				<MapPin className="w-6 h-6 text-orange-500" />
				<h2 className="text-2xl">Delivery Address</h2>
			</div>

			<div className="grid grid-cols-1 gap-4">
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						Street Address
					</label>
					<input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						required
						className={inputClassName}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
							City
						</label>
						<input
							type="text"
							name="city"
							value={formData.city}
							onChange={handleChange}
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
							value={formData.zipCode}
							onChange={handleChange}
							required
							className={inputClassName}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
