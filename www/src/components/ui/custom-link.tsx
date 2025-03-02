import Link from "next/link";
import type React from "react";
import { cn } from "../../lib/utils";

interface CustomLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	external?: boolean;
	className?: string;
	children: React.ReactNode;
}

export function CustomLink({
	href,
	external = false,
	className,
	children,
	...props
}: CustomLinkProps) {
	const linkProps = external
		? {
				target: "_blank",
				rel: "noopener noreferrer",
			}
		: {};

	// Special visual indicator for external links
	const externalIndicator = external ? (
		<span className="inline-block ml-1">↗</span>
	) : null;

	const baseClasses =
		"text-link hover:text-link-hover underline underline-offset-4 transition-colors duration-200";

	return href.startsWith("/") || href.startsWith("#") ? (
		<Link
			href={href}
			className={cn(baseClasses, className)}
			{...props}
			{...linkProps}
		>
			{children}
			{externalIndicator}
		</Link>
	) : (
		<a
			href={href}
			className={cn(baseClasses, className)}
			{...props}
			{...linkProps}
		>
			{children}
			{externalIndicator}
		</a>
	);
}
