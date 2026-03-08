"use client";

import Link from "next/link";
import { Star, Clock, Flame, ArrowRight } from "lucide-react";

export function HeroSection() {
	return (
		<div
			className="relative overflow-hidden bg-gray-950"
			style={{ height: "calc(100vh - 64px)" }}
		>
			{/* Background image with overlay */}
			<div className="absolute inset-0">
				<img
					src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop&crop=center"
					alt="Delicious food spread"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-b from-gray-950/80 via-gray-950/60 to-gray-950/90" />
			</div>

			{/* Decorative blurred circles */}
			<div className="absolute top-20 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
			<div className="absolute bottom-10 right-0 w-80 h-80 bg-red-500/15 rounded-full blur-3xl" />

			{/* Content */}
			<div className="relative flex flex-col items-center justify-center text-center px-6 py-8 h-full">
				{/* Badge */}
				<span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-medium px-5 py-2 rounded-full mb-5 animate-fade-in">
					<Flame className="w-4 h-4 text-orange-400" />
					Free delivery on your first order
				</span>

				{/* Headline */}
				<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-4 max-w-4xl tracking-tight">
					Food that
					<span className="bg-linear-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
						{" "}
						moves{" "}
					</span>
					you
				</h1>

				{/* Subheadline */}
				<p className="text-base md:text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
					Discover top restaurants near you and get your favorite meals
					delivered fresh and fast — in minutes, not hours.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mb-8">
					<Link
						href="/restaurants"
						className="group relative bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
					>
						<span className="flex items-center gap-2">
							Order Now
							<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
						</span>
					</Link>
					<Link
						href="/restaurants"
						className="border border-white/20 text-white font-semibold px-10 py-4 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
					>
						Browse Restaurants
					</Link>
				</div>

				{/* Stats Row */}
				<div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-white/10 rounded-full">
							<Clock className="w-4 h-4 text-orange-400" />
						</div>
						<span className="text-sm font-medium">20-40 min delivery</span>
					</div>
					<div className="w-px h-6 bg-white/20 hidden sm:block" />
					<div className="flex items-center gap-2">
						<div className="p-2 bg-white/10 rounded-full">
							<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
						</div>
						<span className="text-sm font-medium">4.8 avg rating</span>
					</div>
					<div className="w-px h-6 bg-white/20 hidden sm:block" />
					<div className="flex items-center gap-2">
						<div className="p-2 bg-white/10 rounded-full">
							<Flame className="w-4 h-4 text-red-400" />
						</div>
						<span className="text-sm font-medium">500+ restaurants</span>
					</div>
				</div>
			</div>
		</div>
	);
}
