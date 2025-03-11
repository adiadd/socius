// Props for scenario page
export interface ScenarioPageProps {
    params: Promise<{
        categoryId: string;
        scenarioId: string;
    }>;
}

// Props for model results page
export interface ModelResultsPageProps {
    params: Promise<{
        categoryId: string;
        scenarioId: string;
        modelId: string;
    }>;
}

// Props for specific scenario result page
export interface ScenarioResultPageProps {
    params: Promise<{
        categoryId: string;
        scenarioId: string;
        modelId: string;
        date: string;
    }>;
}
