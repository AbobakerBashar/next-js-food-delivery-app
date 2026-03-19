"use client";

import {
	getAdminStats,
	getRecentOrders,
	updateOrderStatus,
} from "@/lib/admin-queries";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useUser } from "@/contexts/UserContext";

import {
	DollarSign,
	LayoutDashboard,
	ShoppingCart,
	Star,
	Truck,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RecentOrders from "./RecentOrders";
import { getSessionUser, useProfile } from "@/hooks/useUser";

export default function AdminDashboard() {
	const { user, isAdmin } = useUser();
	const { data: profile } = useProfile(user?.id);
	// const { session } = getSessionUser();
	// console.log("session", session);
	const router = useRouter();
	const [stats, setStats] = useState(null);
	const [recentOrders, setRecentOrders] = useState([]);
	const [limit, setLimit] = useState(10);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAdminStats = async () => {
			try {
				const statsData = await getAdminStats();
				setStats(statsData);
			} catch (error) {
				console.error("Error fetching admin stats:", error);
			}
		};

		fetchAdminStats();
	}, []);

	useEffect(() => {
		const fetchRecentOrders = async () => {
			try {
				const ordersData = await getRecentOrders({ limit });
				setRecentOrders(ordersData);
			} catch (error) {
				console.error("Error fetching recent orders:", error);
			}
		};

		fetchRecentOrders();
		console.log("recentOrders", recentOrders);
	}, [limit]);

	useEffect(() => {
		// if (!user) {
		// 	router.push("/profile");
		// 	toast.error("Access denied. Admin only.");
		// 	return;
		// }

		const mockStats = {
			orderCount: 1247,
			restaurantCount: 47,
			userCount: 892,
			totalRevenue: 45678.34,
			averageRating: 4.7,
			averageDeliveryTime: 28,
		};
		const mockRecentOrders = [
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
		];

		setStats(mockStats);
		setRecentOrders(mockRecentOrders);
		setLoading(false);
	}, [isAdmin, router]);

	const handleStatusUpdate = async (orderId, newStatus) => {
		try {
			await updateOrderStatus(orderId, newStatus);
			toast.success("Order status updated");
			// Refresh recent orders
			const ordersData = await getRecentOrders({ limit: 10 });
			setRecentOrders(ordersData);
		} catch (error) {
			toast.error("Failed to update status");
		}
	};

	if (!user) return <div className="container mx-auto p-8">Loading...</div>;
	// isAdmin always true for demo
	if (false) return <div className="container mx-auto p-8">Access Denied</div>;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<LayoutDashboard className="w-8 h-8 text-orange-500" />
					<h1 className="text-4xl font-bold">Admin Dashboard</h1>
				</div>
				<p className="text-gray-600 dark:text-gray-400">
					Welcome back, {user.name}. Manage your food delivery platform.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{loading ? (
					Array(6)
						.fill()
						.map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
				) : (
					<>
						<StatCard
							icon={ShoppingCart}
							title="Total Orders"
							value={stats?.orderCount?.toLocaleString()}
						/>
						<StatCard
							icon={DollarSign}
							title="Total Revenue"
							value={`$${stats?.totalRevenue?.toLocaleString() || "0"}`}
						/>
						<StatCard
							icon={Users}
							title="Total Users"
							value={stats?.userCount?.toLocaleString()}
						/>
						<StatCard
							icon={Truck}
							title="Restaurants"
							value={stats?.restaurantCount?.toLocaleString()}
						/>
						<StatCard
							icon={Star}
							title="Avg Rating"
							value={stats?.averageRating || "0"}
							change="+0.2"
						/>
						<StatCard
							icon={Truck}
							title="Avg Delivery"
							value={`${stats?.averageDeliveryTime || 0} min`}
						/>
					</>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Recent Orders Table */}
				<RecentOrders
					recentOrders={recentOrders}
					loading={loading}
					setLimit={setLimit}
				/>

				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button
							className="w-full"
							onClick={() => router.push("/admin/orders")}
						>
							View All Orders
						</Button>
						<Button
							variant="outline"
							className="w-full"
							onClick={() => router.push("/admin/restaurants")}
						>
							Manage Restaurants
						</Button>
						<Button variant="outline" className="w-full">
							View Users
						</Button>
						<Button variant="ghost" className="w-full">
							Analytics Report
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function StatCard({ icon: Icon, title, value, change }) {
	return (
		<Card className="hover:shadow-lg transition-shadow">
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-2">
					<Icon className="w-8 h-8 text-gray-500" />
					{change && <Badge>{change}</Badge>}
				</div>
				<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
					{value}
				</h3>
				<p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
			</CardContent>
		</Card>
	);
}
