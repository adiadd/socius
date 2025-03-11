"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { CustomLink } from "@/components/ui/custom-link";
import { BrainCircuit, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Nav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	// After mounting, we can safely show UI that depends on client-side data
	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<BrainCircuit className="h-6 w-6" />
					<Link
						href="/"
						className="text-xl no-underline hover:text-black dark:hover:text-white"
					>
						socius
					</Link>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-4">
					<CustomLink
						href="/scenarios"
						external={false}
						showExternalIndicator={false}
					>
						scenarios
					</CustomLink>
					<CustomLink
						href="https://github.com/adiadd/socius"
						external={true}
						showExternalIndicator={true}
					>
						github
					</CustomLink>
					<ThemeToggle />
				</div>

				{/* Mobile menu button */}
				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />
					{mounted && (
						<button
							type="button"
							onClick={toggleMobileMenu}
							className="relative h-9 w-9 flex items-center justify-center rounded-md border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground transition-all duration-200"
							aria-label="Toggle mobile menu"
						>
							{mobileMenuOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</button>
					)}
				</div>
			</div>

			<p className="mt-2 text-muted-foreground">
				<CustomLink
					href="https://www.merriam-webster.com/dictionary/anthropocentric"
					external={true}
					showExternalIndicator={true}
				>
					anthropocentric
				</CustomLink>{" "}
				scenarios for ai
			</p>

			{/* Mobile menu */}
			{mounted && mobileMenuOpen && (
				<div className="mt-4 border-t border-black dark:border-white pt-4 md:hidden">
					<nav className="flex flex-col space-y-3">
						<CustomLink
							href="/scenarios"
							external={false}
							showExternalIndicator={false}
							className="hover:underline"
						>
							scenarios
						</CustomLink>
						<CustomLink
							href="https://github.com/adiadd/socius"
							external={true}
							showExternalIndicator={true}
							className="hover:underline"
						>
							github
						</CustomLink>
					</nav>
				</div>
			)}
		</div>
	);
}
