"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	User,
	MapPin,
	CreditCard,
	LogOut,
	Plus,
	Trash2,
	Pencil,
	Check,
	X,
	Star,
	Home,
	Briefcase,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

function SectionCard({ icon: Icon, title, children }) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
					<Icon className="w-5 h-5 text-orange-500" />
				</div>
				<h2 className="text-xl font-semibold">{title}</h2>
			</div>
			{children}
		</div>
	);
}

function PersonalInfoSection({ user, updateProfile }) {
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
		phone: user?.phone || "",
	});

	const handleSave = () => {
		updateProfile(form);
		setEditing(false);
		toast.success("Profile updated successfully");
	};

	const handleCancel = () => {
		setForm({
			name: user?.name || "",
			email: user?.email || "",
			phone: user?.phone || "",
		});
		setEditing(false);
	};

	return (
		<SectionCard icon={User} title="Personal Information">
			{/* Avatar */}
			<div className="flex items-center gap-4 mb-6">
				<div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl font-bold text-orange-500">
					{user?.name?.charAt(0)?.toUpperCase() || "U"}
				</div>
				<div>
					<p className="text-lg font-semibold">{user?.name}</p>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Member since 2024
					</p>
				</div>
			</div>

			{editing ? (
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Full Name
						</label>
						<input
							type="text"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Email
						</label>
						<input
							type="email"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Phone
						</label>
						<input
							type="tel"
							value={form.phone}
							onChange={(e) => setForm({ ...form, phone: e.target.value })}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
						/>
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleSave}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors"
						>
							<Check className="w-4 h-4" /> Save
						</button>
						<button
							onClick={handleCancel}
							className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors"
						>
							<X className="w-4 h-4" /> Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-3">
					<InfoRow label="Full Name" value={user?.name} />
					<InfoRow label="Email" value={user?.email} />
					<InfoRow label="Phone" value={user?.phone} />
					<button
						onClick={() => setEditing(true)}
						className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
					>
						<Pencil className="w-4 h-4" /> Edit Profile
					</button>
				</div>
			)}
		</SectionCard>
	);
}

function InfoRow({ label, value }) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
			<span className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-32 shrink-0">
				{label}
			</span>
			<span className="text-gray-900 dark:text-gray-100">{value || "—"}</span>
		</div>
	);
}

