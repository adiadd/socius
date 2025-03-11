import Link from "next/link";
import { getAllScenarioResults } from "../lib/server-utils";

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

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.scenarios.map((scenario) => (
                                    <Link
                                        key={scenario.id}
                                        href={`/scenarios/${category.id}/${scenario.id}`}
                                        className="border border-black dark:border-white p-4 hover:bg-accent/10 transition-colors"
                                    >
                                        <h3 className="text-lg font-medium">{scenario.name}</h3>
                                    </Link>
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