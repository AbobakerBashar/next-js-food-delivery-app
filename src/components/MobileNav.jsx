import Link from "next/link";
import { usePathname } from "next/navigation";

import { Heart, LogIn, ShoppingCart, User, X } from "lucide-react";
import ThemeButton from "./ThemeButton";

const MobileNav = ({
	favCount,
	cartCount,
	isLoggedIn,
	showMobileNav,
	setShowMobileNav,
}) => {
	const pathname = usePathname();

	return (
		<div
			className={`md:hidden inset-y-0 bg-black/50 fixed left-0 top-0 w-full h-screen shadow-xl z-50 ${showMobileNav ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
		>
			<nav className="bg-gray-200 dark:bg-gray-700 w-3/4 h-full p-6 flex flex-col gap-6 shadow-lg">
				<button
					className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors hover:text-orange-600 self-end border border-gray-300 dark:border-gray-600"
					aria-label="Close mobile navigation"
					onClick={() => setShowMobileNav(false)}
				>
					<X className="w-6 h-6" />
				</button>
				<Link
					onClick={() => setShowMobileNav(false)}
					href="/"
					className={`hover:text-orange-500 transition-colors shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === "/" ? "text-orange-500" : ""}`}
				>
					Home
				</Link>
				<Link
					href="/restaurants"
					onClick={() => setShowMobileNav(false)}
					className={`hover:text-orange-500 transition-colors shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === "/restaurants" ? "text-orange-500" : ""}`}
				>
					Restaurants
				</Link>
				<Link
					href="/favorites"
					onClick={() => setShowMobileNav(false)}
					className={`relative flex items-center gap-1 hover:text-orange-500 transition-colors shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === "/favorites" ? "text-orange-500" : ""}`}
				>
					<Heart className="w-5 h-5" /> <span>Favorites</span>
					{favCount > 0 && (
						<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
							{favCount}
						</span>
					)}
				</Link>
				<Link
					href="/cart"
					onClick={() => setShowMobileNav(false)}
					className="relative flex items-center gap-2 hover:text-orange-500 transition-colors  shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
				>
					<ShoppingCart className="w-6 h-6" />
					{cartCount > 0 && (
						<span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
							{cartCount}
						</span>
					)}
					<span className={`${pathname === "/cart" ? "text-orange-500" : ""}`}>
						Cart
					</span>
				</Link>
				{isLoggedIn ? (
					<Link
						href="/profile"
						onClick={() => setShowMobileNav(false)}
						className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md  ${pathname === "/profile" ? "text-orange-500" : ""} flex items-center gap-1.5`}
						aria-label="Profile"
					>
						<User className="w-5 h-5" />
						<span>Profile</span>
					</Link>
				) : (
					<Link
						href="/login"
						onClick={() => setShowMobileNav(false)}
						className={`flex items-center gap-1.5 hover:text-orange-500 transition-colors text-sm font-medium shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md ${pathname === "/login" || pathname === "/signup" ? "text-orange-500" : ""}`}
					>
						<LogIn className="w-4 h-4" />
						<span className="hidden sm:inline">Login</span>
					</Link>
				)}
				<ThemeButton
					onClick={() => setShowMobileNav(false)}
					className=" shadow shadow-gray-400 dark:shadow-gray-600 px-2 py-1.5 rounded-md"
				/>
			</nav>
		</div>
	);
};

export default MobileNav;
