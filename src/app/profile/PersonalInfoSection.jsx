import { useUser } from "@/contexts/UserContext";
import { useState } from "react";

import { Pencil, User, User2 } from "lucide-react";
import InfoRow from "./InfoRow";
import SectionCard from "./SectionCard";

import EditeProfileForm from "./EditeProfileForm";
import ProfileHeader from "./ProfileHeader";
import EditAvatar from "./EditAvatar";

function PersonalInfoSection() {
	const { updateProfile, user } = useUser();
	const [editing, setEditing] = useState(false);
	const [editingAvatar, setEditingAvatar] = useState(false);

	return (
		<SectionCard className="relativ" icon={User} title="Personal Information">
			{/* Avatar */}
			<ProfileHeader user={user} />

			{editing || editingAvatar ? (
				editing ? (
					<EditeProfileForm
						updateProfile={updateProfile}
						user={user}
						setEditing={setEditing}
					/>
				) : (
					<EditAvatar
						setEditingAvatar={setEditingAvatar}
						avatar_url={user?.avatar_url}
						user_id={user?.id}
					/>
				)
			) : (
				<div className="space-y-3">
					<InfoRow label="Full Name" value={user?.name} />
					<InfoRow label="Email" value={user?.email} />
					<InfoRow label="Phone" value={user?.phone} />
					<div className="bg-gray-200/70 dark:bg-gray-900/80 p-4 flex justify-between item-center rounded-lg">
						<button
							aria-label="Edit profile information"
							onClick={() => setEditing(true)}
							className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
						>
							<Pencil className="w-4 h-4" /> Edit Profile
						</button>
						<button
							aria-label="Edit avatar"
							onClick={() => setEditingAvatar(true)}
							className="mt-4 flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
						>
							<User2 className="w-4 h-4" /> Edit Avatar
						</button>
					</div>
				</div>
			)}
		</SectionCard>
	);
}

export default PersonalInfoSection;