function AddressSection({
	user,
	addAddress,
	removeAddress,
	setDefaultAddress,
}) {
	const [adding, setAdding] = useState(false);
	const [form, setForm] = useState({
		label: "Home",
		street: "",
		city: "",
		state: "",
		zip: "",
	});

	const handleAdd = () => {
		if (!form.street || !form.city || !form.state || !form.zip) {
			toast.error("Please fill in all address fields");
			return;
		}
		addAddress({ ...form, isDefault: user.addresses.length === 0 });
		setForm({ label: "Home", street: "", city: "", state: "", zip: "" });
		setAdding(false);
		toast.success("Address added successfully");
	};

	const labelIcons = { Home: Home, Work: Briefcase };

	return (
		<SectionCard icon={MapPin} title="Saved Addresses">
			{user?.addresses?.length > 0 ? (
				<div className="space-y-3">
					{user.addresses.map((addr) => {
						const LabelIcon = labelIcons[addr.label] || MapPin;
						return (
							<div
								key={addr.id}
								className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${addr.isDefault ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10" : "border-gray-100 dark:border-gray-700"}`}
							>
								<div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 mt-0.5">
									<LabelIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-medium">{addr.label}</span>
										{addr.isDefault && (
											<span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
												Default
											</span>
										)}
									</div>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{addr.street}, {addr.city}, {addr.state} {addr.zip}
									</p>
								</div>
								<div className="flex items-center gap-1 shrink-0">
									{!addr.isDefault && (
										<button
											onClick={() => {
												setDefaultAddress(addr.id);
												toast.success("Default address updated");
											}}
											className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-500 transition-colors"
											title="Set as default"
										>
											<Star className="w-4 h-4" />
										</button>
									)}
									<button
										onClick={() => {
											removeAddress(addr.id);
											toast.success("Address removed");
										}}
										className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className="text-gray-500 dark:text-gray-400 text-sm">
					No saved addresses yet.
				</p>
			)}

			{adding ? (
				<div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Label
						</label>
						<select
							value={form.label}
							onChange={(e) => setForm({ ...form, label: e.target.value })}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
						>
							<option value="Home">Home</option>
							<option value="Work">Work</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Street Address
						</label>
						<input
							type="text"
							value={form.street}
							onChange={(e) => setForm({ ...form, street: e.target.value })}
							placeholder="123 Main Street"
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
						/>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								City
							</label>
							<input
								type="text"
								value={form.city}
								onChange={(e) => setForm({ ...form, city: e.target.value })}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								State
							</label>
							<input
								type="text"
								value={form.state}
								onChange={(e) => setForm({ ...form, state: e.target.value })}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								ZIP
							</label>
							<input
								type="text"
								value={form.zip}
								onChange={(e) => setForm({ ...form, zip: e.target.value })}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleAdd}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors"
						>
							<Check className="w-4 h-4" /> Save Address
						</button>
						<button
							onClick={() => setAdding(false)}
							className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors"
						>
							<X className="w-4 h-4" /> Cancel
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setAdding(true)}
					className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
				>
					<Plus className="w-4 h-4" /> Add New Address
				</button>
			)}
		</SectionCard>
	);
}

function PaymentSection({
	user,
	addPaymentMethod,
	removePaymentMethod,
	setDefaultPayment,
}) {
	const [adding, setAdding] = useState(false);
	const [form, setForm] = useState({
		type: "visa",
		last4: "",
		expiry: "",
	});

	const handleAdd = () => {
		if (!form.last4 || !form.expiry) {
			toast.error("Please fill in all payment fields");
			return;
		}
		addPaymentMethod({ ...form, isDefault: user.paymentMethods.length === 0 });
		setForm({ type: "visa", last4: "", expiry: "" });
		setAdding(false);
		toast.success("Payment method added");
	};

	const cardIcons = {
		visa: "💳",
		mastercard: "💳",
		amex: "💳",
		paypal: "🅿️",
	};

	const cardLabels = {
		visa: "Visa",
		mastercard: "Mastercard",
		amex: "American Express",
		paypal: "PayPal",
	};

	return (
		<SectionCard icon={CreditCard} title="Payment Methods">
			{user?.paymentMethods?.length > 0 ? (
				<div className="space-y-3">
					{user.paymentMethods.map((pm) => (
						<div
							key={pm.id}
							className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${pm.isDefault ? "border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10" : "border-gray-100 dark:border-gray-700"}`}
						>
							<span className="text-2xl">{cardIcons[pm.type] || "💳"}</span>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-0.5">
									<span className="font-medium">
										{cardLabels[pm.type] || pm.type} •••• {pm.last4}
									</span>
									{pm.isDefault && (
										<span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
											Default
										</span>
									)}
								</div>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Expires {pm.expiry}
								</p>
							</div>
							<div className="flex items-center gap-1 shrink-0">
								{!pm.isDefault && (
									<button
										onClick={() => {
											setDefaultPayment(pm.id);
											toast.success("Default payment updated");
										}}
										className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-orange-500 transition-colors"
										title="Set as default"
									>
										<Star className="w-4 h-4" />
									</button>
								)}
								<button
									onClick={() => {
										removePaymentMethod(pm.id);
										toast.success("Payment method removed");
									}}
									className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-gray-500 dark:text-gray-400 text-sm">
					No saved payment methods.
				</p>
			)}

			{adding ? (
				<div className="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
					<div>
						<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
							Card Type
						</label>
						<select
							value={form.type}
							onChange={(e) => setForm({ ...form, type: e.target.value })}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-500 transition-colors"
						>
							<option value="visa">Visa</option>
							<option value="mastercard">Mastercard</option>
							<option value="amex">American Express</option>
							<option value="paypal">PayPal</option>
						</select>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Last 4 Digits
							</label>
							<input
								type="text"
								maxLength={4}
								value={form.last4}
								onChange={(e) =>
									setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })
								}
								placeholder="4242"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Expiry Date
							</label>
							<input
								type="text"
								maxLength={5}
								value={form.expiry}
								onChange={(e) => setForm({ ...form, expiry: e.target.value })}
								placeholder="MM/YY"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleAdd}
							className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors"
						>
							<Check className="w-4 h-4" /> Save Card
						</button>
						<button
							onClick={() => setAdding(false)}
							className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors"
						>
							<X className="w-4 h-4" /> Cancel
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setAdding(true)}
					className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
				>
					<Plus className="w-4 h-4" /> Add Payment Method
				</button>
			)}
		</SectionCard>
	);
}

export default function ProfilePage() {
	const {
		user,
		isLoggedIn,
		updateProfile,
		addAddress,
		removeAddress,
		setDefaultAddress,
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
				<AddressSection
					user={user}
					addAddress={addAddress}
					removeAddress={removeAddress}
					setDefaultAddress={setDefaultAddress}
				/>

				{/* Payment Methods */}
				<PaymentSection
					user={user}
					addPaymentMethod={addPaymentMethod}
					removePaymentMethod={removePaymentMethod}
					setDefaultPayment={setDefaultPayment}
				/>

				{/* Logout */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-colors">
					<button
						onClick={handleLogout}
						className="w-full flex items-center justify-center gap-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-3 px-6 rounded-lg font-medium transition-colors"
					>
						<LogOut className="w-5 h-5" />
						Log Out
					</button>
				</div>
			</div>
		</div>
	);
}
