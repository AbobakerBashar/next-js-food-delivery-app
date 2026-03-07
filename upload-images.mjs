import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = "https://unlfqxrnbrnsspjozxfs.supabase.co";
const supabaseKey =
	process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SERVICE_ROLE_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = "images";
const IMAGES_DIR = path.join(__dirname, "public", "images");

async function uploadAllImages() {
	const folders = ["hero", "restaurants", "categories", "dishes", "featured"];
	let uploaded = 0;
	let failed = 0;

	for (const folder of folders) {
		const folderPath = path.join(IMAGES_DIR, folder);
		if (!fs.existsSync(folderPath)) {
			console.log(`⚠️  Folder not found: ${folder}`);
			continue;
		}

		const files = fs.readdirSync(folderPath);
		console.log(`\n📁 Uploading ${folder}/ (${files.length} files)...`);

		for (const file of files) {
			const filePath = path.join(folderPath, file);
			const fileBuffer = fs.readFileSync(filePath);
			const storagePath = `${folder}/${file}`;

			const { data, error } = await supabase.storage
				.from(BUCKET)
				.upload(storagePath, fileBuffer, {
					contentType: "image/jpeg",
					upsert: true,
				});

			if (error) {
				console.log(`   ❌ ${storagePath}: ${error.message}`);
				failed++;
			} else {
				const { data: urlData } = supabase.storage
					.from(BUCKET)
					.getPublicUrl(storagePath);
				console.log(`   ✅ ${storagePath}`);
				uploaded++;
			}
		}
	}

	console.log(`\n🎉 Done! Uploaded: ${uploaded}, Failed: ${failed}`);

	// Print all public URLs for reference
	console.log("\n📋 All Public URLs:");
	for (const folder of folders) {
		const folderPath = path.join(IMAGES_DIR, folder);
		if (!fs.existsSync(folderPath)) continue;
		const files = fs.readdirSync(folderPath);
		console.log(`\n--- ${folder} ---`);
		for (const file of files) {
			const storagePath = `${folder}/${file}`;
			const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
			console.log(`${file}: ${data.publicUrl}`);
		}
	}
}

uploadAllImages().catch(console.error);
