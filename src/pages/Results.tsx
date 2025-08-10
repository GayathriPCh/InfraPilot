import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPipelineOverview } from "@/utils/groq"; // import utility

export default function Results() {
    const { state } = useLocation();
    const [result, setResult] = useState("");

    useEffect(() => {
        if (!state) return;
        (async () => {
            const res = await getPipelineOverview(state.selected, state.usages);
            setResult(res);
        })();
    }, [state]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Pipeline Overview</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{result}</pre>
        </div>
    );
}
