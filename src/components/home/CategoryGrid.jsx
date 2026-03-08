import Image from "next/image";
import Link from "next/link";

const categories = [
	{
		name: "Pizza",
		cuisine: "Italian",
		emoji: "🍕",
		image:
			"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=center",
		color: "from-red-500 to-orange-400",
	},
	{
		name: "Burgers",
		cuisine: "American",
		emoji: "🍔",
		image:
			"https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop&crop=center",
		color: "from-yellow-500 to-amber-400",
	},
	{
		name: "Sushi",
		cuisine: "Japanese",
		emoji: "🍣",
		image:
			"https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=400&fit=crop&crop=center",
		color: "from-pink-500 to-rose-400",
	},
	{
		name: "Tacos",
		cuisine: "Mexican",
		emoji: "🌮",
		image:
			"https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop&crop=center",
		color: "from-green-500 to-emerald-400",
	},
	{
		name: "Thai",
		cuisine: "Thai",
		emoji: "🍜",
		image:
			"https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=400&fit=crop&crop=center",
		color: "from-purple-500 to-violet-400",
	},
	{
		name: "Pasta",
		cuisine: "Italian",
		emoji: "🍝",
		image:
			"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop&crop=center",
		color: "from-orange-500 to-yellow-400",
	},
	{
		name: "African",
		cuisine: "African",
		emoji: "🍛",
		image:
			"https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop&crop=center",
		color: "from-amber-600 to-red-500",
	},
];

export function CategoryGrid() {
	return (
		<section className="mb-14">
			<h2 className="text-3xl mb-6">Browse by Category</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
				{categories.map((cat) => (
					<Link
						key={cat.name}
						href={`/restaurants?cuisine=${encodeURIComponent(cat.cuisine)}`}
						className="relative group flex flex-col items-center gap-2 hover:-translate-y-1 transition-all"
					>
						<div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg">
							<Image
								src={cat.image}
								alt={cat.name}
								width={100}
								height={100}
								className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
							/>
						</div>
						<h4 className="absolute inset-x-0 left-1/2 -translate-x-1/2 w-full bottom-0 font-semibold text-sm text-gray-100 bg-black/80 text-center p-1.5 rounded-b-lg group-hover:text-orange-500 transition-colors">
							{cat.name}
						</h4>
					</Link>
				))}
			</div>
		</section>
	);
}
