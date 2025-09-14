import { useNavigate } from "react-router-dom";
import { useState } from "react";

const projectTypes = [
    { id: 'fullstack', label: 'Full-Stack Web App', icon: '🌐', description: 'Frontend + Backend + Database' },
    { id: 'api', label: 'Backend API', icon: '🔧', description: 'REST API or GraphQL service' },
    { id: 'frontend', label: 'Frontend App', icon: '💻', description: 'React, Vue, or static website' },
    { id: 'mobile', label: 'Mobile App Backend', icon: '📱', description: 'API for iOS/Android apps' },
    { id: 'ecommerce', label: 'E-commerce Platform', icon: '🛒', description: 'Online store with payments' },
    { id: 'blog', label: 'Blog/CMS', icon: '📝', description: 'Content management system' },
    { id: 'saas', label: 'SaaS Application', icon: '☁️', description: 'Multi-tenant software service' },
    { id: 'other', label: 'Something Else', icon: '🎯', description: 'Tell us what you want to build' }
];

const techStacks = {
    frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Vanilla JS'],
    backend: ['Node.js', 'Python (Django/FastAPI)', 'Java (Spring)', 'Go', 'PHP (Laravel)', 'Ruby on Rails', '.NET'],
    database: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Redis', 'Firebase'],
    deployment: ['Vercel', 'Netlify', 'AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Heroku', 'Docker']
};

export default function NewProjectFlow() {
    const [selectedType, setSelectedType] = useState('');
    const [customDescription, setCustomDescription] = useState('');
    const [selectedTech, setSelectedTech] = useState<Record<string, string[]>>({});
    const [deploymentPlan, setDeploymentPlan] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const toggleTech = (category: string, tech: string) => {
        setSelectedTech(prev => ({
            ...prev,
            [category]: prev[category]?.includes(tech) 
                ? prev[category].filter(t => t !== tech)
                : [...(prev[category] || []), tech]
        }));
    };

    const handleContinue = () => {
        if (step === 1 && selectedType) {
            setStep(2);
        } else if (step === 2) {
            navigate("/project-recommendations", {
                state: { 
                    selectedType, 
                    customDescription, 
                    selectedTech, 
                    deploymentPlan, 
                    additionalInfo 
                }
            });
        }
    };

    const canContinue = (step === 1 && selectedType) || 
        (step === 2 && (Object.keys(selectedTech).length > 0 || selectedType === 'other'));

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
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
            
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></div>
                        </div>
                        New Project Setup
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            {step === 1 ? "Build infrastructure for" : "Choose your perfect"}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                            {step === 1 ? "a new project" : "tech stack"}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {step === 1 
                            ? "Tell us what you want to build and we'll suggest the perfect tech stack and deployment strategy" 
                            : "Select your preferred technologies and deployment options for optimal performance"
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' : 'bg-slate-800/50 text-slate-400'
                        }`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                            Project Type
                        </div>
                        <div className={`w-12 h-0.5 transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-slate-700'}`} />
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' : 'bg-slate-800/50 text-slate-400'
                        }`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
                            Tech Stack
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-8">
                        {/* Project Type Selection */}
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                What do you want to build?
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projectTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`group cursor-pointer relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                                            selectedType === type.id
                                                ? 'border-purple-500/50 shadow-lg shadow-purple-500/20 bg-purple-500/10'
                                                : 'border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{type.label}</h3>
                                                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{type.description}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                                selectedType === type.id 
                                                    ? 'border-purple-400 bg-purple-500 shadow-lg shadow-purple-500/25' 
                                                    : 'border-slate-600 group-hover:border-slate-500'
                                            }`}>
                                                {selectedType === type.id && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Description for "Other" */}
                        {selectedType === 'other' && (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                                    <label className="block text-lg font-semibold text-white mb-4 items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                                            <span className="text-lg">💭</span>
                                        </div>
                                        Describe your project idea
                                    </label>
                                    <textarea
                                        value={customDescription}
                                        onChange={(e) => setCustomDescription(e.target.value)}
                                        placeholder="Tell us about your project - what it does, who it's for, key features you want..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                                 text-white placeholder:text-slate-500
                                                 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 
                                                 hover:border-slate-600/50 transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedType && selectedType !== 'other' && (
                            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">
                                        {projectTypes.find(t => t.id === selectedType)?.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">
                                            {projectTypes.find(t => t.id === selectedType)?.label}
                                        </h3>
                                        <p className="text-sm text-purple-200">
                                            Great choice! We'll recommend the best tech stack for this type of project.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        {/* Tech Stack Selection */}
                        {Object.entries(techStacks).map(([category, technologies]) => (
                            <div key={category} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3 capitalize">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                                            <span className="text-sm">
                                                {category === 'frontend' ? '🎨' : 
                                                 category === 'backend' ? '⚙️' : 
                                                 category === 'database' ? '🗃️' : '🚀'}
                                            </span>
                                        </div>
                                        {category === 'deployment' ? 'Deployment Platform' : `${category} Technology`}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {technologies.map((tech) => (
                                            <button
                                                key={tech}
                                                onClick={() => toggleTech(category, tech)}
                                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                    selectedTech[category]?.includes(tech)
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                                        : 'bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 text-white hover:bg-slate-700/50'
                                                }`}
                                            >
                                                {tech}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Additional Information */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                                <label className="block text-lg font-semibold text-white mb-4 items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center">
                                        <span className="text-lg">📋</span>
                                    </div>
                                    Any specific requirements or preferences?
                                </label>
                                <textarea
                                    value={additionalInfo}
                                    onChange={(e) => setAdditionalInfo(e.target.value)}
                                    placeholder="e.g., 'Need real-time features', 'Must handle high traffic', 'Budget-friendly options', 'Easy to maintain'..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                             text-white placeholder:text-slate-500
                                             focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 
                                             hover:border-slate-600/50 transition-all duration-200 resize-none"
                                />
                            </div>
                        </div>

                        {/* Selected Tech Summary */}
                        {Object.keys(selectedTech).length > 0 && (
                            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-sm">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <span className="text-lg">✨</span>
                                    Selected Technologies:
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(selectedTech).map(([category, techs]) => (
                                        <div key={category} className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm font-medium text-purple-200 capitalize min-w-24">
                                                {category}:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {techs.map(tech => (
                                                    <span key={tech} className="px-3 py-1 bg-purple-500/20 text-purple-100 rounded-lg text-sm font-medium border border-purple-500/30">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-6 mt-16">
                    <div className="flex gap-4">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="group px-6 py-3 text-slate-300 hover:text-white 
                                         border border-slate-700/50 rounded-xl hover:border-slate-600/50 
                                         hover:bg-slate-800/30 transition-all duration-200
                                         flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 
                                     hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl 
                                     shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40
                                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                     disabled:shadow-none"
                        >
                            <span className="relative flex items-center justify-center gap-3">
                                <span className="text-lg">{step === 1 ? '⚡' : '🚀'}</span>
                                {step === 1 ? 'Choose Tech Stack' : 'Get AI Recommendations'}
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center max-w-md">
                        {step === 1 
                            ? `Selected: ${selectedType ? projectTypes.find(t => t.id === selectedType)?.label : 'Choose a project type to continue'}`
                            : `${Object.values(selectedTech).flat().length} technologies selected across ${Object.keys(selectedTech).length} categories`
                        }
                    </p>
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
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Best Practices</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Production Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
