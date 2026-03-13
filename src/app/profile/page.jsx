"use client";

import LogoutButton from "@/components/LogoutButton";
import { useUser } from "@/contexts/UserContext";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddressSection from "./AddressSection";
import PaymentSection from "./PaymentSection";
import PersonalInfoSection from "./PersonalInfoSection";

export default function ProfilePage() {
	const {
		user,
		updateProfile,
		addPaymentMethod,
		removePaymentMethod,
		setDefaultPayment,
		logout,
	} = useUser();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		toast.success("Logged out successfully");
		router.push("/");
	};

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-16">
				<div className="max-w-md mx-auto text-center">
					<User className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
					<h2 className="text-3xl mb-4">Not Logged In</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-8">
						Please log in to view your profile.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<User className="w-8 h-8 text-orange-500" />
					<h1 className="text-4xl font-bold">My Profile</h1>
				</div>
			</div>

			<div className="max-w-2xl mx-auto space-y-6">
				{/* Personal Info */}
				<PersonalInfoSection user={user} updateProfile={updateProfile} />

				{/* Addresses */}
				<AddressSection />

				{/* Payment Methods */}
				<PaymentSection
					user={user}
					addPaymentMethod={addPaymentMethod}
					removePaymentMethod={removePaymentMethod}
					setDefaultPayment={setDefaultPayment}
				/>

				{/* Logout */}
				<LogoutButton handleLogout={handleLogout} />
			</div>
		</div>
	);
}
