import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { ShoppingCart } from "lucide-react";

const OrdersTable = ({
	orders,
	loading,
	page,
	handleStatusChange,
	statuses,
}) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle>Orders ({orders.length})</CardTitle>
					<div className="text-sm text-gray-500">
						Page {page} • {loading ? "Loading..." : "Live Data"}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center p-4 space-x-4">
								<div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-48" />
								</div>
							</div>
						))}
					</div>
				) : orders.length === 0 ? (
					<div className="text-center py-12">
						<ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
						<h3 className="text-lg font-medium mb-2">No orders found</h3>
						<p className="text-gray-500">
							Try adjusting your search or filter criteria.
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-16">#</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Restaurant</TableHead>
								<TableHead>Items</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-medium">#{order.id}</TableCell>
									<TableCell className="font-medium">
										{order.userName}
									</TableCell>
									<TableCell>{order.restaurantName}</TableCell>
									<TableCell className="max-w-xs">
										<div className="space-y-1">
											{order.itemsPreview.map((item, i) => (
												<div key={i} className="text-sm text-gray-600 truncate">
													{item}
												</div>
											))}
											{order.itemCount > 3 && (
												<div className="text-xs text-gray-500">
													+{order.itemCount - 3} more
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										<StatusBadge status={order?.status} />
									</TableCell>
									<TableCell className="text-right font-mono font-semibold">
										${order.total?.toLocaleString() || "0"}
									</TableCell>
									<TableCell>
										<Select
											disabled={
												loading ||
												order.status.toLowerCase() === "delivered" ||
												order.status.toLowerCase() === "cancelled"
											}
											value={order?.status}
											onValueChange={(status) =>
												handleStatusChange(order.id, status)
											}
										>
											<SelectTrigger className="w-32">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{statuses.map((status) => (
													<SelectItem key={status} value={status}>
														{status.replace("_", " ").toUpperCase()}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
};

export default OrdersTable;

function StatusBadge({ status }) {
	const variants = {
		confirmed: "default",
		preparing: "secondary",
		out_for_delivery: "outline",
		delivered: "default",
		cancelled: "destructive",
	};

	const labels = {
		confirmed: "Confirmed",
		preparing: "Preparing",
		picked_up: "Picked Up",
		delivered: "Delivered",
		cancelled: "Cancelled",
	};

	let className;
	switch (status.toLowerCase()) {
		case "confirmed":
			className = "text-blue-100 bg-blue-600";
			break;
		case "preparing":
			className = "text-yellow-100 bg-yellow-800";
			break;
		case "picked_up":
			className = "text-orange-100 bg-orange-800";
			break;
		case "delivered":
			className = "text-green-100 bg-green-600";
			break;
		case "cancelled":
			className = "text-red-100 bg-red-600";
			break;
		default:
			className = "text-gray-100 bg-gray-600";
			break;
	}

	return (
		<Badge className={className} variant={variants[status] || "secondary"}>
			{labels[status] || status}
		</Badge>
	);
}
