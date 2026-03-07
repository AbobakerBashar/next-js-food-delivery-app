import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
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
					onClick={() => onRemove(item.id, item.restaurantId)}
					className="text-red-500 hover:text-red-600 transition-colors"
				>
					<Trash2 className="w-5 h-5" />
				</button>

				<div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
					<button
						onClick={() =>
							onUpdateQuantity(item.id, item.restaurantId, item.quantity - 1)
						}
						className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
					>
						<Minus className="w-4 h-4" />
					</button>
					<span className="w-8 text-center">{item.quantity}</span>
					<button
						onClick={() =>
							onUpdateQuantity(item.id, item.restaurantId, item.quantity + 1)
						}
						className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
					>
						<Plus className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
