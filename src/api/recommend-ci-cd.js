import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { backend, frontend, db, scm, buildToolsTests } = req.body;

    const prompt = `
  Recommend 3 CI/CD tools for a project with:
  Backend: ${backend}
  Frontend: ${frontend}
  Database: ${db}
  Source Code Hosting: ${scm}
  Build Tools/Tests: ${buildToolsTests}

  Respond as JSON array: [{ "name": "ToolName", "reason": "Why recommended" }]
  `;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
    });

    try {
        const json = JSON.parse(completion.choices[0].message.content);
        res.json({ recommendations: json });
    } catch {
        res.status(500).json({ error: "AI output parse failed" });
    }
}
