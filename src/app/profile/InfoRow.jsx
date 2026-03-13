function InfoRow({ label, value }) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
			<span className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">
				{label}
			</span>
			<span className="text-gray-900 dark:text-gray-100">{value || "—"}</span>
		</div>
	);
}

export default InfoRow;
