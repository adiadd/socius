import type { ModelResult } from "@/types/scenario-types";

// Props for scenario result card component
export interface ScenarioResultCardProps {
	result: ModelResult;
	categoryId: string;
	scenarioId: string;
}

// Props for collapsible section component
export interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	className?: string;
	contentClassName?: string;
}
