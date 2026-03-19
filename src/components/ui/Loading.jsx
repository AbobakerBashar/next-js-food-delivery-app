import { Loader2 } from "lucide-react";

export default function Loading({ message, size = "lg" }) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
		xl: "h-10 w-10",
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[200px] p-4">
			<Loader2
				className={`animate-spin text-orange-500 mb-3 ${sizeClasses[size]}`}
			/>
			{message && (
				<p className="text-sm text-muted-foreground text-center">{message}</p>
			)}
		</div>
	);
}

// Spinner only variant
export function LoadingSpinner({ size = "lg", className = "" }) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
		xl: "h-10 w-10",
	};

	return (
		<Loader2
			className={`animate-spin text-orange-500 ${sizeClasses[size]} ${className}`}
		/>
	);
}
