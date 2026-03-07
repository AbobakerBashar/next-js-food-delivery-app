import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://unlfqxrnbrnsspjozxfs.supabase.co";
// Use service role key for seeding (bypasses RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
	console.error("❌ Set SUPABASE_SERVICE_ROLE_KEY env variable first!");
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STORAGE_BASE = `${supabaseUrl}/storage/v1/object/public/images`;

// ─── Restaurants ────────────────────────────────────────────
const restaurants = [
	{
		id: 1,
		name: "Pizza Paradise",
		cuisine: "Italian",
		rating: 4.5,
		delivery_time: "25-35",
		delivery_fee: 2.99,
		min_order: 15,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-1-pizza-paradise.jpg`,
	},
	{
		id: 2,
		name: "Burger House",
		cuisine: "American",
		rating: 4.7,
		delivery_time: "20-30",
		delivery_fee: 1.99,
		min_order: 10,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-2-burger-house.jpg`,
	},
	{
		id: 3,
		name: "Sushi Master",
		cuisine: "Japanese",
		rating: 4.8,
		delivery_time: "30-40",
		delivery_fee: 3.99,
		min_order: 20,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-3-sushi-master.jpg`,
	},
	{
		id: 4,
		name: "Taco Fiesta",
		cuisine: "Mexican",
		rating: 4.6,
		delivery_time: "25-35",
		delivery_fee: 2.49,
		min_order: 12,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-4-taco-fiesta.jpg`,
	},
	{
		id: 5,
		name: "Thai Spice",
		cuisine: "Thai",
		rating: 4.4,
		delivery_time: "35-45",
		delivery_fee: 3.49,
		min_order: 18,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-5-thai-spice.jpg`,
	},
	{
		id: 6,
		name: "Pasta Corner",
		cuisine: "Italian",
		rating: 4.3,
		delivery_time: "30-40",
		delivery_fee: 2.99,
		min_order: 15,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-6-pasta-corner.jpg`,
	},
	{
		id: 7,
		name: "Sahara Grill",
		cuisine: "African",
		rating: 4.7,
		delivery_time: "30-45",
		delivery_fee: 3.49,
		min_order: 16,
		image_url: `${STORAGE_BASE}/restaurants/restaurant-7-sahara-grill.jpg`,
	},
];

