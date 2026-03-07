import Link from "next/link";
import {
	ArrowLeft,
	Heart,
	Flame,
	Leaf,
	Baby,
	User,
	Users,
	Clock,
	CalendarDays,
	CalendarRange,
	ShieldCheck,
	AlertTriangle,
	Star,
	Utensils,
	Timer,
	Weight,
	ChefHat,
	Sparkles,
	Globe,
	GlassWater,
	Sun,
	Tag,
	Zap,
} from "lucide-react";
import { getMenuItemById } from "@/lib/queries";
import { AddToCartButton } from "./AddToCartButton";
import { menuExtraData, defaultExtraData } from "./menuExtraData";

// Hardcoded nutrition & health data keyed by menu item name
const menuHealthData = {
	// Burgers
	"Classic Burger": {
		calories: 540,
		protein: "28g",
		carbs: "42g",
		fat: "28g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 4,
		suitability: { men: true, women: true, children: false },
		frequency: {
			perDay: "1 serving",
			perWeek: "2-3 times",
			perMonth: "8-10 times",
		},
		benefits: [
			"Good source of protein",
			"Provides iron and B12 vitamins",
			"Energy-dense meal for active lifestyles",
		],
		warnings: [
			"High in saturated fat",
			"High sodium content",
			"Not recommended for daily consumption",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["High Protein", "Comfort Food"],
	},
	"Cheese Burger": {
		calories: 620,
		protein: "32g",
		carbs: "45g",
		fat: "34g",
		fiber: "2g",
		isHealthy: false,
		healthScore: 3,
		suitability: { men: true, women: true, children: false },
		frequency: {
			perDay: "1 serving",
			perWeek: "1-2 times",
			perMonth: "6-8 times",
		},
		benefits: [
			"High in protein and calcium",
			"Good source of iron",
			"Satisfying comfort food",
		],
		warnings: [
			"High in calories",
			"High saturated fat",
			"Excess cheese adds sodium",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["High Protein", "Calcium Rich"],
	},
	"Double Smash Burger": {
		calories: 820,
		protein: "45g",
		carbs: "48g",
		fat: "52g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 2,
		suitability: { men: true, women: false, children: false },
		frequency: {
			perDay: "1 serving max",
			perWeek: "1 time",
			perMonth: "3-4 times",
		},
		benefits: [
			"Excellent protein source",
			"Very satisfying meal",
			"Great post-workout option",
		],
		warnings: [
			"Very high in calories",
			"High saturated fat",
			"Should be an occasional treat",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["High Protein", "Heavy Meal"],
	},
	"Veggie Burger": {
		calories: 380,
		protein: "18g",
		carbs: "45g",
		fat: "14g",
		fiber: "8g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1-2 servings",
			perWeek: "4-5 times",
			perMonth: "15-20 times",
		},
		benefits: [
			"High in fiber",
			"Plant-based protein",
			"Lower saturated fat than meat burgers",
			"Good for heart health",
		],
		warnings: ["May be high in sodium", "Check for processed ingredients"],
		allergens: ["Gluten", "Soy"],
		tags: ["Vegetarian", "High Fiber", "Heart Healthy"],
	},
	// Pizza
	"Margherita Pizza": {
		calories: 270,
		protein: "12g",
		carbs: "33g",
		fat: "10g",
		fiber: "2g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "2-3 slices",
			perWeek: "2-3 times",
			perMonth: "8-10 times",
		},
		benefits: [
			"Contains lycopene from tomatoes",
			"Calcium from mozzarella",
			"Moderate calorie count per slice",
		],
		warnings: ["High in refined carbs", "Moderate sodium", "Easy to overeat"],
		allergens: ["Gluten", "Dairy"],
		tags: ["Classic", "Vegetarian"],
	},
	"Pepperoni Pizza": {
		calories: 320,
		protein: "14g",
		carbs: "34g",
		fat: "15g",
		fiber: "2g",
		isHealthy: false,
		healthScore: 4,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "2 slices",
			perWeek: "1-2 times",
			perMonth: "6-8 times",
		},
		benefits: [
			"Good protein source",
			"Contains calcium",
			"Enjoyable comfort food",
		],
		warnings: [
			"Processed meat (pepperoni)",
			"High sodium",
			"High in saturated fat",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["Popular", "Comfort Food"],
	},
	"BBQ Chicken Pizza": {
		calories: 340,
		protein: "18g",
		carbs: "38g",
		fat: "13g",
		fiber: "2g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "2 slices",
			perWeek: "2 times",
			perMonth: "6-8 times",
		},
		benefits: [
			"Higher protein from chicken",
			"Lower fat than most pizzas",
			"Good balance of macros",
		],
		warnings: [
			"BBQ sauce adds sugar",
			"High sodium content",
			"Moderate calorie density",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["High Protein", "Popular"],
	},
	"Veggie Supreme": {
		calories: 240,
		protein: "10g",
		carbs: "32g",
		fat: "9g",
		fiber: "4g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "2-3 slices",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Loaded with vegetables",
			"High fiber content",
			"Rich in vitamins and antioxidants",
			"Lower calorie pizza option",
		],
		warnings: [
			"Still contains refined flour crust",
			"Cheese adds saturated fat",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["Vegetarian", "Vitamin Rich", "High Fiber"],
	},
	// Sushi
	"California Roll": {
		calories: 255,
		protein: "9g",
		carbs: "38g",
		fat: "7g",
		fiber: "3g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1-2 rolls",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Contains omega-3 fatty acids from crab",
			"Avocado provides healthy fats",
			"Light and nutritious",
			"Good source of iodine from seaweed",
		],
		warnings: [
			"Rice is high glycemic",
			"Imitation crab is processed",
			"Soy sauce adds sodium",
		],
		allergens: ["Shellfish", "Soy", "Gluten"],
		tags: ["Low Fat", "Omega-3", "Light Meal"],
	},
	"Salmon Nigiri": {
		calories: 180,
		protein: "14g",
		carbs: "20g",
		fat: "5g",
		fiber: "0g",
		isHealthy: true,
		healthScore: 9,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "4-6 pieces",
			perWeek: "3-5 times",
			perMonth: "15-20 times",
		},
		benefits: [
			"Excellent source of omega-3 fatty acids",
			"High-quality protein",
			"Rich in vitamin D and B12",
			"Anti-inflammatory properties",
		],
		warnings: [
			"Raw fish — ensure freshness",
			"Contains mercury (limit for pregnant women)",
			"High in purines",
		],
		allergens: ["Fish", "Soy"],
		tags: ["Super Food", "Omega-3", "Heart Healthy", "Low Calorie"],
	},
	"Dragon Roll": {
		calories: 330,
		protein: "12g",
		carbs: "42g",
		fat: "14g",
		fiber: "4g",
		isHealthy: true,
		healthScore: 6,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 roll",
			perWeek: "2-3 times",
			perMonth: "10-12 times",
		},
		benefits: [
			"Avocado provides healthy fats and potassium",
			"Contains protein from eel/shrimp",
			"Nutrient-rich combination",
		],
		warnings: [
			"Eel sauce contains sugar",
			"Higher calorie sushi option",
			"May contain allergens",
		],
		allergens: ["Fish", "Shellfish", "Soy", "Gluten"],
		tags: ["Omega-3", "Potassium Rich"],
	},
	"Spicy Tuna Roll": {
		calories: 290,
		protein: "15g",
		carbs: "35g",
		fat: "10g",
		fiber: "2g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: false },
		frequency: {
			perDay: "1-2 rolls",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"High in protein and omega-3s",
			"Tuna is lean protein source",
			"Contains selenium and niacin",
		],
		warnings: [
			"Spicy mayo adds fat and calories",
			"Tuna contains mercury",
			"Not suitable for very young children",
		],
		allergens: ["Fish", "Soy", "Eggs"],
		tags: ["Spicy", "High Protein", "Omega-3"],
	},
	// Mexican
	"Chicken Burrito": {
		calories: 680,
		protein: "35g",
		carbs: "72g",
		fat: "26g",
		fiber: "10g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "2-3 times",
			perMonth: "8-10 times",
		},
		benefits: [
			"High in protein and fiber",
			"Contains beans for additional nutrients",
			"Good balance of macronutrients",
			"Filling and satisfying",
		],
		warnings: ["Very calorie-dense", "High carb content", "Large portion size"],
		allergens: ["Gluten", "Dairy"],
		tags: ["High Protein", "High Fiber", "Filling"],
	},
	"Carne Asada Tacos": {
		calories: 420,
		protein: "28g",
		carbs: "35g",
		fat: "18g",
		fiber: "4g",
		isHealthy: false,
		healthScore: 6,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "2-3 tacos",
			perWeek: "2-3 times",
			perMonth: "10-12 times",
		},
		benefits: [
			"Excellent source of iron and protein",
			"Corn tortillas are gluten-free",
			"Fresh toppings provide vitamins",
		],
		warnings: [
			"Red meat — consume in moderation",
			"Can be high in sodium",
			"Fried tortillas add calories",
		],
		allergens: ["Dairy"],
		tags: ["High Protein", "Iron Rich"],
	},
	"Fish Tacos": {
		calories: 360,
		protein: "22g",
		carbs: "32g",
		fat: "16g",
		fiber: "4g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "2-3 tacos",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Lean fish protein",
			"Omega-3 fatty acids",
			"Fresh slaw provides fiber and vitamins",
			"Lighter than meat tacos",
		],
		warnings: [
			"Battered fish adds calories",
			"Watch dressing portions",
			"May contain allergens",
		],
		allergens: ["Fish", "Gluten", "Dairy"],
		tags: ["Omega-3", "Lighter Option", "Heart Healthy"],
	},
	"Guacamole & Chips": {
		calories: 320,
		protein: "5g",
		carbs: "28g",
		fat: "22g",
		fiber: "7g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Avocado is a superfood",
			"Rich in healthy monounsaturated fats",
			"High in potassium and fiber",
			"Contains vitamins E, K, and C",
		],
		warnings: [
			"Chips are high in sodium and calories",
			"Easy to overeat",
			"Control portion size",
		],
		allergens: [],
		tags: ["Superfood", "Healthy Fats", "Vegan"],
	},
	// Thai
	"Pad Thai": {
		calories: 450,
		protein: "18g",
		carbs: "55g",
		fat: "18g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "2-3 times",
			perMonth: "8-10 times",
		},
		benefits: [
			"Contains protein from shrimp/tofu",
			"Peanuts add healthy fats",
			"Rice noodles are gluten-free",
		],
		warnings: [
			"High in sugar from tamarind sauce",
			"High sodium from fish sauce",
			"Calorie-dense",
		],
		allergens: ["Peanuts", "Shellfish", "Soy", "Eggs"],
		tags: ["Gluten-Free", "Popular"],
	},
	"Green Curry": {
		calories: 380,
		protein: "22g",
		carbs: "30g",
		fat: "20g",
		fiber: "4g",
		isHealthy: true,
		healthScore: 6,
		suitability: { men: true, women: true, children: false },
		frequency: {
			perDay: "1 serving",
			perWeek: "2-3 times",
			perMonth: "10-12 times",
		},
		benefits: [
			"Anti-inflammatory spices",
			"Coconut milk provides healthy fats",
			"Vegetables add vitamins and fiber",
			"Protein-rich",
		],
		warnings: [
			"Can be very spicy",
			"High in sodium",
			"Coconut milk is calorie-dense",
		],
		allergens: ["Shellfish", "Soy"],
		tags: ["Anti-Inflammatory", "Spicy", "Gluten-Free"],
	},
	"Tom Yum Soup": {
		calories: 180,
		protein: "14g",
		carbs: "12g",
		fat: "8g",
		fiber: "2g",
		isHealthy: true,
		healthScore: 8,
		suitability: { men: true, women: true, children: false },
		frequency: {
			perDay: "1-2 bowls",
			perWeek: "4-5 times",
			perMonth: "15-20 times",
		},
		benefits: [
			"Very low calorie",
			"Immune-boosting lemongrass and galangal",
			"Anti-inflammatory properties",
			"Rich in vitamin C",
		],
		warnings: [
			"Can be very spicy",
			"High sodium",
			"Not suitable for very young children",
		],
		allergens: ["Shellfish", "Fish"],
		tags: ["Low Calorie", "Immune Boost", "Anti-Inflammatory", "Super Food"],
	},
	"Mango Sticky Rice": {
		calories: 350,
		protein: "5g",
		carbs: "68g",
		fat: "8g",
		fiber: "2g",
		isHealthy: false,
		healthScore: 4,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "1-2 times",
			perMonth: "5-8 times",
		},
		benefits: [
			"Mango is rich in vitamins A and C",
			"Natural sweetness from fruit",
			"Good source of energy",
		],
		warnings: [
			"Very high in sugar and carbs",
			"Low in protein",
			"Should be a treat, not a staple",
		],
		allergens: [],
		tags: ["Dessert", "Vitamin Rich"],
	},
	// Indian
	"Butter Chicken": {
		calories: 490,
		protein: "30g",
		carbs: "18g",
		fat: "34g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "2-3 times",
			perMonth: "8-10 times",
		},
		benefits: [
			"High in protein",
			"Turmeric provides anti-inflammatory benefits",
			"Contains calcium from cream",
			"Tomato base provides lycopene",
		],
		warnings: [
			"High in saturated fat from cream and butter",
			"Calorie-dense",
			"High sodium",
		],
		allergens: ["Dairy", "Nuts"],
		tags: ["High Protein", "Comfort Food"],
	},
	"Palak Paneer": {
		calories: 340,
		protein: "18g",
		carbs: "16g",
		fat: "24g",
		fiber: "5g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Spinach is nutrient-dense superfood",
			"High in iron and calcium",
			"Good vegetarian protein from paneer",
			"Rich in vitamins A, C, and K",
		],
		warnings: [
			"Paneer is high in saturated fat",
			"Cream-based versions are calorie-dense",
		],
		allergens: ["Dairy"],
		tags: ["Vegetarian", "Iron Rich", "Super Food"],
	},
	"Chicken Biryani": {
		calories: 550,
		protein: "28g",
		carbs: "65g",
		fat: "20g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "2-3 times",
			perMonth: "8-10 times",
		},
		benefits: [
			"Balanced meal with protein and carbs",
			"Anti-inflammatory spices (turmeric, cumin)",
			"Saffron provides antioxidants",
		],
		warnings: [
			"High calorie count",
			"High carb from rice",
			"Often cooked with ghee (butter)",
		],
		allergens: ["Dairy", "Nuts"],
		tags: ["Complete Meal", "Aromatic"],
	},
	Samosa: {
		calories: 260,
		protein: "6g",
		carbs: "30g",
		fat: "14g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 3,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1-2 pieces",
			perWeek: "1-2 times",
			perMonth: "5-8 times",
		},
		benefits: [
			"Contains potato and peas for potassium",
			"Spices aid digestion",
			"Good snack-size portion",
		],
		warnings: [
			"Deep-fried",
			"High in trans fats",
			"Low nutritional value relative to calories",
		],
		allergens: ["Gluten"],
		tags: ["Snack", "Fried"],
	},
	// Mediterranean
	"Chicken Shawarma": {
		calories: 430,
		protein: "32g",
		carbs: "35g",
		fat: "18g",
		fiber: "4g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Lean protein from chicken",
			"Mediterranean spices have antioxidant properties",
			"Fresh vegetables add fiber and vitamins",
			"Well-balanced macronutrients",
		],
		warnings: [
			"Sauces add extra calories",
			"Pita bread is refined carb",
			"Watch portion size",
		],
		allergens: ["Gluten", "Dairy", "Sesame"],
		tags: ["High Protein", "Lean", "Balanced"],
	},
	"Falafel Plate": {
		calories: 520,
		protein: "18g",
		carbs: "58g",
		fat: "24g",
		fiber: "12g",
		isHealthy: true,
		healthScore: 7,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "3-4 times",
			perMonth: "12-15 times",
		},
		benefits: [
			"Chickpeas are excellent plant protein",
			"Very high in fiber",
			"Rich in iron and folate",
			"Heart-healthy ingredients",
		],
		warnings: [
			"Deep-fried falafel adds fat",
			"Tahini is calorie-dense",
			"Watch portion of hummus",
		],
		allergens: ["Gluten", "Sesame"],
		tags: ["Vegan", "High Fiber", "Plant Protein", "Heart Healthy"],
	},
	"Lamb Kofta": {
		calories: 480,
		protein: "28g",
		carbs: "22g",
		fat: "32g",
		fiber: "3g",
		isHealthy: false,
		healthScore: 5,
		suitability: { men: true, women: true, children: true },
		frequency: { perDay: "1 serving", perWeek: "2 times", perMonth: "8 times" },
		benefits: [
			"Excellent source of iron and zinc",
			"High-quality complete protein",
			"Mediterranean spices aid digestion",
		],
		warnings: [
			"Lamb is high in saturated fat",
			"Calorie-dense",
			"Red meat — consume in moderation",
		],
		allergens: ["Gluten", "Dairy"],
		tags: ["Iron Rich", "High Protein"],
	},
	"Hummus Plate": {
		calories: 360,
		protein: "12g",
		carbs: "40g",
		fat: "18g",
		fiber: "8g",
		isHealthy: true,
		healthScore: 8,
		suitability: { men: true, women: true, children: true },
		frequency: {
			perDay: "1 serving",
			perWeek: "5-6 times",
			perMonth: "20+ times",
		},
		benefits: [
			"Chickpeas provide plant protein and fiber",
			"Tahini adds healthy fats and calcium",
			"Olive oil is heart-healthy",
			"Rich in iron, folate, and B vitamins",
		],
		warnings: [
			"Pita bread is refined carb",
			"Calorie-dense in large portions",
			"Watch oil portion",
		],
		allergens: ["Sesame", "Gluten"],
		tags: ["Vegan", "Heart Healthy", "Super Food", "High Fiber"],
	},
};

