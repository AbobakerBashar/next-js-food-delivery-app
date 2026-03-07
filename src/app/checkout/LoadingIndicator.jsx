import { Loader2 } from "lucide-react";

export default function LoadingIndicator({ message = "Loading..." }) {
	return (
		<div className="flex items-center justify-center py-20">
			<Loader2 className="w-8 h-8 animate-spin text-orange-500" />
			<span className="ml-3 text-gray-600 dark:text-gray-400">{message}</span>
		</div>
	);
}
