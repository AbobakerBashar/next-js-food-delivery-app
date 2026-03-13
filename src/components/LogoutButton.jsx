import { LogOut } from "lucide-react";

const LogoutButton = ({ handleLogout }) => {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
			<button
				onClick={handleLogout}
				className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-gray-200 hover:text-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
			>
				<LogOut className="w-5 h-5" />
				Log Out
			</button>
		</div>
	);
};

export default LogoutButton;
