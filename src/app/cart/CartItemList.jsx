import Loading from "@/components/ui/Loading";
import CartItem from "./CartItem";

export default function CartItemList({ items, isLoading }) {
	if (isLoading) return <Loading message="Loading cart items..." />;

	return (
		<div className="lg:col-span-2 space-y-4">
			{items.map((item) => (
				<CartItem key={`${item.id}-${item.restaurantId}`} item={item} />
			))}
		</div>
	);
}