// ─── Menu Items ─────────────────────────────────────────────
const menuItems = [
	// Pizza Paradise (restaurant 1)
	{
		id: 101,
		restaurant_id: 1,
		name: "Margherita Pizza",
		description: "Fresh mozzarella, tomatoes, basil",
		price: 12.99,
		category: "Pizza",
		image_url: `${STORAGE_BASE}/dishes/dish-101-margherita-pizza.jpg`,
		popular: true,
	},
	{
		id: 102,
		restaurant_id: 1,
		name: "Pepperoni Pizza",
		description: "Classic pepperoni with extra cheese",
		price: 14.99,
		category: "Pizza",
		image_url: null,
		popular: false,
	},
	{
		id: 103,
		restaurant_id: 1,
		name: "Veggie Supreme",
		description: "Bell peppers, onions, mushrooms, olives",
		price: 13.99,
		category: "Pizza",
		image_url: null,
		popular: false,
	},
	{
		id: 104,
		restaurant_id: 1,
		name: "Caesar Salad",
		description: "Romaine lettuce, parmesan, croutons",
		price: 8.99,
		category: "Salads",
		image_url: null,
		popular: false,
	},

	// Burger House (restaurant 2)
	{
		id: 201,
		restaurant_id: 2,
		name: "Classic Cheeseburger",
		description: "Beef patty, cheese, lettuce, tomato",
		price: 9.99,
		category: "Burgers",
		image_url: `${STORAGE_BASE}/dishes/dish-201-classic-burger.jpg`,
		popular: true,
	},
	{
		id: 202,
		restaurant_id: 2,
		name: "Bacon Burger",
		description: "Beef patty, crispy bacon, BBQ sauce",
		price: 11.99,
		category: "Burgers",
		image_url: `${STORAGE_BASE}/dishes/dish-202-bacon-burger.jpg`,
		popular: true,
	},
	{
		id: 203,
		restaurant_id: 2,
		name: "Veggie Burger",
		description: "Plant-based patty with fresh veggies",
		price: 10.99,
		category: "Burgers",
		image_url: null,
		popular: false,
	},
	{
		id: 204,
		restaurant_id: 2,
		name: "French Fries",
		description: "Crispy golden fries",
		price: 4.99,
		category: "Sides",
		image_url: null,
		popular: false,
	},

	// Sushi Master (restaurant 3)
	{
		id: 301,
		restaurant_id: 3,
		name: "California Roll",
		description: "Crab, avocado, cucumber",
		price: 8.99,
		category: "Rolls",
		image_url: `${STORAGE_BASE}/dishes/dish-301-sushi-roll.jpg`,
		popular: true,
	},
	{
		id: 302,
		restaurant_id: 3,
		name: "Spicy Tuna Roll",
		description: "Tuna, spicy mayo, sesame",
		price: 10.99,
		category: "Rolls",
		image_url: null,
		popular: false,
	},
	{
		id: 303,
		restaurant_id: 3,
		name: "Dragon Roll",
		description: "Eel, avocado, special sauce",
		price: 14.99,
		category: "Rolls",
		image_url: `${STORAGE_BASE}/dishes/dish-303-tempura.jpg`,
		popular: true,
	},
	{
		id: 304,
		restaurant_id: 3,
		name: "Miso Soup",
		description: "Traditional Japanese soup",
		price: 3.99,
		category: "Soups",
		image_url: null,
		popular: false,
	},

	// Taco Fiesta (restaurant 4)
	{
		id: 401,
		restaurant_id: 4,
		name: "Beef Tacos",
		description: "Seasoned beef, lettuce, cheese, salsa",
		price: 7.99,
		category: "Tacos",
		image_url: `${STORAGE_BASE}/dishes/dish-401-street-tacos.jpg`,
		popular: true,
	},
	{
		id: 402,
		restaurant_id: 4,
		name: "Chicken Tacos",
		description: "Grilled chicken, pico de gallo",
		price: 7.99,
		category: "Tacos",
		image_url: null,
		popular: false,
	},
	{
		id: 403,
		restaurant_id: 4,
		name: "Fish Tacos",
		description: "Battered fish, cabbage slaw, sauce",
		price: 9.99,
		category: "Tacos",
		image_url: null,
		popular: false,
	},
	{
		id: 404,
		restaurant_id: 4,
		name: "Nachos Supreme",
		description: "Chips, cheese, jalapeños, sour cream",
		price: 8.99,
		category: "Appetizers",
		image_url: null,
		popular: false,
	},

	// Thai Spice (restaurant 5)
	{
		id: 501,
		restaurant_id: 5,
		name: "Pad Thai",
		description: "Rice noodles, peanuts, lime",
		price: 11.99,
		category: "Noodles",
		image_url: `${STORAGE_BASE}/dishes/dish-501-pad-thai.jpg`,
		popular: true,
	},
	{
		id: 502,
		restaurant_id: 5,
		name: "Green Curry",
		description: "Coconut curry with vegetables",
		price: 12.99,
		category: "Curries",
		image_url: null,
		popular: false,
	},
	{
		id: 503,
		restaurant_id: 5,
		name: "Tom Yum Soup",
		description: "Spicy and sour Thai soup",
		price: 9.99,
		category: "Soups",
		image_url: null,
		popular: false,
	},
	{
		id: 504,
		restaurant_id: 5,
		name: "Spring Rolls",
		description: "Fresh vegetables in rice paper",
		price: 6.99,
		category: "Appetizers",
		image_url: null,
		popular: false,
	},

	// Pasta Corner (restaurant 6)
	{
		id: 601,
		restaurant_id: 6,
		name: "Spaghetti Carbonara",
		description: "Creamy sauce, bacon, parmesan",
		price: 13.99,
		category: "Pasta",
		image_url: `${STORAGE_BASE}/dishes/dish-601-pasta.jpg`,
		popular: true,
	},
	{
		id: 602,
		restaurant_id: 6,
		name: "Penne Arrabiata",
		description: "Spicy tomato sauce",
		price: 11.99,
		category: "Pasta",
		image_url: null,
		popular: false,
	},
	{
		id: 603,
		restaurant_id: 6,
		name: "Lasagna",
		description: "Layers of pasta, meat, cheese",
		price: 14.99,
		category: "Pasta",
		image_url: null,
		popular: false,
	},
	{
		id: 604,
		restaurant_id: 6,
		name: "Garlic Bread",
		description: "Toasted bread with garlic butter",
		price: 5.99,
		category: "Sides",
		image_url: null,
		popular: false,
	},

	// Sahara Grill (restaurant 7)
	{
		id: 701,
		restaurant_id: 7,
		name: "Jollof Rice",
		description: "Smoky tomato rice with spices and peppers",
		price: 13.99,
		category: "Mains",
		image_url: `${STORAGE_BASE}/dishes/dish-701-jollof-rice.jpg`,
		popular: true,
	},
	{
		id: 702,
		restaurant_id: 7,
		name: "Suya Skewers",
		description: "Spiced grilled beef skewers with onions and peppers",
		price: 11.99,
		category: "Grills",
		image_url: null,
		popular: false,
	},
	{
		id: 703,
		restaurant_id: 7,
		name: "Egusi Soup & Pounded Yam",
		description: "Melon seed soup with spinach, served with pounded yam",
		price: 15.99,
		category: "Soups",
		image_url: null,
		popular: false,
	},
	{
		id: 704,
		restaurant_id: 7,
		name: "Puff Puff",
		description: "Sweet fried dough balls dusted with powdered sugar",
		price: 6.99,
		category: "Sides",
		image_url: null,
		popular: false,
	},
];

async function seed() {
	console.log("🌱 Seeding database...\n");

	// ─── Insert Restaurants ─────────────────────────────────
	console.log("📍 Inserting restaurants...");
	const { data: restData, error: restError } = await supabase
		.from("restaurants")
		.upsert(restaurants, { onConflict: "id" })
		.select();

	if (restError) {
		console.error("   ❌ Restaurants error:", restError.message);
	} else {
		console.log(`   ✅ ${restData.length} restaurants inserted`);
	}

	// ─── Insert Menu Items ──────────────────────────────────
	console.log("\n🍽️  Inserting menu items...");
	const { data: menuData, error: menuError } = await supabase
		.from("menu_items")
		.upsert(menuItems, { onConflict: "id" })
		.select();

	if (menuError) {
		console.error("   ❌ Menu items error:", menuError.message);
	} else {
		console.log(`   ✅ ${menuData.length} menu items inserted`);
	}

	// ─── Verify ─────────────────────────────────────────────
	console.log("\n📊 Verifying...");
	const { count: rCount } = await supabase
		.from("restaurants")
		.select("*", { count: "exact", head: true });
	const { count: mCount } = await supabase
		.from("menu_items")
		.select("*", { count: "exact", head: true });
	console.log(`   Restaurants: ${rCount}`);
	console.log(`   Menu Items: ${mCount}`);

	console.log("\n🎉 Seeding complete!");
}

seed().catch(console.error);
