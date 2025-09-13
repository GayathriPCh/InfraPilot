/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/groq.ts
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
});

function extractJsonFromMarkdown(content: string): string {
    // Remove markdown code blocks if present
    const jsonMatch = content.match(/``````/);
    if (jsonMatch) {
        return jsonMatch[1];
    }
    
    // Try to find JSON array without code blocks
    const arrayMatch = content.match(/(\[[\s\S]*?\])/);
    if (arrayMatch) {
        return arrayMatch[1];
    }
    
    return content.trim();
}

export async function getCiCdRecommendations(context: {
    backend: string;
    frontend: string;
    db: string;
    scm: string;
    buildToolsTests: string;
}) {
    const prompt = `
    Recommend exactly 3 CI/CD tools for a project with:
    Backend: ${context.backend}
    Frontend: ${context.frontend}
    Database: ${context.db}
    Source Code Hosting: ${context.scm}
    Build Tools/Tests: ${context.buildToolsTests}

    Respond with ONLY a JSON array, no markdown formatting, like:
    [
      { "name": "ToolName", "reason": "Short explanation" }
    ]
  `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful DevOps assistant. Always respond with pure JSON only, no markdown formatting." },
                { role: "user", content: prompt }
            ]
        });

        const rawContent = completion.choices[0]?.message?.content || "[]";
        console.log("Raw Groq response:", rawContent); // Debug log
        
        const cleanJson = extractJsonFromMarkdown(rawContent);
        console.log("Cleaned JSON:", cleanJson); // Debug log
        
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error parsing Groq response:", error);
        // Return fallback recommendations based on user input
        return [
            { "name": "GitHub Actions", "reason": `Perfect for ${context.scm} projects` },
            { "name": "Docker", "reason": `Containerize ${context.backend} applications` },
            { "name": "Jenkins", "reason": `Automate ${context.buildToolsTests} builds` }
        ];
    }
}

export async function getPipelineOverview(selected: string[], usages: Record<string, string>) {
    const prompt = `
     Create a beginner-friendly CI/CD pipeline guide using these tools: ${selected.join(", ")}

    Tool usage context:
    ${selected.map(t => `- ${t}: ${usages[t] || "General CI/CD usage"}`).join("\n")}

    Format your response as markdown with these sections:
    ## Pipeline Overview
    Brief explanation of what this pipeline does

    ## Pipeline Steps
    1. **Step Name**: Clear description
    2. **Step Name**: Clear description

    ## Configuration Examples
    Show simple config snippets for each tool

    ## Getting Started
    Quick setup instructions

    Use ONLY the tools listed: ${selected.join(", ")}. Keep explanations simple and actionable.
  `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful DevOps assistant. Use only the tools specified by the user." },
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error getting pipeline overview:", error);
        return "Error generating pipeline overview. Please try again.";
    }
}

// Add these functions to your existing groq.ts file

