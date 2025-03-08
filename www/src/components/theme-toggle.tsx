"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// After mounting, we can safely show the UI that depends on client-side data
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<button
			type="button"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="relative h-9 w-9 rounded-md border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-200"
			aria-label="Toggle theme"
			suppressHydrationWarning
		>
			<div className="relative h-full w-full">
				<span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-200">
					{mounted && (
						<>
							<Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:rotate-90 dark:scale-0" />
							<Moon className="absolute left-0 top-0 h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
						</>
					)}
				</span>
			</div>
		</button>
	);
}
