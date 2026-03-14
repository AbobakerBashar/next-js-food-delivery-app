const OrderSummary = ({ orderDetails }) => {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
			<h2 className="text-lg font-semibold mb-4">Order Summary</h2>

			<div className="space-y-3 mb-4">
				{orderDetails?.order_items?.map((item, i) => (
					<div key={item.id}>
						<h5 className="text-sm text-gray-500 dark:text-gray-400 mb-3">
							{item.restaurants?.name || "Restaurant Name"}
						</h5>
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-600 dark:text-gray-400">
								{item.quantity}x {item.name}
							</span>
							<span className="text-gray-900 dark:text-gray-100">
								${item.price.toFixed(2)}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className="border-t dark:border-gray-700 pt-3 space-y-2">
				<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
					<span>Subtotal</span>
					<span>${orderDetails?.subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
					<span>Delivery Fee</span>
					<span>${orderDetails?.delivery_fee.toFixed(2)}</span>
				</div>
				<div className="flex justify-between font-semibold pt-2 border-t dark:border-gray-700">
					<span>Total</span>
					<span className="text-orange-500">
						${orderDetails?.total.toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default OrderSummary;
