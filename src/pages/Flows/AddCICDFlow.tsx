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

    const inputFields = [
        { 
            id: 'backend', 
            label: 'Backend Framework', 
            value: backend, 
            setter: setBackend, 
            placeholder: 'Node.js, Python FastAPI, Django, Spring Boot...',
            icon: '🔧'
        },
        { 
            id: 'frontend', 
            label: 'Frontend Framework', 
            value: frontend, 
            setter: setFrontend, 
            placeholder: 'React, Angular, Vue, Next.js...',
            icon: '🌐'
        },
        { 
            id: 'db', 
            label: 'Database', 
            value: db, 
            setter: setDb, 
            placeholder: 'PostgreSQL, MongoDB, MySQL, Redis...',
            icon: '🗄️'
        },
        { 
            id: 'scm', 
            label: 'Source Code Hosting', 
            value: scm, 
            setter: setScm, 
            placeholder: 'GitHub, GitLab, Bitbucket...',
            icon: '📦'
        },
        { 
            id: 'buildToolsTests', 
            label: 'Build Tools & Testing', 
            value: buildToolsTests, 
            setter: setBuildToolsTests, 
            placeholder: 'Maven, npm, Gradle, JUnit, pytest...',
            icon: '⚙️'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Back to InfraPilot
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-bold">IP</span>
                        </div>
                        <div className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            InfraPilot
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></div>
                        </div>
                        CI/CD Pipeline Builder
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Add CI/CD to your
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            existing project
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Tell us about your current tech stack and our AI will recommend the perfect CI/CD pipeline configuration
                    </p>
                </div>

                {/* Form Card */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 md:p-12">
                        <div className="space-y-8">
                            {inputFields.map((field, index) => (
                                <div key={field.id} className="group/field">
                                    <label htmlFor={field.id} className="flex items-center gap-3 text-lg font-medium text-white mb-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                                            <span className="text-lg">{field.icon}</span>
                                        </div>
                                        <span className="flex items-center gap-3">
                                            {field.label}
                                            <span className="text-sm text-slate-500 font-normal">
                                                {index + 1} of {inputFields.length}
                                            </span>
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id={field.id}
                                            type="text"
                                            value={field.value}
                                            onChange={e => field.setter(e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                                     text-white placeholder:text-slate-500
                                                     focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                                                     hover:border-slate-600/50 transition-all duration-200
                                                     group-hover/field:bg-slate-800/70"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover/field:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-12 mb-8">
                            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                                <span>Configuration Progress</span>
                                <span>{inputFields.filter(f => f.value.trim()).length}/{inputFields.length} completed</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${(inputFields.filter(f => f.value.trim()).length / inputFields.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={handleSubmit}
                                disabled={inputFields.filter(f => f.value.trim()).length === 0}
                                className="group relative w-full max-w-md px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                                         hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl 
                                         shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40
                                         hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                         disabled:shadow-none"
                            >
                                <span className="relative flex items-center justify-center gap-3">
                                    <span className="text-lg">🚀</span>
                                    Generate AI Recommendations
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </span>
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="group flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white 
                                         border border-slate-700/50 rounded-xl hover:border-slate-600/50 
                                         hover:bg-slate-800/30 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Explore Other AI Builders
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex items-center justify-center gap-12 text-slate-500">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>AI-Powered Analysis</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Production Ready</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Personalized Config</span>
                    </div>
                </div>

                {/* Feature preview */}
                <div className="mt-20 text-center">
                    <p className="text-slate-500 text-sm mb-6">What happens next?</p>
                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                            <div className="text-2xl mb-2">🧠</div>
                            <h3 className="font-medium text-white mb-1">AI Analysis</h3>
                            <p className="text-xs text-slate-500">Analyze your tech stack compatibility</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                            <div className="text-2xl mb-2">⚙️</div>
                            <h3 className="font-medium text-white mb-1">Smart Recommendations</h3>
                            <p className="text-xs text-slate-500">Get personalized CI/CD tool suggestions</p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                            <div className="text-2xl mb-2">📦</div>
                            <h3 className="font-medium text-white mb-1">Ready-to-Use Configs</h3>
                            <p className="text-xs text-slate-500">Download production-ready pipeline files</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
