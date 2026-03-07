"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	ShoppingCart,
	UtensilsCrossed,
	Search,
	Sun,
	Moon,
	Heart,
	User,
	Home,
	LogIn,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";

export function Header() {
	const { getCartCount } = useCart();
	const { getFavoritesCount } = useFavorites();
	const { isLoggedIn } = useUser();
	const { isDark, toggleTheme } = useTheme();
	const favCount = getFavoritesCount();
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const cartCount = getCartCount();
	const showSearch = pathname === "/" || pathname === "/restaurants";

	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

	useEffect(() => {
		setSearchQuery(searchParams.get("q") || "");
	}, [searchParams]);

	const handleSearch = (value) => {
		setSearchQuery(value);
		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set("q", value);
		} else {
			params.delete("q");
		}
		const target =
			pathname === "/restaurants" ? "/restaurants" : "/restaurants";
		router.replace(`${target}?${params.toString()}`, { scroll: false });
	};

	return (
		<header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/30 sticky top-0 z-50 transition-colors">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16 gap-4">
					<Link href="/" className="flex items-center gap-2 shrink-0">
						<UtensilsCrossed className="w-8 h-8 text-orange-500" />
						<span className="text-2xl hidden sm:inline">Food Delivery</span>
					</Link>

					{showSearch && (
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
							<input
								type="text"
								placeholder="Search restaurants or cuisines..."
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-500 text-sm transition-colors"
							/>
						</div>
					)}

					<nav className="flex items-center gap-4 sm:gap-6 shrink-0">
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
						<button
							onClick={toggleTheme}
							className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
							aria-label="Toggle dark mode"
						>
							{isDark ? (
								<Sun className="w-5 h-5 text-yellow-400" />
							) : (
								<Moon className="w-5 h-5 text-gray-600" />
							)}
						</button>
					</nav>
				</div>
			</div>
		</header>
	);
}
