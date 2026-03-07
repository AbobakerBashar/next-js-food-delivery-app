import { Suspense } from "react";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { UserProvider } from "@/contexts/UserContext";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/Sonner";
import { ToastContainer } from "react-toastify";

export const metadata = {
	title: "Food Delivery",
	description:
		"Your favorite food delivery service, bringing delicious meals to your doorstep.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>
					{" "}
					<UserProvider>
						{" "}
						<FavoritesProvider>
							<CartProvider>
								<div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
									<Suspense>
										<Header />
									</Suspense>
									<main className="flex-1">{children}</main>
									<footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 dark:border-t dark:border-gray-800">
										<div className="container mx-auto px-4">
											<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
												<div>
													<h3 className="mb-4">About Us</h3>
													<p className="text-gray-400">
														Your favorite food delivery service, bringing
														delicious meals to your doorstep.
													</p>
												</div>
												<div>
													<h3 className="mb-4">Quick Links</h3>
													<ul className="space-y-2 text-gray-400">
														<li>Help Center</li>
														<li>Privacy Policy</li>
														<li>Terms of Service</li>
													</ul>
												</div>
												<div>
													<h3 className="mb-4">Contact</h3>
													<p className="text-gray-400">
														support@fooddelivery.com
													</p>
													<p className="text-gray-400">1-800-FOOD-NOW</p>
												</div>
											</div>
											<div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
												<p>&copy; 2026 Food Delivery. All rights reserved.</p>
											</div>
										</div>
									</footer>
								</div>
								<Toaster />{" "}
								<ToastContainer
									position="top-right"
									autoClose={3000}
									hideProgressBar={false}
									newestOnTop
									closeOnClick
									pauseOnHover
									theme="colored"
								/>{" "}
							</CartProvider>
						</FavoritesProvider>
					</UserProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
