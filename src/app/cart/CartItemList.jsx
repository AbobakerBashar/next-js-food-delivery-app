import CartItem from "./CartItem";

export default function CartItemList({ items, onUpdateQuantity, onRemove }) {
	return (
		<div className="lg:col-span-2 space-y-4">
			{items.map((item) => (
				<CartItem
					key={`${item.id}-${item.restaurantId}`}
					item={item}
					onUpdateQuantity={onUpdateQuantity}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
}
