"use client";

import { cn } from "@/lib/utils";
import type { CollapsibleSectionProps } from "@/types/component-props";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function CollapsibleSection({
	title,
	defaultOpen = true,
	className,
	contentClassName,
	children,
}: CollapsibleSectionProps) {
	// Use state with null initial value to prevent hydration mismatch
	const [isOpen, setIsOpen] = useState<boolean | null>(null);
	const [isMounted, setIsMounted] = useState(false);
	const childrenRef = useRef(children);

	// Set the initial state after hydration is complete
	useEffect(() => {
		setIsOpen(defaultOpen);
		setIsMounted(true);
	}, [defaultOpen]);

	// Store the initial children and use that reference to prevent unnecessary reconciliation
	useEffect(() => {
		childrenRef.current = children;
	}, []);

	// Memoize children to maintain reference stability
	const memoizedChildren = useMemo(() => childrenRef.current, []);

	return (
		<div className={cn("w-full", className)}>
			<button
				onClick={() => setIsOpen((prevOpen) => !prevOpen)}
				className="flex w-full items-center justify-between text-lg font-medium mb-4 hover:text-accent transition-colors hover:cursor-pointer"
				aria-expanded={isOpen === null ? undefined : isOpen}
				type="button"
			>
				<span>{title}</span>
				{isMounted && (
					<span className="transform transition-transform duration-200">
						{isOpen ? (
							<ChevronUp className="h-4 w-4 transition-transform duration-200" />
						) : (
							<ChevronDown className="h-4 w-4 transition-transform duration-200" />
						)}
					</span>
				)}
			</button>
			{isMounted && (
				<div
					className={cn(
						"transition-all duration-300 ease-in-out",
						isOpen
							? "max-h-[5000px] opacity-100"
							: "max-h-0 opacity-0 overflow-hidden",
						contentClassName,
					)}
				>
					{memoizedChildren}
				</div>
			)}
		</div>
	);
}
