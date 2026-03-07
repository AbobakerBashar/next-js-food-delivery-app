"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	ChefHat,
	Package,
	Truck,
	CheckCircle,
	Phone,
	MessageSquare,
	Star,
	MapPin,
	Clock,
	ArrowLeft,
	Navigation,
} from "lucide-react";

const orderStatuses = [
	{
		key: "confirmed",
		label: "Order Confirmed",
		description: "Your order has been received",
		icon: CheckCircle,
	},
	{
		key: "preparing",
		label: "Preparing",
		description: "Restaurant is preparing your food",
		icon: ChefHat,
	},
	{
		key: "picked",
		label: "Picked Up",
		description: "Driver has picked up your order",
		icon: Package,
	},
	{
		key: "on_the_way",
		label: "On the Way",
		description: "Your order is on the way to you",
		icon: Truck,
	},
	{
		key: "delivered",
		label: "Delivered",
		description: "Enjoy your meal!",
		icon: CheckCircle,
	},
];

const mockDriver = {
	name: "Michael Rodriguez",
	photo:
		"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
	rating: 4.9,
	totalDeliveries: 1248,
	vehicle: "Honda Civic · White",
	licensePlate: "ABC 1234",
	phone: "+1 (555) 123-4567",
};

const mockOrderDetails = {
	restaurant: "Pizza Paradise",
	items: [
		{ name: "Margherita Pizza", qty: 1, price: 12.99 },
		{ name: "Caesar Salad", qty: 1, price: 8.99 },
	],
	subtotal: 21.98,
	deliveryFee: 2.99,
	total: 27.15,
	estimatedDelivery: "7:45 PM",
	address: "123 Main Street, Apt 4B",
};

// Simulated route coordinates for the delivery path
const routePoints = [
	{ lat: 40.758, lng: -73.9855 },
	{ lat: 40.755, lng: -73.983 },
	{ lat: 40.752, lng: -73.981 },
	{ lat: 40.749, lng: -73.979 },
	{ lat: 40.746, lng: -73.977 },
	{ lat: 40.743, lng: -73.975 },
	{ lat: 40.74, lng: -73.973 },
];

