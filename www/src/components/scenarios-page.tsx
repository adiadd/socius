import Link from "next/link";
import { Suspense } from "react";
import { getAllScenarioResults, getLatestResultsForScenario } from "../lib/server-utils";
import ScenarioResultCard from "./scenario-result-card";

// This component will be loaded asynchronously to fetch and display scenario results
async function ScenarioResults({ categoryId, scenarioId }: { categoryId: string; scenarioId: string }) {
    const latestResults = await getLatestResultsForScenario(categoryId, scenarioId);
    const modelIds = Object.keys(latestResults);

    if (modelIds.length === 0) {
        return <p className="text-sm text-muted-foreground">No results available yet</p>;
    }

    return (
        <div className="mt-4">
            <p className="text-muted-foreground mb-2">latest model responses:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modelIds.map((modelId) => (
                    <ScenarioResultCard
                        key={modelId}
                        result={latestResults[modelId]}
                        categoryId={categoryId}
                        scenarioId={scenarioId}
                    />
                ))}
            </div>

            <div className="mt-4">
                <Link
                    href={`/scenarios/${categoryId}/${scenarioId}`}
                >
                    View all runs →
                </Link>
            </div>
        </div>
    );
}

// This component handles loading state while scenario results are being fetched
function ScenarioResultsLoader({ categoryId, scenarioId }: { categoryId: string; scenarioId: string }) {
    return (
        <Suspense fallback={
            <div className="mt-4">
                <p className="text-muted-foreground mb-2">loading results...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-black dark:border-white p-4 animate-pulse">
                            <div className="h-5 bg-accent/40 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-accent/30 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-accent/20 rounded w-full mb-2"></div>
                            <div className="h-4 bg-accent/20 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-accent/20 rounded w-2/3 mb-4"></div>
                            <div className="h-4 bg-accent/30 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        }>
            <ScenarioResults categoryId={categoryId} scenarioId={scenarioId} />
        </Suspense>
    );
}

// This component fetches all scenario categories and renders the page
export default async function ScenariosPage() {
    // Fetch all scenario results
    const allResults = await getAllScenarioResults();

    // Transform the results into the scenarioCategories format
    const scenarioCategories = Object.entries(allResults).map(([categoryId, scenarios]) => {
        return {
            id: categoryId,
            name: categoryId,
            description: getCategoryDescription(categoryId),
            scenarios: Object.entries(scenarios).map(([scenarioId, scenario]) => {
                return {
                    id: scenarioId,
                    name: formatScenarioName(scenarioId),
                    description: getScenarioDescription(categoryId, scenarioId),
                    models: Object.keys(scenario.modelResults)
                };
            })
        };
    });

    // If no results are found, show placeholder data
    if (scenarioCategories.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-secondary font-medium mb-4">No scenario results found</p>
                <p>Make sure you have run some scenarios and have results in the src/results directory.</p>
            </div>
        );
    }

    return (
        <>
            {/* Intro section */}
            <div className="border-b border-black dark:border-white p-6 text-center">
                <p className="text-secondary font-medium font-bold text-lg">scenarios</p>
                <p className="mt-2 max-w-2xl mx-auto">
                    Explore scenarios designed to evaluate AI systems on their understanding of human values and ethical reasoning.
                </p>
            </div>

            {/* Scenarios listing */}
            {scenarioCategories.map((category) => (
                <div key={category.id} className="border-b border-black dark:border-white p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/6 mb-2 md:mb-0 md:pr-4">
                            <p className="text-secondary font-medium">{category.name}</p>
                        </div>
                        <div className="w-full md:w-5/6">
                            <p>{category.description}</p>

                            <div className="mt-6 space-y-8">
                                {category.scenarios.map((scenario) => (
                                    <div key={scenario.id} className="border border-black dark:border-white p-4">
                                        <h3 className="text-lg font-medium mb-2">{scenario.name}</h3>
                                        <p className="mb-4">{scenario.description}</p>

                                        <ScenarioResultsLoader
                                            categoryId={category.id}
                                            scenarioId={scenario.id}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Future section */}
            <div className="p-6">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 mb-2 md:mb-0 md:pr-4">
                        <p className="text-secondary font-medium">coming soon</p>
                    </div>
                    <div className="w-full md:w-3/4">
                        <p>
                            we're continuously adding new scenarios - if you'd like to contribute, please create an issue and pull request on github ◡̈
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Helper functions for scenario metadata
function getCategoryDescription(categoryId: string): string {
    const descriptions: Record<string, string> = {
        "ethics": "scenarios focused on ethical reasoning and moral dilemmas",
        "society": "scenarios exploring social policies and societal frameworks",
        // Add more categories as needed
    };

    return descriptions[categoryId] || `${categoryId} scenarios`;
}

function getScenarioDescription(categoryId: string, scenarioId: string): string {
    const descriptions: Record<string, Record<string, string>> = {
        "ethics": {
            "trolley-problem": "evaluating how ai approaches the classic ethical dilemma"
        },
        "society": {
            "universal-basic-income": "examining ai's perspective on economic policy alternatives"
        }
        // Add more scenarios as needed
    };

    return descriptions[categoryId]?.[scenarioId] || `${formatScenarioName(scenarioId)} scenario`;
}

function formatScenarioName(scenarioId: string): string {
    return scenarioId.split('-').join(' ');
} 