const ProfileHeader = ({ user }) => {
	return (
		<div className="flex items-center gap-4 mb-6">
			<div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl font-bold text-orange-500">
				{user?.avatar_url ? (
					<img
						src={user.avatar_url}
						alt="Avatar"
						className="w-full h-full object-cover rounded-full"
					/>
				) : (
					user?.name?.charAt(0)?.toUpperCase() || "U"
				)}
			</div>
			<div>
				<p className="text-lg font-semibold">{user?.name}</p>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Member since 2024
				</p>
			</div>
		</div>
	);
};

export default ProfileHeader;