export default function OrderTrackingPage({ params }) {
	const [orderId, setOrderId] = useState("");
	const [currentStatusIndex, setCurrentStatusIndex] = useState(1);
	const [driverPosition, setDriverPosition] = useState(0);
	const [eta, setEta] = useState(25);

	useEffect(() => {
		params.then((p) => setOrderId(p.orderId));
	}, [params]);

	// Simulate order status progression
	useEffect(() => {
		const statusInterval = setInterval(() => {
			setCurrentStatusIndex((prev) => {
				if (prev >= orderStatuses.length - 1) {
					clearInterval(statusInterval);
					return prev;
				}
				return prev + 1;
			});
		}, 8000);

		return () => clearInterval(statusInterval);
	}, []);

	// Simulate driver movement
	useEffect(() => {
		if (currentStatusIndex >= 2) {
			const moveInterval = setInterval(() => {
				setDriverPosition((prev) => {
					if (prev >= routePoints.length - 1) {
						clearInterval(moveInterval);
						return prev;
					}
					return prev + 1;
				});
			}, 3000);

			return () => clearInterval(moveInterval);
		}
	}, [currentStatusIndex]);

	// Simulate ETA countdown
	useEffect(() => {
		const etaInterval = setInterval(() => {
			setEta((prev) => {
				if (prev <= 0) {
					clearInterval(etaInterval);
					return 0;
				}
				return prev - 1;
			});
		}, 60000);

		return () => clearInterval(etaInterval);
	}, []);

	const currentStatus = orderStatuses[currentStatusIndex];
	const isDelivered = currentStatus.key === "delivered";

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			{/* Top Bar */}
			<div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-16 z-40 transition-colors">
				<div className="container mx-auto px-4 py-3 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Link
							href="/"
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
						</Link>
						<div>
							<h1 className="font-semibold">Order #{orderId}</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{isDelivered
									? "Delivered"
									: `Estimated arrival: ${mockOrderDetails.estimatedDelivery}`}
							</p>
						</div>
					</div>
					{!isDelivered && (
						<div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full">
							<Clock className="w-4 h-4" />
							<span className="font-semibold text-sm">{eta} min</span>
						</div>
					)}
				</div>
			</div>

			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Live Map */}
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
												<p className="font-semibold text-sm">
													{mockDriver.name}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{mockDriver.vehicle}
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

						{/* Status Timeline */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
							<h2 className="text-xl font-semibold mb-6">Order Status</h2>
							<div className="space-y-0">
								{orderStatuses.map((status, index) => {
									const Icon = status.icon;
									const isActive = index === currentStatusIndex;
									const isCompleted = index < currentStatusIndex;
									const isPending = index > currentStatusIndex;

									return (
										<div key={status.key} className="flex gap-4">
											{/* Timeline line + circle */}
											<div className="flex flex-col items-center">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
														isCompleted
															? "bg-green-500 text-white"
															: isActive
																? "bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/50"
																: "bg-gray-100 dark:bg-gray-700 text-gray-400"
													}`}
												>
													{isCompleted ? (
														<CheckCircle className="w-5 h-5" />
													) : (
														<Icon className="w-5 h-5" />
													)}
												</div>
												{index < orderStatuses.length - 1 && (
													<div
														className={`w-0.5 h-12 transition-all duration-500 ${
															isCompleted
																? "bg-green-500"
																: "bg-gray-200 dark:bg-gray-700"
														}`}
													/>
												)}
											</div>

											{/* Status text */}
											<div className="pb-10">
												<p
													className={`font-semibold transition-colors ${
														isCompleted
															? "text-green-600"
															: isActive
																? "text-orange-600"
																: "text-gray-400"
													}`}
												>
													{status.label}
													{isActive && (
														<span className="ml-2 inline-flex items-center gap-1 text-xs font-normal bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
															<span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
															In Progress
														</span>
													)}
												</p>
												<p
													className={`text-sm mt-0.5 ${
														isPending
															? "text-gray-300 dark:text-gray-600"
															: "text-gray-500 dark:text-gray-400"
													}`}
												>
													{status.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Driver Info Card */}
						{currentStatusIndex >= 2 && (
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
								<h2 className="text-lg font-semibold mb-4">Your Driver</h2>
								<div className="flex items-center gap-4 mb-4">
									<img
										src={mockDriver.photo}
										alt={mockDriver.name}
										className="w-16 h-16 rounded-full object-cover"
									/>
									<div>
										<p className="font-semibold text-lg">{mockDriver.name}</p>
										<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
											<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
											<span>{mockDriver.rating}</span>
											<span className="mx-1">·</span>
											<span>{mockDriver.totalDeliveries} deliveries</span>
										</div>
									</div>
								</div>

								<div className="space-y-3 mb-5">
									<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
										<Truck className="w-4 h-4 text-gray-400" />
										<span>{mockDriver.vehicle}</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
										<span className="w-4 h-4 text-center text-gray-400 text-xs font-bold">
											#
										</span>
										<span>{mockDriver.licensePlate}</span>
									</div>
								</div>

								<div className="flex gap-3">
									<button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl transition-colors text-sm">
										<Phone className="w-4 h-4" />
										Call
									</button>
									<button className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl transition-colors text-sm">
										<MessageSquare className="w-4 h-4" />
										Message
									</button>
								</div>
							</div>
						)}

						{/* Delivery Address */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
							<h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
							<div className="flex items-start gap-3">
								<MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									{mockOrderDetails.address}
								</p>
							</div>
						</div>

						{/* Order Summary */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
							<h2 className="text-lg font-semibold mb-4">Order Summary</h2>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
								{mockOrderDetails.restaurant}
							</p>

							<div className="space-y-3 mb-4">
								{mockOrderDetails.items.map((item, i) => (
									<div
										key={i}
										className="flex items-center justify-between text-sm"
									>
										<span className="text-gray-600 dark:text-gray-400">
											{item.qty}x {item.name}
										</span>
										<span className="text-gray-900 dark:text-gray-100">
											${item.price.toFixed(2)}
										</span>
									</div>
								))}
							</div>

							<div className="border-t dark:border-gray-700 pt-3 space-y-2">
								<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
									<span>Subtotal</span>
									<span>${mockOrderDetails.subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
									<span>Delivery Fee</span>
									<span>${mockOrderDetails.deliveryFee.toFixed(2)}</span>
								</div>
								<div className="flex justify-between font-semibold pt-2 border-t dark:border-gray-700">
									<span>Total</span>
									<span className="text-orange-500">
										${mockOrderDetails.total.toFixed(2)}
									</span>
								</div>
							</div>
						</div>

						{/* Help */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
							<h2 className="text-lg font-semibold mb-2">Need Help?</h2>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
								Having issues with your order?
							</p>
							<button className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								Contact Support
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
