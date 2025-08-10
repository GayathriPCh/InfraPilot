import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCiCdRecommendations } from "@/utils/groq"; // import from utils

export default function Recommendations() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [tools, setTools] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [usages, setUsages] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!state) return;
        (async () => {
            const recs = await getCiCdRecommendations(state);
            setTools(recs);
            setSelected(recs.map(r => r.name));
        })();
    }, [state]);

    const toggle = (tool: string) => {
        setSelected(s => s.includes(tool) ? s.filter(t => t !== tool) : [...s, tool]);
    };

    const handleUsageChange = (tool: string, val: string) => {
        setUsages(u => ({ ...u, [tool]: val }));
    };

    const handleNext = () => {
        navigate("/results", { state: { selected, usages } });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended CI/CD Tools</h2>
            {tools.map(t => (
                <div key={t.name} className="border p-3 rounded mb-2">
                    <label>
                        <input type="checkbox" checked={selected.includes(t.name)} onChange={() => toggle(t.name)} className="mr-2" />
                        <strong>{t.name}</strong> — {t.reason}
                    </label>
                    {selected.includes(t.name) && (
                        <input
                            className="mt-2 w-full border rounded p-2"
                            placeholder={`How will you use ${t.name}?`}
                            value={usages[t.name] || ""}
                            onChange={(e) => handleUsageChange(t.name, e.target.value)}
                        />
                    )}
                </div>
            ))}
            <button onClick={handleNext} className="mt-4 px-4 py-2 bg-primary text-white rounded">
                Generate Setup
            </button>
        </div>
    );
}
