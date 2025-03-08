import Link from "next/link";

// This is just a placeholder for now - it will be replaced with real data from the results folder
const scenarioCategories = [
    {
        id: "ethics",
        name: "ethics",
        description: "scenarios focused on ethical reasoning and moral dilemmas",
        scenarios: [
            {
                id: "trolley-problem",
                name: "trolley problem",
                description: "evaluating how ai approaches the classic ethical dilemma",
                models: ["claude-3.5-sonnet", "gpt-4", "gemini-2.0-flash"]
            }
        ]
    },
    {
        id: "society",
        name: "society",
        description: "scenarios exploring social policies and societal frameworks",
        scenarios: [
            {
                id: "universal-basic-income",
                name: "universal basic income",
                description: "examining ai's perspective on economic policy alternatives",
                models: ["claude-3.5-sonnet", "gpt-4", "gemini-2.0-flash"]
            }
        ]
    }
];

export default function ScenariosPage() {
    return (
        <>
            {/* Intro section */}
            <div className="border-b border-black dark:border-white p-6 text-center">
                <p className="text-secondary font-medium font-bold text-lg">scenarios</p>
            </div>

            {/* Scenarios listing */}
            {scenarioCategories.map((category) => (
                <div key={category.id} className="border-b border-black dark:border-white p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/4 mb-2 md:mb-0 md:pr-4">
                            <p className="text-secondary font-medium">{category.name}</p>
                        </div>
                        <div className="w-full md:w-3/4">
                            <p>{category.description}</p>

                            <div className="mt-6 space-y-6">
                                {category.scenarios.map((scenario) => (
                                    <div key={scenario.id} className="border border-black dark:border-white p-4">
                                        <h3 className="text-lg font-medium mb-2">{scenario.name}</h3>
                                        <p className="mb-4">{scenario.description}</p>

                                        <div className="mt-4">
                                            <p className="text-muted-foreground mb-2">available model responses:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {scenario.models.map((model) => (
                                                    <Link
                                                        key={model}
                                                        href={`/scenarios/${category.id}/${scenario.id}/${model}`}
                                                        className="px-3 py-1.5 border border-black dark:border-white text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                                    >
                                                        {model}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
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