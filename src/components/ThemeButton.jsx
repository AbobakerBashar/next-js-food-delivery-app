import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeButton = ({ className, onClick }) => {
	const { isDark, toggleTheme } = useTheme();

	return (
		<button
			onClick={() => {
				toggleTheme();
				onClick?.();
			}}
			className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
			aria-label="Toggle dark mode"
		>
			{isDark ? (
				<Sun className="w-5 h-5 text-yellow-400" />
			) : (
				<Moon className="w-5 h-5 text-gray-600" />
			)}
		</button>
	);
};

export default ThemeButton;
