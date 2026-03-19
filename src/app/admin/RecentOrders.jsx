import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
// import { Badge } from "lucide-react";

const RecentOrders = ({ recentOrders, loading }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					Recent Orders
					<Badge variant="outline" className="text-xs">
						Live
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{loading ? (
					<Skeleton className="h-64 w-full" />
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-16">#</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Restaurant</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">$ Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentOrders.map((order) => (
								<TableRow key={order.id}>
									{/* {console.log("order in table", order)} */}
									<TableCell className="font-medium">#{order.id}</TableCell>
									<TableCell>{order.userName}</TableCell>
									<TableCell>{order.restaurantName}</TableCell>
									<TableCell>
										<StatusBadge status={order.status} />
									</TableCell>
									<TableCell className="text-right font-medium">
										${order.total?.toLocaleString()}
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

export default RecentOrders;

function StatusBadge({ status }) {
	const statusConfig = {
		confirmed: { label: "Confirmed", variant: "default" },
		preparing: { label: "Preparing", variant: "secondary" },
		out_for_delivery: { label: "Out for Delivery", variant: "outline" },
		delivered: { label: "Delivered", variant: "success" },
		cancelled: { label: "Cancelled", variant: "destructive" },
	};

	const config = statusConfig[status] || {
		label: status,
		variant: "secondary",
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
			className = "bg-gray-100 bg-gray-600";
			break;
	}

	return (
		<Badge className={className} variant={config.variant}>
			{config.label}
		</Badge>
	);
}
