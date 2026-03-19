import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Search } from "lucide-react";

const Filteres = ({
	searchQuery,
	setSearchQuery,
	filterStatus,
	statuses,
	handleFilterStatusChange,
}) => {
	return (
		<Card className="mb-8">
			<CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<Input
						placeholder="Search customers or restaurants..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Select value={filterStatus} onValueChange={handleFilterStatusChange}>
					<SelectTrigger>
						<SelectValue placeholder="All Statuses" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						{statuses.map((status) => (
							<SelectItem key={status} value={status}>
								{status.replace("_", " ").toUpperCase()}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardContent>
		</Card>
	);
};

export default Filteres;