export async function getDockerComposeRecommendations(context: {
    selectedServices: string[];
    serviceDetails: Record<string, any>;
}) {
    const prompt = `
    Analyze these Docker services and provide optimized recommendations:
    
    Services: ${context.selectedServices.join(", ")}
    
    Service Details:
    ${Object.entries(context.serviceDetails).map(([id, details]) => 
        `${id}: ${JSON.stringify(details)}`
    ).join("\n")}

    For each service, recommend:
    1. Best Docker image to use
    2. Recommended port mappings
    3. Essential environment variables
    4. Whether to expose to host network
    5. Volume mounts if needed
    
    Respond with JSON array:
    [
      {
        "name": "service-name",
        "reason": "Why this configuration",
        "image": "docker-image:tag",
        "port": "3000",
        "recommended_expose": true,
        "recommended_env": {"ENV_VAR": "value"},
        "recommended_volumes": ["./data:/app/data"]
      }
    ]
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a Docker expert. Always respond with valid JSON only." },
                { role: "user", content: prompt }
            ]
        });

        const rawContent = completion.choices[0]?.message?.content || "[]";
        const cleanJson = rawContent.replace(/``````/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error getting Docker recommendations:", error);
        return [
            { "name": "app", "reason": "Main application service", "image": "node:18-alpine", "port": "3000", "recommended_expose": true, "recommended_env": {}, "recommended_volumes": [] }
        ];
    }
}

export async function generateDockerCompose(selected: string[], configs: Record<string, any>, originalServices: string[]) {
    const prompt = `
    Generate a complete Docker Compose setup guide for these services:
    
    Selected Services: ${selected.join(", ")}
    Original Service Types: ${originalServices.join(", ")}
    
    Service Configurations:
    ${Object.entries(configs).map(([service, config]) => 
        `${service}: ${JSON.stringify(config)}`
    ).join("\n")}

    Create a comprehensive guide with:
    ## Docker Compose Configuration
    Complete docker-compose.yml with all services
    
    ## Service Details  
    Explain each service and its purpose
    
    ## Environment Setup
    Required environment variables and their purposes
    
    ## Getting Started
    Step-by-step instructions to run the setup
    
    ## Common Commands
    Useful Docker Compose commands for management
    
    Format as markdown with proper code blocks using \`\`\`yaml for YAML content.
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a Docker expert. Create comprehensive, beginner-friendly guides." },
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error generating Docker Compose:", error);
        return "Error generating Docker Compose setup. Please try again.";
    }
}

export async function getProjectRecommendations(context: {
    selectedType: string;
    customDescription?: string;
    selectedTech: Record<string, string[]>;
    deploymentPlan?: string;
    additionalInfo?: string;
}) {
    const projectDescription = context.selectedType === 'other' 
        ? context.customDescription 
        : `A ${context.selectedType} project`;

    const techPreferences = Object.entries(context.selectedTech)
        .map(([category, techs]) => `${category}: ${techs.join(', ')}`)
        .join('\n');

    const prompt = `
    Design a complete tech stack and architecture for this project:
    
    Project Type: ${projectDescription}
    
    User's Tech Preferences:
    ${techPreferences}
    
    Additional Requirements: ${context.additionalInfo || 'None specified'}
    Deployment Plan: ${context.deploymentPlan || 'Not specified'}
    
    Provide comprehensive recommendations in JSON format:
    {
      "project_name": "Descriptive project name",
      "summary": "Brief project overview",
      "architecture": "High-level architecture description",
      "stack": [
        {
          "component": "Technology name",
          "category": "frontend/backend/database/devops/etc",
          "reason": "Why this is recommended",
          "priority": "high/medium/low",
          "recommended_version": "version or option",
          "default_config": {}
        }
      ],
      "timeline": "Estimated development timeline and phases"
    }
    
    Include frontend, backend, database, deployment, and DevOps tools as appropriate.
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a senior software architect. Provide practical, modern tech stack recommendations in valid JSON format only." },
                { role: "user", content: prompt }
            ]
        });

        const rawContent = completion.choices[0]?.message?.content || "{}";
        const cleanJson = rawContent.replace(/``````/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error getting project recommendations:", error);
        return {
            project_name: "Your New Project",
            summary: "A modern web application",
            architecture: "Standard three-tier architecture with frontend, backend, and database layers",
            stack: [
                { component: "React", category: "frontend", reason: "Popular and well-supported", priority: "high", recommended_version: "18+" },
                { component: "Node.js", category: "backend", reason: "JavaScript ecosystem consistency", priority: "high", recommended_version: "18+" },
                { component: "PostgreSQL", category: "database", reason: "Reliable relational database", priority: "high", recommended_version: "15+" }
            ],
            timeline: "3-6 months for initial version"
        };
    }
}

