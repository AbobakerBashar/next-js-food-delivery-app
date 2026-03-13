import { MapPin, Plus } from "lucide-react";
import { useState } from "react";
import AddAddressForm from "./AddAddressForm";
import AddressesList from "./AddressesList";
import SectionCard from "./SectionCard";
import { useUser } from "@/contexts/UserContext";

function AddressSection() {
	const { user, addAddress, removeAddress, setDefaultAddress } = useUser();

	const [adding, setAdding] = useState(false);
	const [form, setForm] = useState({
		label: "Home",
		street: "",
		city: "",
		state: "",
		zip: "",
	});

	return (
		<SectionCard icon={MapPin} title="Saved Addresses">
			{user?.addresses?.length > 0 ? (
				<AddressesList
					addresses={user.addresses}
					setDefaultAddress={setDefaultAddress}
					removeAddress={removeAddress}
					user_id={user?.id}
				/>
			) : (
				<p className="text-gray-500 dark:text-gray-400 text-sm">
					No saved addresses yet.
				</p>
			)}

			{adding ? (
				<AddAddressForm
					form={form}
					setForm={setForm}
					setAdding={setAdding}
					addAddress={addAddress}
					user={user}
				/>
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

export default AddressSection;
