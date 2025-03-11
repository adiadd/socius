import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllResults } from "../../../../lib/server-utils";
import { formatDate } from "../../../../lib/utils";

interface ScenarioPageProps {
    params: Promise<{
        categoryId: string;
        scenarioId: string;
    }>;
}

export async function generateMetadata({ params }: ScenarioPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { categoryId, scenarioId } = resolvedParams;
    const formattedScenario = scenarioId.split('-').join(' ');

    return {
        title: `${formattedScenario} / scenarios`,
        description: `View all model responses for the ${formattedScenario} scenario.`,
    };
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
    const resolvedParams = await params;
    const { categoryId, scenarioId } = resolvedParams;
    const results = await getAllResults();

    const scenarioResult = results[categoryId]?.[scenarioId];
    if (!scenarioResult) {
        notFound();
    }

    const formattedScenario = scenarioId.split('-').join(' ');
    const modelResults = scenarioResult.modelResults;

    // Extract unique dates across all models
    const allDates = new Set<string>();

    // Type-safe approach to iterate through the results
    Object.entries(modelResults || {}).forEach(([_, dateResults]) => {
        if (dateResults && typeof dateResults === 'object') {
            Object.keys(dateResults).forEach((date) => {
                allDates.add(date);
            });
        }
    });

    // Sort dates in descending order
    const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Breadcrumb navigation */}
            <div className="mb-8">
                <Link
                    href="/scenarios"
                    className="inline-flex items-center text-sm hover:underline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to scenarios
                </Link>
            </div>

            {/* Header section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">{formattedScenario}</h1>
                <p className="text-muted-foreground">
                    View all model responses for this scenario
                </p>
            </div>

            {/* Dates section */}
            <div>
                {sortedDates.map((date) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-lg font-medium mb-4">
                            {formatDate(date === '2025-03-08' ? '2025-03-08T00:00:00Z' : date)}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(modelResults || {}).map(([modelId, dateResults]) => {
                                if (!dateResults || typeof dateResults !== 'object') return null;
                                const result = (dateResults as Record<string, any>)[date];
                                if (!result) return null;

                                return (
                                    <Link
                                        key={modelId}
                                        href={`/scenarios/${categoryId}/${scenarioId}/${modelId}/${date}`}
                                        className="block border border-black dark:border-white p-4 hover:bg-accent/10 transition-colors no-underline"
                                    >
                                        <div className="flex justify-between mb-2">
                                            <h4 className="font-medium">{result.modelConfig?.name || modelId}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2 no-underline">
                                            {result.modelConfig?.provider || 'Unknown provider'}
                                        </p>
                                        <p className="text-sm">
                                            {((result.elapsedTimeMs || 0) / 1000).toFixed(2)}s response time
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 