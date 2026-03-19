"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useUser } from "@/contexts/UserContext";
import { getAllRestaurantsAdmin } from "@/lib/queries";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";

const mockRestaurants = [
	{
		id: 1,
		name: "Pizza Paradise",
		cuisine: "Italian",
		rating: 4.8,
		deliveryTime: 25,
		orderCount: 247,
		totalRevenue: 12567.89,
		imageUrl: "/images/restaurants/restaurant-1-pizza-paradise.jpg",
	},
	{
		id: 2,
		name: "Burger House",
		cuisine: "American",
		rating: 4.5,
		deliveryTime: 20,
		orderCount: 189,
		totalRevenue: 8923.45,
		imageUrl: "/images/restaurants/restaurant-2-burger-house.jpg",
	},
	{
		id: 3,
		name: "Sushi Master",
		cuisine: "Japanese",
		rating: 4.9,
		deliveryTime: 30,
		orderCount: 156,
		totalRevenue: 23456.78,
		imageUrl: "/images/restaurants/restaurant-3-sushi-master.jpg",
	},
	{
		id: 4,
		name: "Taco Fiesta",
		cuisine: "Mexican",
		rating: 4.3,
		deliveryTime: 18,
		orderCount: 98,
		totalRevenue: 4567.23,
		imageUrl: "/images/restaurants/restaurant-4-taco-fiesta.jpg",
	},
	{
		id: 5,
		name: "Thai Spice",
		cuisine: "Thai",
		rating: 4.6,
		deliveryTime: 28,
		orderCount: 134,
		totalRevenue: 17890.12,
		imageUrl: "/images/restaurants/restaurant-5-thai-spice.jpg",
	},
	{
		id: 6,
		name: "Pasta Corner",
		cuisine: "Italian",
		rating: 4.2,
		deliveryTime: 35,
		orderCount: 67,
		totalRevenue: 3456.78,
		imageUrl: "/images/restaurants/restaurant-6-pasta-corner.jpg",
	},
	{
		id: 7,
		name: "Sahara Grill",
		cuisine: "African",
		rating: 4.7,
		deliveryTime: 22,
		orderCount: 112,
		totalRevenue: 9876.54,
		imageUrl: "/images/restaurants/restaurant-7-sahara-grill.jpg",
	},
];

export default function AdminRestaurants() {
	const { user, isAdmin } = useUser();
	const router = useRouter();
	const [restaurants, setRestaurants] = useState(mockRestaurants);
	const [loading, setLoading] = useState(false);

	const fetchRestaurants = async () => {
		try {
			setLoading(true);
			setTimeout(() => {
				setRestaurants(mockRestaurants);
			}, 800);
		} catch (error) {
			toast.error("Failed to load restaurants");
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	if (!isAdmin) {
	// 		router.push("/admin");
	// 		return;
	// 	}
	// 	fetchRestaurants();
	// }, [isAdmin, router]);

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			<div className="flex items-center gap-4 mb-8">
				<Button variant="outline" onClick={() => router.push("/admin")}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Dashboard
				</Button>
				<h1 className="text-3xl font-bold flex-1">Restaurants Management</h1>
				<Button variant="outline" onClick={fetchRestaurants} disabled={loading}>
					<RefreshCw
						className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Restaurants ({restaurants.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="p-4 border rounded-lg">
									<div className="flex items-center space-x-4 mb-2">
										<Skeleton className="h-12 w-12 rounded-full" />
										<Skeleton className="h-5 w-48" />
									</div>
									<div className="space-y-1">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-64" />
									</div>
								</div>
							))}
						</div>
					) : restaurants.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								🏪
							</div>
							<h3 className="text-lg font-medium mb-2">No restaurants found</h3>
							<p className="text-gray-500">
								Get started by adding your first restaurant.
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Image</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Cuisine</TableHead>
									<TableHead>Rating</TableHead>
									<TableHead>Orders</TableHead>
									<TableHead>Revenue</TableHead>
									<TableHead>Delivery Time</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{restaurants.map((restaurant) => (
									<TableRow key={restaurant.id}>
										<TableCell>
											<div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
												{restaurant.imageUrl ? (
													<img
														src={restaurant.imageUrl}
														alt={restaurant.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<span className="text-xs text-gray-500">
														No image
													</span>
												)}
											</div>
										</TableCell>
										<TableCell className="font-medium">
											{restaurant.name}
										</TableCell>
										<TableCell>
											<Badge variant="outline">{restaurant.cuisine}</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<span className="font-bold text-lg">
													{restaurant.rating}
												</span>
												<span className="text-sm text-gray-500">/ 5</span>
											</div>
										</TableCell>
										<TableCell className="font-mono">
											{restaurant.orderCount}
										</TableCell>
										<TableCell className="font-mono text-green-600 font-semibold">
											${restaurant.totalRevenue.toLocaleString()}
										</TableCell>
										<TableCell>{restaurant.deliveryTime} min</TableCell>
										<TableCell>
											<Badge
												variant={
													restaurant.orderCount > 0 ? "default" : "secondary"
												}
											>
												{restaurant.orderCount > 0 ? "Active" : "Inactive"}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button variant="outline" size="sm">
													Edit
												</Button>
												<Button variant="ghost" size="sm">
													Menu
												</Button>
												{restaurant.orderCount === 0 && (
													<Button variant="destructive" size="sm">
														Delete
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
