"use client";

import { Button } from "@/components/ui/Button";
import { useUser } from "@/contexts/UserContext";
import { getRecentOrders } from "@/lib/admin-queries";
import {
	createDelivery,
	getAvailableDrivers,
	getDelivery,
	updateDriver,
	updateOrderStatus,
} from "@/lib/queries";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Filteres from "./Filteres";
import OrdersTable from "./OrdersTable";
import PagesNanvigations from "./PagesNanvigations";

const statuses = [
	"confirmed",
	"preparing",
	"picked_up",
	"delivered",
	"cancelled",
];

export default function AdminOrders() {
	const { user, isAdmin } = useUser();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState(
		searchParams.get("status") || "all",
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(searchParams.get("page") || 1);

	const mockOrders = [
		{
			id: 1,
			userName: "John Doe",
			restaurantName: "Pizza Paradise",
			status: "delivered",
			total: 27.15,
			itemsPreview: ["Margherita Pizza x1", "Caesar Salad x1"],
			itemCount: 2,
		},
		{
			id: 2,
			userName: "Jane Smith",
			restaurantName: "Burger House",
			status: "preparing",
			total: 18.99,
			itemsPreview: ["Classic Burger x1"],
			itemCount: 1,
		},
		{
			id: 3,
			userName: "Bob Johnson",
			restaurantName: "Sushi Master",
			status: "out_for_delivery",
			total: 42.5,
			itemsPreview: ["Sushi Roll x2", "Tempura x1"],
			itemCount: 3,
		},
		{
			id: 4,
			userName: "Alice Brown",
			restaurantName: "Thai Spice",
			status: "confirmed",
			total: 22.75,
			itemsPreview: ["Pad Thai x1"],
			itemCount: 1,
		},
		{
			id: 5,
			userName: "Mike Wilson",
			restaurantName: "Taco Fiesta",
			status: "delivered",
			total: 15.99,
			itemsPreview: ["Street Tacos x3"],
			itemCount: 3,
		},
	];

	// Fetch orders from the database (simulated with mock data here)

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const ordersData = await getRecentOrders({
				limit: "all",
			});
			setOrders(ordersData);
			console.log("Fetched orders:", ordersData);
		} catch (error) {
			toast.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleStatusChange = async (orderId, status) => {
		console.log("Changing status for order", orderId, "to", status);

		try {
			setLoading(true);
			switch (status) {
				case "confirmed": {
					// For other status changes, just update the order status
					await updateOrderStatus(orderId, status);
					toast.success("Order marked as confirmed successfully");
					fetchOrders();
					break;
				}
				case "preparing": {
					// For other status changes, just update the order status
					await updateOrderStatus(orderId, status);
					toast.success("Order marked as preparing successfully");
					fetchOrders();
					break;
				}
				case "picked_up": {
					// If changing to out_for_delivery, assign driver and create delivery record
					// Get an available driver
					const drivers = await getAvailableDrivers();
					const driver = drivers.length > 0 ? drivers[0] : null;

					const deliveryData = driver
						? {
								order_id: orderId,
								driver_id: driver.id,
								assigned_at: new Date().toISOString(),
								status: "picked_up",
								picked_up_at: new Date().toISOString(),
								delivered_at: null,
							}
						: {
								order_id: orderId,
								driver_id: null,
								assigned_at: null,
								status: "pending",
								picked_up_at: null,
								delivered_at: null,
							};

					// Update Driver Status if Has been Assigned
					if (driver) await updateDriver(driver.id, { status: "busy" });
					await updateOrderStatus(orderId, "picked_up");

					fetchOrders();
					const delivery = await createDelivery(deliveryData);
					toast.info("Order is out for delivery!");
					console.log("Delivery created:", delivery);

					break;
				}
				case "delivered": {
					// If changing to delivered, update driver status

					// Get the delivery record for this order
					const delivery = await getDelivery(orderId);

					// Update Driver Status if Has been Assigned
					if (delivery?.driver_id) {
						await updateDriver(delivery.driver_id, { status: "available" });
					}
					await updateOrderStatus(orderId, "delivered");
					toast.success("Order marked as delivered!");
					fetchOrders();

					break;
				}
				case "cancelled": {
					// Get the delivery record for this order
					const delivery = await getDelivery(orderId);
					// Update Driver Status if Has been Assigned
					if (delivery?.driver_id) {
						await updateDriver(delivery.driver_id, { status: "available" });
					}
					await updateOrderStatus(orderId, "cancelled");
					toast.success("Order marked as cancelled!");
					fetchOrders();

					break;
				}
				default:
					toast.error("Invalid status");
					return;
			}
		} catch (error) {
			console.error("Error updating order status:", error);
			toast.error("Failed to update status");
		} finally {
			setLoading(false);
		}
	};

	const handleFilterStatusChange = (status) => {
		setFilterStatus(status?.toLowerCase());

		router.push(`/admin/orders?status=${status?.toLowerCase()}&page=${page}`);
	};

	const filteredOrders =
		filterStatus === "all"
			? orders
			: orders.filter(
					(order) => order.status.toLowerCase() === filterStatus.toLowerCase(),
				);
	const currentPageOrders = filteredOrders.slice((page - 1) * 5, page * 5);

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="flex items-center gap-4 mb-8">
				<Button variant="outline" onClick={() => router.push("/admin")}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Dashboard
				</Button>
				<h1 className="text-3xl font-bold flex-1">Manage Orders</h1>
				<Button variant="outline" onClick={fetchOrders} disabled={loading}>
					<RefreshCw
						className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>

			{/* Filters */}
			<Filteres
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				filterStatus={filterStatus}
				statuses={statuses}
				handleFilterStatusChange={handleFilterStatusChange}
			/>

			{/* Orders Table */}
			<OrdersTable
				orders={currentPageOrders}
				loading={loading}
				page={page}
				setPage={setPage}
				handleStatusChange={handleStatusChange}
				statuses={statuses}
			/>

			{/* Recent Orders Table */}
			{/* <RecentOrders recentOrders={filteredOrders} loading={loading} /> */}

			<PagesNanvigations
				totalLength={orders.length}
				page={page}
				setPage={setPage}
				loading={loading}
				filterStatus={filterStatus}
			/>
		</div>
	);
}
