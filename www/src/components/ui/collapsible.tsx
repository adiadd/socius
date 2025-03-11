"use client";

import { cn } from "@/lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
		showIcon?: boolean;
	}
>(({ className, children, showIcon = true, ...props }, ref) => (
	<CollapsiblePrimitive.Trigger
		ref={ref}
		className={cn(
			"flex w-full items-center justify-between py-2 text-lg font-medium transition-all hover:text-accent [&[data-state=open]>svg]:rotate-180",
			className,
		)}
		{...props}
	>
		{children}
		{showIcon && (
			<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
		)}
	</CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = forwardRef<
	React.ElementRef<typeof CollapsiblePrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<CollapsiblePrimitive.Content
		ref={ref}
		className={cn(
			"overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
			className,
		)}
		{...props}
	>
		<div className="pt-0">{children}</div>
	</CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
