import { MapPin } from "lucide-react";

const DeliveryAddress = ({ address }) => {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
			<h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
			<div className="flex items-start gap-3">
				<MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
				<p className="text-gray-600 dark:text-gray-400 text-sm">{address}</p>
			</div>
		</div>
	);
};

export default DeliveryAddress;
