"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("theme");
		if (stored === "dark") {
			setIsDark(true);
			document.documentElement.classList.add("dark");
		} else if (stored === "light") {
			setIsDark(false);
			document.documentElement.classList.remove("dark");
		} else {
			// Check system preference
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			setIsDark(prefersDark);
			if (prefersDark) {
				document.documentElement.classList.add("dark");
			}
		}
	}, []);

	const toggleTheme = () => {
		setIsDark((prev) => {
			const next = !prev;
			if (next) {
				document.documentElement.classList.add("dark");
				localStorage.setItem("theme", "dark");
			} else {
				document.documentElement.classList.remove("dark");
				localStorage.setItem("theme", "light");
			}
			return next;
		});
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
