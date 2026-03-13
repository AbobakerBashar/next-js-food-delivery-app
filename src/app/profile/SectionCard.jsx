function SectionCard({ icon: Icon, title, children, className }) {
	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors ${className}`}
		>
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
					<Icon className="w-5 h-5 text-orange-500" />
				</div>
				<h2 className="text-xl font-semibold">{title}</h2>
			</div>
			{children}
		</div>
	);
}

export default SectionCard;