export async function generateProjectBlueprint(state: {
    originalInput: any;
    recommendations: any;
    selectedComponents: string[];
    configurations: Record<string, any>;
}) {
    const prompt = `
    Create a comprehensive project blueprint and setup guide for:
    
    Project Type: ${state.originalInput.selectedType}
    Selected Components: ${state.selectedComponents.join(', ')}
    
    Component Details:
    ${state.selectedComponents.map(comp => {
        const config = state.configurations[comp];
        return `${comp}: ${JSON.stringify(config)}`;
    }).join('\n')}
    
    Create a detailed guide with these sections:
    ## Project Overview
    Brief description and goals
    
    ## Architecture Diagram
    High-level system design (text-based)
    
    ## Technology Stack
    Detailed explanation of each chosen technology
    
    ## Project Structure
    Recommended folder/file organization
    
    ## Development Environment Setup
    Step-by-step setup instructions
    
    ## Implementation Phases
    Logical development phases with priorities
    
    ## Deployment Strategy
    How to deploy and scale the application
    
    ## Best Practices
    Coding standards and recommendations
    
    Format as comprehensive markdown with code examples where helpful.
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a senior software architect creating detailed project blueprints. Provide comprehensive, actionable guides." },
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error generating project blueprint:", error);
        return "Error generating project blueprint. Please try again.";
    }
}

export async function analyzeFreeformProject(description: string, clarifyingAnswers: Record<string, string>) {
    const answersText = Object.entries(clarifyingAnswers)
        .map(([q, a]) => `Q: ${q}\nA: ${a}`)
        .join('\n\n');

    const prompt = `
    Analyze this project description and provide intelligent recommendations:
    
    Project Description: "${description}"
    
    Additional Context:
    ${answersText}
    
    Provide a comprehensive analysis in JSON format:
    {
      "project_type": "Descriptive project name",
      "category": "Project category (e.g., E-commerce, Social Platform, etc.)",
      "summary": "Brief project understanding",
      "target_users": "Who will use this",
      "key_features": ["feature1", "feature2", "feature3"],
      "complexity": "Simple/Medium/Complex with explanation",
      "estimated_timeline": "Timeline estimate with phases",
      "recommendations": [
        {
          "name": "Technology/Tool name",
          "category": "frontend/backend/database/devops/etc",
          "priority": "high/medium/low",
          "reasoning": "Why this is recommended",
          "specific_benefits": "How this specifically helps their project",
          "alternatives": ["alt1", "alt2"]
        }
      ]
    }
    
    Be intelligent about the recommendations - consider scale, complexity, user base, and specific requirements mentioned.
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an intelligent project analyst and technical architect. Provide thoughtful, contextual recommendations in valid JSON format only." },
                { role: "user", content: prompt }
            ]
        });

        const rawContent = completion.choices[0]?.message?.content || "{}";
        const cleanJson = rawContent.replace(/``````/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error analyzing freeform project:", error);
        return {
            project_type: "Custom Application",
            category: "Web Application",
            summary: "A custom web application based on your description",
            target_users: "General users",
            key_features: ["User interface", "Core functionality", "Data management"],
            complexity: "Medium - Standard web application complexity",
            estimated_timeline: "3-6 months for initial version",
            recommendations: [
                { name: "React", category: "frontend", priority: "high", reasoning: "Popular and well-supported frontend framework", specific_benefits: "Great for building interactive user interfaces", alternatives: ["Vue.js", "Angular"] },
                { name: "Node.js", category: "backend", priority: "high", reasoning: "JavaScript ecosystem consistency", specific_benefits: "Allows using same language across the stack", alternatives: ["Python", "Java"] },
                { name: "PostgreSQL", category: "database", priority: "medium", reasoning: "Reliable relational database", specific_benefits: "Handles complex queries and relationships well", alternatives: ["MongoDB", "MySQL"] }
            ]
        };
    }
}

export async function generateFreeformImplementation(state: {
    originalDescription: string;
    clarifyingAnswers: Record<string, string>;
    analysis: any;
    selectedComponents: string[];
    customizations: Record<string, any>;
}) {
    const prompt = `
    Create a comprehensive implementation plan for this custom project:
    
    Original Idea: "${state.originalDescription}"
    
    User's Additional Context:
    ${Object.entries(state.clarifyingAnswers || {}).map(([q, a]) => `${q}: ${a}`).join('\n')}
    
    Project Analysis: ${JSON.stringify(state.analysis)}
    
    Selected Components: ${state.selectedComponents.join(', ')}
    
    Component Customizations:
    ${Object.entries(state.customizations).map(([comp, custom]) => 
        `${comp}: ${JSON.stringify(custom)}`
    ).join('\n')}
    
    Create a detailed, personalized implementation guide with these sections:
    
    ## Project Overview
    Refined understanding of their specific idea
    
    ## Technical Architecture
    How the selected components work together for their use case
    
    ## Implementation Roadmap
    Phase-by-phase development plan prioritized for their specific needs
    
    ## Core Features Development
    Step-by-step guide for building their key features
    
    ## User Experience Considerations
    UI/UX recommendations specific to their target users
    
    ## Data Strategy
    Database design and data flow for their specific requirements
    
    ## Deployment & Scaling
    How to launch and grow their specific application
    
    ## Next Steps & Iteration
    How to validate, test, and improve their idea
    
    Make this highly personalized to their specific project, not generic advice. Reference their original idea throughout.
    Format as comprehensive markdown with practical code examples where helpful.
    `;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a senior technical consultant creating personalized implementation plans. Make recommendations specific to the user's exact project and requirements." },
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error generating freeform implementation:", error);
        return "Error generating implementation plan. Please try again.";
    }
}

