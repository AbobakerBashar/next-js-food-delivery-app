import { User } from "lucide-react";

const inputClassName =
	"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors";

export default function PersonalInfoSection({ personalInfo, handleChange }) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
			<div className="flex items-center gap-2 mb-6">
				<User className="w-6 h-6 text-orange-500" />
				<h2 className="text-2xl">Personal Information</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						Full Name
					</label>
					<input
						type="text"
						name="fullName"
						value={personalInfo.fullName}
						onChange={handleChange}
						required
						className={inputClassName}
					/>
				</div>
				<div>
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						Email
					</label>
					<input
						type="email"
						name="email"
						value={personalInfo.email}
						onChange={handleChange}
						required
						className={inputClassName}
					/>
				</div>
				<div className="md:col-span-2">
					<label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">
						Phone
					</label>
					<input
						type="tel"
						name="phone"
						value={personalInfo.phone}
						onChange={handleChange}
						required
						className={inputClassName}
					/>
				</div>
			</div>
		</div>
	);
}
