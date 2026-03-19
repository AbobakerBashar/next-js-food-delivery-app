"use client";

import { useGetCart } from "@/hooks/useCart";
import {
	useGetFavoriteDishes,
	useGetFavoriteRestaurants,
} from "@/hooks/useFavorits";
import { useCurrentUser } from "@/hooks/useUser";
import { Menu, Search, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export function Header() {
	const pathname = usePathname();
	const router = useRouter();

	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
	const showSearch = pathname === "/" || pathname === "/restaurants";

	const [showMobileNav, setShowMobileNav] = useState(false);

	const { data: user } = useCurrentUser();

	const { data: cart, isLoading: isLoadingCart } = useGetCart(user?.id);
	const cartCount =
		cart?.reduce((total, item) => total + item.quantity, 0) || 0;

	// Calculate favorites count
	const { data: dishes, isLoading: isLoadingDishes } = useGetFavoriteDishes(
		user?.id,
	);
	const { data: restaurants, isLoading: isLoadingRestaurants } =
		useGetFavoriteRestaurants(user?.id);
	const favCount = dishes?.length + restaurants?.length || 0;

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

					<DesktopNav
						favCount={favCount}
						cartCount={cartCount}
						isLoggedIn={Boolean(user?.id)}
					/>

					<div className="md:hidden relative">
						<button
							className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md transition-colors hover:text-orange-600"
							onClick={() => setShowMobileNav(true)}
						>
							{!showMobileNav && <Menu className="w-6 h-6" />}
						</button>
						<MobileNav
							favCount={favCount}
							cartCount={cartCount}
							isLoggedIn={Boolean(user?.id)}
							showMobileNav={showMobileNav}
							setShowMobileNav={setShowMobileNav}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
