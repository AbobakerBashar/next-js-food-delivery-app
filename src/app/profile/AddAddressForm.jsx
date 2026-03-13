import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddAddressForm = ({ form, setForm, setAdding, addAddress, user }) => {
	const [loading, setLoading] = useState(false);

	const handleAdd = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const newAddresses = Object.fromEntries(formData.entries());

		if (
			!newAddresses.street ||
			!newAddresses.city ||
			!newAddresses.state ||
			!newAddresses.zip
		) {
			toast.error("Please fill in all address fields");
			return;
		}
		try {
			setLoading(true);

			await addAddress({
				...newAddresses,
				isDefault: user.addresses.length === 0,
			});
			setForm({ label: "Home", street: "", city: "", state: "", zip: "" });
			toast.success("Address added successfully");
			setAdding(false);
			setLoading(false);
		} catch (error) {
			toast.error("Failed to add address");
			console.error(error);
			return;
		}
	};

	return (
		<form
			onSubmit={handleAdd}
			className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
		>
			{/* Form Fields */}
			<div>
				<label
					htmlFor="label"
					className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
				>
					Label
				</label>
				<select
					id="label"
					name="label"
					value={form.label}
					onChange={(e) => setForm({ ...form, label: e.target.value })}
					className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
				>
					<option value="Home">Home</option>
					<option value="Work">Work</option>
					<option value="Other">Other</option>
				</select>
			</div>
			<div>
				<label
					htmlFor="street"
					className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
				>
					Street Address
				</label>
				<input
					type="text"
					id="street"
					name="street"
					value={form.street}
					onChange={(e) => setForm({ ...form, street: e.target.value })}
					placeholder="123 Main Street"
					className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
				/>
			</div>
			<div className="grid grid-cols-3 gap-3">
				<div>
					<label
						htmlFor="city"
						className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
					>
						City
					</label>
					<input
						type="text"
						id="city"
						name="city"
						value={form.city}
						onChange={(e) => setForm({ ...form, city: e.target.value })}
						className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
					/>
				</div>
				<div>
					<label
						htmlFor="state"
						className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
					>
						State
					</label>
					<input
						type="text"
						id="state"
						name="state"
						value={form.state}
						onChange={(e) => setForm({ ...form, state: e.target.value })}
						className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
					/>
				</div>
				<div>
					<label
						htmlFor="zip"
						className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
					>
						ZIP
					</label>
					<input
						type="text"
						id="zip"
						name="zip"
						value={form.zip}
						onChange={(e) => setForm({ ...form, zip: e.target.value })}
						className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
					/>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-3">
				<button
					type="submit"
					aria-label="Save Address"
					disabled={loading}
					className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors disabled:bg-orange-300 disabled:hover:bg-orange-300 disabled:cursor-not-allowed"
				>
					<Check className="w-4 h-4" /> Save Address
				</button>
				<button
					type="button"
					aria-label="Cancel"
					disabled={loading}
					onClick={() => setAdding(false)}
					className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:cursor-not-allowed"
				>
					<X className="w-4 h-4" /> Cancel
				</button>
			</div>
		</form>
	);
};

export default AddAddressForm;
