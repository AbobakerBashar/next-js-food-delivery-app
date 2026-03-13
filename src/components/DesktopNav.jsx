import Link from "next/link";
import { usePathname } from "next/navigation";

import { Heart, LogIn, ShoppingCart, User } from "lucide-react";
import ThemeButton from "./ThemeButton";

const DesktopNav = ({ favCount, cartCount, isLoggedIn }) => {
	const pathname = usePathname();

	return (
		<nav className="hidden md:flex items-center gap-4 sm:gap-6 shrink-0">
			<Link
				href="/"
				className={`hover:text-orange-500 transition-colors ${pathname === "/" ? "text-orange-500" : ""}`}
			>
				Home
			</Link>
			<Link
				href="/restaurants"
				className={`hover:text-orange-500 transition-colors ${pathname === "/restaurants" ? "text-orange-500" : ""}`}
			>
				Restaurants
			</Link>
			<Link
				href="/favorites"
				className={`relative flex items-center gap-1 hover:text-orange-500 transition-colors ${pathname === "/favorites" ? "text-orange-500" : ""}`}
			>
				<Heart className="w-5 h-5" />
				{favCount > 0 && (
					<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
						{favCount}
					</span>
				)}
			</Link>
			<Link
				href="/cart"
				className="relative flex items-center gap-2 hover:text-orange-500 transition-colors"
			>
				<ShoppingCart className="w-6 h-6" />
				{cartCount > 0 && (
					<span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
						{cartCount}
					</span>
				)}
				<span>Cart</span>
			</Link>
			{isLoggedIn ? (
				<Link
					href="/profile"
					className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${pathname === "/profile" ? "text-orange-500" : ""}`}
					aria-label="Profile"
				>
					<User className="w-5 h-5" />
				</Link>
			) : (
				<Link
					href="/login"
					className={`flex items-center gap-1.5 hover:text-orange-500 transition-colors text-sm font-medium ${pathname === "/login" || pathname === "/signup" ? "text-orange-500" : ""}`}
				>
					<LogIn className="w-4 h-4" />
					<span className="hidden sm:inline">Login</span>
				</Link>
			)}
			<ThemeButton />
		</nav>
	);
};

export default DesktopNav;
