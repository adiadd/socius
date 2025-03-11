// Helper type definitions for scenario data
export interface ModelResult {
    modelId: string;
    modelConfig: {
        name: string;
        provider: string;
        version?: string;
        maxTokens?: number;
        temperature?: number;
    };
    promptPath: string;
    promptContent: {
        metadata: {
            title: string;
            tags: string[];
            difficulty: string;
            createdAt: string;
        };
        content: string;
    };
    response: {
        choices?: Array<{ message?: { content?: string } }>;
        content?: string | Array<{ text: string }>;
        [key: string]: unknown;
    };
    timestamp: string;
    elapsedTimeMs: number;
}

export interface ScenarioResult {
    scenarioId: string;
    categoryId: string;
    modelResults: {
        [modelId: string]: {
            [date: string]: ModelResult;
        };
    };
}
