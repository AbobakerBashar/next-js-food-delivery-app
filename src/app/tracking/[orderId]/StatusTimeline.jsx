import { CheckCircle } from "lucide-react";

const StatusTimeline = ({ orderStatuses, currentStatusIndex }) => {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
			<h2 className="text-xl font-semibold mb-6">Order Status</h2>
			<div className="space-y-0">
				{orderStatuses.map((status, index) => {
					const Icon = status.icon;
					const isActive = index === currentStatusIndex;
					const isCompleted = index < currentStatusIndex;
					const isPending = index > currentStatusIndex;

					return (
						<div key={status.key} className="flex gap-4">
							{/* Timeline line + circle */}
							<div className="flex flex-col items-center">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
										isCompleted
											? "bg-green-500 text-white"
											: isActive
												? "bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/50"
												: "bg-gray-100 dark:bg-gray-700 text-gray-400"
									}`}
								>
									{isCompleted ? (
										<CheckCircle className="w-5 h-5" />
									) : (
										<Icon className="w-5 h-5" />
									)}
								</div>
								{index < orderStatuses.length - 1 && (
									<div
										className={`w-0.5 h-12 transition-all duration-500 ${
											isCompleted
												? "bg-green-500"
												: "bg-gray-200 dark:bg-gray-700"
										}`}
									/>
								)}
							</div>

							{/* Status text */}
							<div className="pb-10">
								<p
									className={`font-semibold transition-colors ${
										isCompleted
											? "text-green-600"
											: isActive
												? "text-orange-600"
												: "text-gray-400"
									}`}
								>
									{status.label}
									{isActive && (
										<span className="ml-2 inline-flex items-center gap-1 text-xs font-normal bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
											<span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
											In Progress
										</span>
									)}
								</p>
								<p
									className={`text-sm mt-0.5 ${
										isPending
											? "text-gray-300 dark:text-gray-600"
											: "text-gray-500 dark:text-gray-400"
									}`}
								>
									{status.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default StatusTimeline;
