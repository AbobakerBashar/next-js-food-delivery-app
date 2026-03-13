import { Briefcase, Home, MapPin, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AddressesList = ({
	addresses,
	setDefaultAddress,
	removeAddress,
	user_id,
}) => {
	const labelIcons = { Home: Home, Work: Briefcase };

	const handleSetDefault = async (id) => {
		await setDefaultAddress(user_id, id);
		toast.success("Default address updated successfully!");
	};

	const handleRemove = async (id) => {
		await removeAddress(id);
		toast.success("Address removed successfully!");
	};

	return (
		<div className="space-y-3">
			{addresses.map((addr) => {
				const LabelIcon = labelIcons[addr.label] || MapPin;
				return (
					<div
						key={addr.id}
						className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${addr.isDefault ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10" : "border-gray-100 dark:border-gray-700"}`}
					>
						<div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 mt-0.5">
							<LabelIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<h4 className="font-medium">{addr.label}</h4>
								{addr.isDefault && (
									<span
										aria-label="Default address"
										className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full"
									>
										Default
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{addr.street}, {addr.city}, {addr.state} {addr.zip}
							</p>
						</div>
						<div className="flex items-center gap-1 shrink-0">
							{!addr.isDefault && (
								<button
									aria-label="Set it as a default"
									onClick={() => handleSetDefault(addr.id)}
									className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-500 transition-colors"
									title="Set as default"
								>
									<Star className="w-4 h-4" />
								</button>
							)}
							<button
								aria-label="Remove address"
								onClick={() => handleRemove(addr.id)}
								className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default AddressesList;
