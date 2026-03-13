import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const EditeProfileForm = ({ updateProfile, user, setEditing }) => {
	const [form, setForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
		phone: user?.phone || "",
	});

	const handleSave = (e) => {
		e.preventDefault();
		updateProfile(form);
		setEditing(false);
		toast.success("Profile updated successfully");
	};

	const handleCancel = () => {
		setForm({
			name: user?.name || "",
			email: user?.email || "",
			phone: user?.phone || "",
		});
		setEditing(false);
	};

	return (
		<form onSubmit={handleSave} className="space-y-4">
			<div>
				<label
					htmlFor="fullName"
					className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
				>
					Full Name
				</label>
				<input
					id="fullName"
					type="text"
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
				/>
			</div>
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
				/>
			</div>
			<div>
				<label
					htmlFor="phone"
					className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
				>
					Phone
				</label>
				<input
					id="phone"
					type="tel"
					value={form.phone}
					onChange={(e) => setForm({ ...form, phone: e.target.value })}
					className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
				/>
			</div>
			<div className="flex gap-3">
				<button
					type="submit"
					aria-label="Save profile changes"
					className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors"
				>
					<Check className="w-4 h-4" /> Save
				</button>
				<button
					type="button"
					aria-label="Cancel profile editing"
					onClick={handleCancel}
					className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors"
				>
					<X className="w-4 h-4" /> Cancel
				</button>
			</div>
		</form>
	);
};

export default EditeProfileForm;
