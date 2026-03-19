"use client";

import { Flame } from "lucide-react";
import { useRef } from "react";

import { useGetPopularDishes } from "@/hooks/useMenuItems";
import { LoadingSpinner } from "../ui/Loading";
import DishesList from "./DishCard";
import ScrollArrows from "./ScrollArrows";

export function PopularDishes() {
	const { isLoading, dishes } = useGetPopularDishes(8);
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = 240;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	if (isLoading) return <LoadingSpinner message="Loading Popular Dishes..." />;
	if (dishes?.length === 0) return null;

	return (
		<section className="mb-14">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<Flame className="w-6 h-6 text-orange-500" />
					<h2 className="text-3xl">Popular Dishes</h2>
				</div>
				<ScrollArrows scroll={scroll} />
			</div>
			<div
				ref={scrollRef}
				className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent hover:scrollbar-thumb-orange-400"
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "#fdba74 transparent",
				}}
			>
				{dishes?.map((dish) => (
					<DishesList key={dish.id} dish={dish} />
				))}
			</div>
		</section>
	);
}
