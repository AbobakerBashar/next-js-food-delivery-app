import { Hash, MessageSquare, Phone, Star, Truck } from "lucide-react";

const DriverInfoCard = ({ driverDetails }) => {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
			<h2 className="text-lg font-semibold mb-4">Your Driver</h2>
			<div className="flex items-center gap-4 mb-4">
				<img
					src={driverDetails?.avatar}
					alt={driverDetails?.name}
					className="w-16 h-16 rounded-full object-cover"
				/>
				<div>
					<p className="font-semibold text-lg">{driverDetails?.name}</p>
					<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
						<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
						<span>{driverDetails?.rating || 4}</span>
						<span className="mx-1">·</span>
						<span>{driverDetails?.total_deliveries || 0} deliveries</span>
					</div>
				</div>
			</div>

			<div className="space-y-3 mb-5">
				<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
					<h4 className="flex items-center gap-1.5">
						<span>Vehicle</span>
						<Truck className="w-5 h-5 text-gray-400" />:
					</h4>
					<span>
						{driverDetails?.vehicle_type?.charAt(0).toUpperCase() +
							driverDetails?.vehicle_type?.slice(1) || ""}
					</span>
				</div>
				<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
					<h4 className="flex items-center gap-1.5">
						<span>Plate: </span>
						<Hash className="w-3 h-3 text-gray-400" />:
					</h4>
					<span>{driverDetails?.vehicle_plate}</span>
				</div>
			</div>

			<div className="flex gap-3">
				<a
					href={`tel:${driverDetails?.phone}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl transition-colors text-sm"
				>
					<Phone className="w-4 h-4" />
					Call
				</a>
				<a
					href={`https://wa.me/${driverDetails?.phone}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-xl transition-colors text-sm"
				>
					<MessageSquare className="w-4 h-4" />
					Message
				</a>
			</div>
		</div>
	);
};

export default DriverInfoCard;
