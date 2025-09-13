/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCiCdRecommendations } from "@/utils/groq";

export default function Recommendations() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [tools, setTools] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [usages, setUsages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state) return;
        console.log("📨 Received state in Recommendations:", state);
        
        (async () => {
            setLoading(true);
            try {
                const recs = await getCiCdRecommendations(state);
                console.log("🤖 Got recommendations:", recs);
                setTools(recs);
                setSelected(recs.map(r => r.name));
            } catch (error) {
                console.error("Error getting recommendations:", error);
            } finally {
                setLoading(false);
            }
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

   if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Your Tech Stack</h2>
                <p className="text-muted-foreground">Our AI is finding the perfect CI/CD tools for you...</p>
            </div>
        </div>
    );
}


    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            {/* Back button */}
            <div className="relative p-6">
                <button
                    onClick={() => navigate('/flow/add-cicd')}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors duration-200"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Project Details
                </button>
            </div>

            <div className="relative max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        AI Recommendations Ready
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        Perfect Tools for Your Stack
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Based on your tech stack, we've selected the most suitable CI/CD tools. Customize how you plan to use each one.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="space-y-4 mb-8">
                    {tools.map((tool, index) => (
                        <div
                            key={tool.name}
                            className={`group relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                                selected.includes(tool.name)
                                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                                    : 'border-border/50 hover:border-border'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(tool.name)}
                                            onChange={() => toggle(tool.name)}
                                            className="w-5 h-5 text-primary border-2 border-border rounded focus:ring-primary/20 focus:ring-2"
                                        />
                                        <div className="absolute -top-1 -right-1">
                                            <span className="flex h-3 w-3">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                                    selected.includes(tool.name) ? 'bg-primary' : 'bg-transparent'
                                                }`}></span>
                                                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                                                    selected.includes(tool.name) ? 'bg-primary' : 'bg-transparent'
                                                }`}></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
                                    </div>
                                    
                                    <p className="text-muted-foreground mb-4">{tool.reason}</p>
                                    
                                    {selected.includes(tool.name) && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                            <label className="text-sm font-medium text-foreground">
                                                How do you plan to use {tool.name}?
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`e.g., "Build and deploy my ${state.backend} app", "Run automated tests", "Container deployment"`}
                                                value={usages[tool.name] || ""}
                                                onChange={(e) => handleUsageChange(tool.name, e.target.value)}
                                                className="w-full px-4 py-3 bg-background/80 border border-border rounded-xl 
                                                         focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                                         transition-all duration-200 placeholder:text-muted-foreground/70"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleNext}
                        disabled={selected.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-primary to-primary/80 
                                 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                 active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 before:absolute before:inset-0 before:rounded-xl 
                                 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                                 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                    >
                        <span className="relative flex items-center justify-center gap-2">
                            Generate My Pipeline
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 text-muted-foreground hover:text-foreground 
                                 border border-border/50 rounded-xl hover:border-border 
                                 hover:bg-muted/30 transition-all duration-200
                                 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Try Our Other Features
                    </button>
                    
                    <p className="text-xs text-muted-foreground text-center mt-2">
                        Selected {selected.length} of {tools.length} tools
                    </p>
                </div>
            </div>
        </div>
    );
}
