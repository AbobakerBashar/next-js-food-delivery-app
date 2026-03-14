import { MessageSquare, Navigation, Phone } from "lucide-react";

const LiveMap = ({
	driver,
	routePoints,
	driverPosition,
	currentStatusIndex,
	isDelivered,
}) => {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
			<div className="relative h-80 bg-gray-100 dark:bg-gray-700">
				{/* Map Placeholder with animated elements */}
				<iframe
					src={`https://www.openstreetmap.org/export/embed.html?bbox=-73.995,40.735,-73.965,40.765&layer=mapnik&marker=${routePoints[driverPosition].lat},${routePoints[driverPosition].lng}`}
					className="w-full h-full border-0"
					title="Delivery Map"
					loading="lazy"
				/>

				{/* Map overlay with driver info */}
				{currentStatusIndex >= 2 && !isDelivered && (
					<div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between shadow-lg">
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
									<Navigation className="w-5 h-5 text-white" />
								</div>
								<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
							</div>
							<div>
								<p className="font-semibold text-sm">{driver.name}</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{driver.vehicle}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors">
								<Phone className="w-4 h-4" />
							</button>
							<button className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors">
								<MessageSquare className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default LiveMap;
