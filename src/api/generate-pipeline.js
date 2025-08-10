import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { selected, usages } = req.body;

    const prompt = `
  Generate a detailed CI/CD pipeline configuration overview for the following tools:
  ${selected.map(t => `${t}: ${usages[t] || ""}`).join("\n")}

  Include steps, triggers, and any relevant YAML snippets.
  `;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
    });

    res.json({ output: completion.choices[0].message.content });
}
