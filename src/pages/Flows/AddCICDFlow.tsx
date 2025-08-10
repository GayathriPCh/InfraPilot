import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddCICDFlow() {
    const [backend, setBackend] = useState("");
    const [frontend, setFrontend] = useState("");
    const [db, setDb] = useState("");
    const [scm, setScm] = useState("");
    const [buildToolsTests, setBuildToolsTests] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/recommendations", {
            state: { backend, frontend, db, scm, buildToolsTests },
        });
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Add CI/CD to my existing project</h1>

            <label className="block mb-3">
                Backend:
                <input value={backend} onChange={e => setBackend(e.target.value)} className="w-full border rounded p-2" placeholder="Node.js, Django..." />
            </label>

            <label className="block mb-3">
                Frontend:
                <input value={frontend} onChange={e => setFrontend(e.target.value)} className="w-full border rounded p-2" placeholder="React, Angular..." />
            </label>

            <label className="block mb-3">
                Database:
                <input value={db} onChange={e => setDb(e.target.value)} className="w-full border rounded p-2" placeholder="Postgres, MongoDB..." />
            </label>

            <label className="block mb-3">
                Source Code Hosting:
                <input value={scm} onChange={e => setScm(e.target.value)} className="w-full border rounded p-2" placeholder="GitHub, GitLab..." />
            </label>

            <label className="block mb-3">
                Build tools/tests:
                <input value={buildToolsTests} onChange={e => setBuildToolsTests(e.target.value)} className="w-full border rounded p-2" placeholder="Maven, npm, Gradle, JUnit..." />
            </label>

            <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-primary text-white rounded">
                Continue
            </button>
        </div>
    );
}
