import { useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/useCart";
import { useCurrentUser } from "@/hooks/useUser";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item }) {
	const { data: user } = useCurrentUser();
	const { mutateAsync: removeFromCart, isPending: isRemovingFromCart } =
		useRemoveFromCart();
	const { mutateAsync: updateCartQuantity, isPending: isUpdatingQuantity } =
		useUpdateCartQuantity();

	// Handle Remove Item
	const handleRemove = async () => {
		if (!user) return;
		try {
			await removeFromCart({
				userId: user.id,
				itemId: item.id,
				restaurantId: item.restaurantId,
			});
		} catch (error) {
			console.error("Error removing item from cart:", error);
			toast.error("Failed to remove item from cart");
		}
	};

	// Handle Update Quantity
	const handleUpdateQuantity = async (increase = true) => {
		if (!user) return;
		try {
			const newQuantity = increase ? item.quantity + 1 : item.quantity - 1;
			if (newQuantity <= 0)
				handleRemove(); // Remove item if quantity goes to 0 or below
			else
				await updateCartQuantity({
					userId: user.id,
					itemId: item.id,
					restaurantId: item.restaurantId,
					quantity: newQuantity,
				});
		} catch (error) {
			console.error("Error updating cart quantity:", error);
			toast.error("Failed to update item quantity");
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex gap-4 transition-colors">
			{item.imageUrl && (
				<div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
					<img
						src={item.imageUrl}
						alt={item.name}
						className="w-full h-full object-cover"
					/>
				</div>
			)}
			<div className="flex-1">
				<h3 className="mb-1">{item.name}</h3>
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
					{item.description}
				</p>
				<p className="text-orange-500">${item.price.toFixed(2)}</p>
			</div>

			<div className="flex flex-col items-end justify-between">
				<button
					onClick={handleRemove}
					disabled={isRemovingFromCart}
					aria-label="Remove Item"
					className="text-red-500 hover:text-red-600 transition-colors disabled:cursor-not-allowed disabled:text-red-300 dark:disabled:text-red-500"
				>
					<Trash2 className="w-5 h-5" />
				</button>

				<div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
					<button
						onClick={() => handleUpdateQuantity(false)}
						disabled={isUpdatingQuantity || isRemovingFromCart}
						aria-label="Decrease Quantity"
						className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-600"
					>
						<Minus className="w-4 h-4" />
					</button>
					<span className="w-8 text-center">{item.quantity}</span>
					<button
						onClick={() => handleUpdateQuantity(true)}
						disabled={isUpdatingQuantity || isRemovingFromCart}
						aria-label="Increase Quantity"
						className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-gray-600"
					>
						<Plus className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