// Default health data for items not in the map
const defaultHealthData = {
	calories: 400,
	protein: "20g",
	carbs: "40g",
	fat: "18g",
	fiber: "4g",
	isHealthy: false,
	healthScore: 5,
	suitability: { men: true, women: true, children: true },
	frequency: {
		perDay: "1 serving",
		perWeek: "2-3 times",
		perMonth: "8-10 times",
	},
	benefits: [
		"Source of energy",
		"Contains essential nutrients",
		"Satisfying meal option",
	],
	warnings: [
		"Consume in moderation",
		"Check for allergens",
		"Balance with vegetables",
	],
	allergens: [],
	tags: ["Regular"],
};

function getHealthData(itemName) {
	const health = menuHealthData[itemName] || defaultHealthData;
	const extra = menuExtraData[itemName] || defaultExtraData;
	return { ...health, ...extra };
}

function HealthScoreBar({ score }) {
	const color =
		score >= 7 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";
	const label = score >= 7 ? "Healthy" : score >= 5 ? "Moderate" : "Unhealthy";

	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between text-sm">
				<span className="text-gray-600 dark:text-gray-400">Health Score</span>
				<span className="font-semibold">
					{score}/10 — {label}
				</span>
			</div>
			<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					className={`h-full ${color} rounded-full transition-all duration-700`}
					style={{ width: `${score * 10}%` }}
				/>
			</div>
		</div>
	);
}

