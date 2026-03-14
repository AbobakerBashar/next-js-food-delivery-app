"use client";

import { getDelivery, getOrderById, getOrderDriver } from "@/lib/queries";
import { CheckCircle, ChefHat, Package, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContactSupport from "./ContactSupport";
import DeliveryAddress from "./DeliveryAddress";
import DriverInfoCard from "./DriverInfoCard";
import LiveMap from "./LiveMap";
import OrderSummary from "./OrderSummary";
import StatusTimeline from "./StatusTimeline";
import TopBar from "./TopBar";

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
	{ lat: 40.746, lng: -73.977 },
	{ lat: 40.743, lng: -73.975 },
	{ lat: 40.74, lng: -73.973 },
];

export default function OrderTrackingPage({ params }) {
	const { orderId } = useParams();
	const [orderDetails, setOrderDetails] = useState(null);
	const [driverDetails, setDriverDetails] = useState(null);
	const [delivery, setdelivery] = useState(null);
	const [loading, setLoading] = useState(false);
	const [currentStatusIndex, setCurrentStatusIndex] = useState(1);
	const [driverPosition, setDriverPosition] = useState(0);
	const [eta, setEta] = useState(25);

	// Fetch delivery details on mount
	useEffect(() => {
		const fetchDelivery = async () => {
			try {
				setLoading(true);
				const res = await getDelivery(orderId);
				setdelivery(res);
			} catch (error) {
				console.error("Error fetching delivery details:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchDelivery();
	}, []);

	// Fetch order details on mount
	useEffect(() => {
		const fetchOrderDetails = async () => {
			try {
				setLoading(true);
				const res = await getOrderById(orderId);
				setOrderDetails(res);
			} catch (error) {
				console.error("Error fetching order details:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrderDetails();
	}, []);

	// Fetch driver details on mount
	useEffect(() => {
		const fetchDriver = async () => {
			try {
				setLoading(true);
				const res = await getOrderDriver(orderId);
				setDriverDetails(res);
			} catch (error) {
				console.error("Error fetching driver details:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchDriver();
	}, []);

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

	if (loading) <p>Loading...</p>;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-950">
			{/* Top Bar */}
			<TopBar
				orderId={orderId}
				isDelivered={isDelivered}
				eta={eta}
				mockOrderDetails={mockOrderDetails}
			/>

			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Live Map */}
						<LiveMap
							driver={driverDetails}
							routePoints={routePoints}
							driverPosition={driverPosition}
							currentStatusIndex={currentStatusIndex}
							isDelivered={isDelivered}
						/>

						{/* Status Timeline */}
						<StatusTimeline
							orderStatuses={orderStatuses}
							currentStatusIndex={currentStatusIndex}
						/>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Driver Info Card */}
						{currentStatusIndex >= 2 && (
							<DriverInfoCard driverDetails={driverDetails} />
						)}

						{/* Delivery Address */}
						<DeliveryAddress address={orderDetails?.delivery_address} />

						{/* Order Summary */}
						<OrderSummary orderDetails={orderDetails} />

						{/* Help */}
						<ContactSupport orderId={orderId} user_id={orderDetails?.user_id} />
					</div>
				</div>
			</div>
		</div>
	);
}
