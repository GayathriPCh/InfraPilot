// src/utils/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function getCiCdRecommendations(context: {
    backend: string;
    frontend: string;
    db: string;
    scm: string;
    buildToolsTests: string;
}) {
    const prompt = `
    Recommend 3 CI/CD tools for a project with:
    Backend: ${context.backend}
    Frontend: ${context.frontend}
    Database: ${context.db}
    Source Code Hosting: ${context.scm}
    Build Tools/Tests: ${context.buildToolsTests}

    Respond as a JSON array like:
    [
      { "name": "ToolName", "reason": "Short explanation" }
    ]
  `;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: "You are a helpful DevOps assistant." },
            { role: "user", content: prompt }
        ]
    });

    return JSON.parse(completion.choices[0].message.content || "[]");
}

export async function getPipelineOverview(selected: string[], usages: Record<string, string>) {
    const prompt = `
    Generate a CI/CD pipeline overview for the following tools:
    ${selected.map(t => `${t}: ${usages[t] || ""}`).join("\n")}

    Include steps, triggers, and short YAML examples.
  `;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: "You are a helpful DevOps assistant." },
            { role: "user", content: prompt }
        ]
    });

    return completion.choices[0].message.content || "";
}
