import { Upload } from "lucide-react";
import { useState } from "react";

import { updateAvatar } from "@/lib/queries";

const EditAvatar = ({ setEditingAvatar, avatar_url, user_id }) => {
	const [reviewAvatar, setReviewAvatar] = useState(avatar_url);
	const [loading, setLoading] = useState(false);

	const handleSave = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const file = formData.get("avatar_url");
		if (!file || file.size === 0) return;
		try {
			setLoading(true);
			const res = await updateAvatar(file, user_id);
			setLoading(false);
			setEditingAvatar(false);
		} catch (error) {
			console.error("Error updating avatar:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setEditingAvatar(false);
	};

	const handleReview = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setReviewAvatar(URL.createObjectURL(file));
	};

	return (
		<form
			onSubmit={handleSave}
			className="space-y-4 w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
		>
			<label
				htmlFor="avatar_url"
				className="text-gray-600 dark:text-gray-400 cursor-pointer w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center px-4 justify-center gap-3 hover:border-orange-500 transition-colors"
			>
				<img
					src={reviewAvatar}
					alt="Avatar"
					className="w-24 h-24 object-cover rounded-full"
				/>
				<Upload className="w-5 h-5 text-gray-400" />
			</label>
			<input
				name="avatar_url"
				id="avatar_url"
				type="file"
				accept="image/*"
				onChange={handleReview}
				// value={form.phone}
				// onChange={(e) => setForm({ ...form, phone: e.target.value })}
				className="opacity-0"
			/>
			<div className="flex gap-4">
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg transition-colors disabled:bg-orange-300 disabled:hover:bg-orange-300 disabled:cursor-not-allowed"
				>
					Save
				</button>
				<button
					type="button"
					disabled={loading}
					onClick={handleCancel}
					className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 px-5 py-2.5 rounded-lg transition-colors disabled:bg-gray-200/60 dark:disabled:hover:bg-gray-200/60 disabled:hover:bg-gray-200/60 disabled:cursor-not-allowed"
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default EditAvatar;
