import { sendSupportMessage } from "@/lib/queries";
import { useState } from "react";
import { toast } from "react-toastify";

const ContactSupport = ({ user_id, orderId }) => {
	const [isSending, setIsSending] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await sendSupportMessage(
				user_id,
				orderId,
				e.target.message.value,
			);
			console.log("Message sent successfully:", response);
			setIsSending(false);
			e.target.message.value = "";
			toast.success("Message sent successfully!");
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm transition-colors">
			{!isSending ? (
				<>
					<h2 className="text-lg font-semibold mb-2">Need Help?</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
						Having issues with your order?
					</p>
					<button
						onClick={() => setIsSending(true)}
						className="w-full py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						Contact Support
					</button>
				</>
			) : (
				<form className="mt-4" onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Your Message
						</label>
						<textarea
							id="message"
							rows={4}
							className="block w-full resize-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
							placeholder="Describe your issue..."
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
					>
						Send Message
					</button>
				</form>
			)}
		</div>
	);
};

export default ContactSupport;