export default async function MenuItemPage({ params }) {
	const { id } = await params;

	let item = null;
	try {
		item = await getMenuItemById(parseInt(id));
	} catch {
		// Item not found
	}

	if (!item) {
		return (
			<div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
				<Utensils className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
				<h1 className="text-2xl font-bold mb-2">Dish Not Found</h1>
				<p className="text-gray-500 dark:text-gray-400 mb-6">
					This menu item doesn&apos;t exist or has been removed.
				</p>
				<Link
					href="/"
					className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Home
				</Link>
			</div>
		);
	}

	const health = getHealthData(item.name);

	return (
		<div className="pb-12">
			{/* Hero Section */}
			<div className="relative h-72 sm:h-96 bg-gray-200 dark:bg-gray-800">
				<img
					src={item.imageUrl}
					alt={item.name}
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				<div className="absolute top-4 left-4">
					<Link
						href={`/restaurant/${item.restaurantId}`}
						className="inline-flex items-center gap-2 text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/60 transition-colors text-sm"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Restaurant
					</Link>
				</div>
				<div className="absolute bottom-6 left-6 right-6">
					<div className="flex items-center gap-2 mb-2">
						{health.isHealthy ? (
							<span className="inline-flex items-center gap-1 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
								<Leaf className="w-3 h-3" /> Healthy Choice
							</span>
						) : (
							<span className="inline-flex items-center gap-1 bg-orange-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
								<Flame className="w-3 h-3" /> Comfort Food
							</span>
						)}
						{item.popular && (
							<span className="inline-flex items-center gap-1 bg-yellow-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
								<Star className="w-3 h-3" /> Popular
							</span>
						)}
					</div>
					<h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
						{item.name}
					</h1>
					<p className="text-white/80 text-sm">
						{item.restaurantName} · {item.restaurantCuisine}
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 -mt-6 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Quick Info Card */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
								<div>
									<p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
										Price
									</p>
									<p className="text-3xl font-bold text-orange-500">
										${item.price.toFixed(2)}
									</p>
								</div>
								<AddToCartButton item={item} />
							</div>

							<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
								{item.description}
							</p>

							{/* Quick Meta Row */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5">
									<Timer className="w-4 h-4 text-orange-500 shrink-0" />
									<span>{health.prepTime}</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5">
									<Weight className="w-4 h-4 text-blue-500 shrink-0" />
									<span>{health.servingSize}</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5">
									<Sun className="w-4 h-4 text-amber-500 shrink-0" />
									<span>{health.bestTimeToEat}</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5">
									<Zap className="w-4 h-4 text-red-500 shrink-0" />
									<div className="flex gap-0.5">
										{[1, 2, 3, 4, 5].map((level) => (
											<span
												key={level}
												className={`w-2.5 h-2.5 rounded-full ${
													level <= health.spiceLevel
														? "bg-red-500"
														: "bg-gray-200 dark:bg-gray-600"
												}`}
											/>
										))}
										<span className="ml-1 text-xs">
											{health.spiceLevel === 0
												? "Mild"
												: health.spiceLevel <= 2
													? "Medium"
													: "Hot"}
										</span>
									</div>
								</div>
							</div>

							{/* Tags + Dietary */}
							<div className="flex flex-wrap gap-2">
								{health.dietary.map((d) => (
									<span
										key={d}
										className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full"
									>
										<Tag className="w-3 h-3" />
										{d}
									</span>
								))}
								{health.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						</div>

						{/* Nutrition Facts */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
								<Flame className="w-5 h-5 text-orange-500" />
								Nutrition Facts
							</h2>
							<div className="grid grid-cols-5 gap-3">
								{[
									{
										label: "Calories",
										value: health.calories,
										unit: "kcal",
										color: "text-red-500",
									},
									{
										label: "Protein",
										value: health.protein,
										unit: "",
										color: "text-blue-500",
									},
									{
										label: "Carbs",
										value: health.carbs,
										unit: "",
										color: "text-yellow-500",
									},
									{
										label: "Fat",
										value: health.fat,
										unit: "",
										color: "text-purple-500",
									},
									{
										label: "Fiber",
										value: health.fiber,
										unit: "",
										color: "text-green-500",
									},
								].map((n) => (
									<div
										key={n.label}
										className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
									>
										<p className={`text-xl font-bold ${n.color}`}>
											{n.value}
											{n.unit && (
												<span className="text-xs font-normal ml-0.5">
													{n.unit}
												</span>
											)}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
											{n.label}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Ingredients */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
								<ChefHat className="w-5 h-5 text-amber-600" />
								Ingredients
							</h2>
							<div className="flex flex-wrap gap-2">
								{health.ingredients.map((ing, i) => (
									<span
										key={i}
										className="text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full"
									>
										{ing}
									</span>
								))}
							</div>
						</div>

						{/* Key Vitamins & Minerals */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-violet-500" />
								Key Vitamins & Minerals
							</h2>
							<div className="space-y-3">
								{health.vitamins.map((v, i) => (
									<div key={i} className="space-y-1">
										<div className="flex items-center justify-between text-sm">
											<span className="text-gray-700 dark:text-gray-300 font-medium">
												{v.name}
											</span>
											<span className="text-gray-500 dark:text-gray-400 text-xs">
												{v.pct}% DV
											</span>
										</div>
										<div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
											<div
												className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600"
												style={{ width: `${Math.min(v.pct, 100)}%` }}
											/>
										</div>
									</div>
								))}
							</div>
							<p className="text-[11px] text-gray-400 dark:text-gray-500 mt-4">
								* DV = Daily Value based on a 2,000-calorie diet. Values are
								estimates.
							</p>
						</div>

						{/* Health Score & Benefits */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
								<ShieldCheck className="w-5 h-5 text-green-500" />
								Health Assessment
							</h2>

							<HealthScoreBar score={health.healthScore} />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
								{/* Benefits */}
								<div>
									<h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
										<Leaf className="w-4 h-4" /> Benefits
									</h3>
									<ul className="space-y-2">
										{health.benefits.map((b, i) => (
											<li
												key={i}
												className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
											>
												<span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
												{b}
											</li>
										))}
									</ul>
								</div>

								{/* Warnings */}
								<div>
									<h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
										<AlertTriangle className="w-4 h-4" /> Warnings
									</h3>
									<ul className="space-y-2">
										{health.warnings.map((w, i) => (
											<li
												key={i}
												className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
											>
												<span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
												{w}
											</li>
										))}
									</ul>
								</div>
							</div>

							{/* Allergens */}
							{health.allergens.length > 0 && (
								<div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
									<h3 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
										<AlertTriangle className="w-4 h-4" /> Allergens
									</h3>
									<div className="flex flex-wrap gap-2">
										{health.allergens.map((a) => (
											<span
												key={a}
												className="text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-3 py-1 rounded-full"
											>
												{a}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Suitability Card */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2">
								<Users className="w-5 h-5 text-blue-500" />
								Who Is It Good For?
							</h2>
							<div className="space-y-3">
								{[
									{
										label: "Men",
										icon: User,
										suitable: health.suitability.men,
									},
									{
										label: "Women",
										icon: User,
										suitable: health.suitability.women,
									},
									{
										label: "Children",
										icon: Baby,
										suitable: health.suitability.children,
									},
								].map((s) => (
									<div
										key={s.label}
										className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
											s.suitable
												? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
												: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
										}`}
									>
										<s.icon
											className={`w-5 h-5 ${s.suitable ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
										/>
										<span className="text-sm font-medium flex-1">
											{s.label}
										</span>
										<span
											className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
												s.suitable
													? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
													: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
											}`}
										>
											{s.suitable ? "Recommended" : "Not Ideal"}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Consumption Frequency */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-lg font-bold mb-4 flex items-center gap-2">
								<Clock className="w-5 h-5 text-purple-500" />
								Recommended Intake
							</h2>
							<div className="space-y-3">
								{[
									{
										label: "Per Day",
										value: health.frequency.perDay,
										icon: Clock,
										color:
											"bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
										iconColor: "text-blue-500",
									},
									{
										label: "Per Week",
										value: health.frequency.perWeek,
										icon: CalendarDays,
										color:
											"bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
										iconColor: "text-purple-500",
									},
									{
										label: "Per Month",
										value: health.frequency.perMonth,
										icon: CalendarRange,
										color:
											"bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
										iconColor: "text-indigo-500",
									},
								].map((f) => (
									<div
										key={f.label}
										className={`flex items-center gap-3 p-3 rounded-xl border ${f.color}`}
									>
										<f.icon className={`w-5 h-5 ${f.iconColor}`} />
										<div className="flex-1">
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{f.label}
											</p>
											<p className="text-sm font-semibold">{f.value}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Dish Origin */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-lg font-bold mb-3 flex items-center gap-2">
								<Globe className="w-5 h-5 text-teal-500" />
								Origin & History
							</h2>
							<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								{health.origin}
							</p>
						</div>

						{/* Pairs Well With */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<h2 className="text-lg font-bold mb-3 flex items-center gap-2">
								<GlassWater className="w-5 h-5 text-cyan-500" />
								Pairs Well With
							</h2>
							<div className="flex flex-wrap gap-2">
								{health.pairsWith.map((p) => (
									<span
										key={p}
										className="text-xs font-medium bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 px-3 py-1.5 rounded-full"
									>
										{p}
									</span>
								))}
							</div>
						</div>

						{/* Quick Links */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
							<Link
								href={`/restaurant/${item.restaurantId}`}
								className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								<Utensils className="w-5 h-5 text-orange-500" />
								<div>
									<p className="text-sm font-semibold">View Full Menu</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{item.restaurantName}
									</p>
								</div>
								<ArrowLeft className="w-4 h-4 ml-auto rotate-180 text-gray-400" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
