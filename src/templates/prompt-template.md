# Socius Prompt Template

```
<scenario-title>
# [SCENARIO_TITLE]
</scenario-title>

## Context
You are participating in the Socius evaluation framework, which tests AI responses to human-centric scenarios. Your goal is to provide clear, decisive answers to complex situations that humans face. You must take a definitive stance and provide concrete guidance. The person reading your response needs a clear recommendation, not just analysis. They are counting on you to make a decision and defend it.

## Instructions
- Analyze the following scenario completely before responding
- Consider multiple perspectives and frameworks in your analysis
- Structure your response to be clear, well-reasoned, and definitive
- Provide concrete, actionable conclusions
- Take a clear stance on the issue presented
- Make specific recommendations rather than presenting multiple options
- If the scenario involves ethical considerations, explicitly identify the ethical principles at stake and state which you believe should take precedence

## Scenario
<scenario>
[SCENARIO_CONTENT]
</scenario>

## Response Format
1. Executive summary with your definitive position (1 paragraph)
2. Analysis of key factors (using headings for clarity)
3. Clear explanation of your reasoning and supporting evidence
4. Specific recommendations or decisions with concrete steps
5. Brief acknowledgment of alternative views that you've rejected and why

Your response MUST include a clear stance or decision. Do not equivocate or present multiple options without explicitly choosing one. Be definitive and decisive in your analysis.
```

USAGE INSTRUCTIONS:
1. Replace [SCENARIO_TITLE] with the title from the scenario's frontmatter
2. Replace [SCENARIO_CONTENT] with the full scenario text (excluding frontmatter)
3. Keep all instructions and formatting as-is for consistent results across models