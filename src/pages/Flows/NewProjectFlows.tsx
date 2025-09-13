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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            {/* Back button */}
            <div className="relative p-6">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors duration-200"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Try Our Other Features
                </button>
            </div>
            
            <div className="relative max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        New Project Setup
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        Build infrastructure for a new project
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {step === 1 
                            ? "Tell us what you want to build and we'll suggest the perfect tech stack" 
                            : "Choose your preferred technologies and deployment options"
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                            Project Type
                        </div>
                        <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
                            Tech Stack
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-8">
                        {/* Project Type Selection */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4">What do you want to build?</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projectTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`group cursor-pointer relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                                            selectedType === type.id
                                                ? 'border-primary/50 shadow-lg shadow-primary/10'
                                                : 'border-border/50 hover:border-border'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{type.icon}</div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-foreground mb-1">{type.label}</h3>
                                                <p className="text-sm text-muted-foreground">{type.description}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                selectedType === type.id 
                                                    ? 'border-primary bg-primary' 
                                                    : 'border-border'
                                            }`}>
                                                {selectedType === type.id && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Description for "Other" */}
                        {selectedType === 'other' && (
                            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                                <label className="block text-lg font-semibold text-foreground mb-3">
                                    Describe your project idea
                                </label>
                                <textarea
                                    value={customDescription}
                                    onChange={(e) => setCustomDescription(e.target.value)}
                                    placeholder="Tell us about your project - what it does, who it's for, key features you want..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-background/80 border border-border rounded-xl 
                                             focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                             transition-all duration-200 resize-none"
                                />
                            </div>
                        )}

                        {selectedType && selectedType !== 'other' && (
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">
                                        {projectTypes.find(t => t.id === selectedType)?.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {projectTypes.find(t => t.id === selectedType)?.label}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
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
                            <div key={category} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4 capitalize">
                                    {category === 'deployment' ? 'Deployment Platform' : `${category} Technology`}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {technologies.map((tech) => (
                                        <button
                                            key={tech}
                                            onClick={() => toggleTech(category, tech)}
                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                selectedTech[category]?.includes(tech)
                                                    ? 'bg-primary text-white shadow-sm'
                                                    : 'bg-background border border-border hover:border-primary/50 text-foreground'
                                            }`}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Additional Information */}
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
                            <label className="block text-lg font-semibold text-foreground mb-3">
                                Any specific requirements or preferences?
                            </label>
                            <textarea
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                placeholder="e.g., 'Need real-time features', 'Must handle high traffic', 'Budget-friendly options', 'Easy to maintain'..."
                                rows={3}
                                className="w-full px-4 py-3 bg-background/80 border border-border rounded-xl 
                                         focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                         transition-all duration-200 resize-none"
                            />
                        </div>

                        {/* Selected Tech Summary */}
                        {Object.keys(selectedTech).length > 0 && (
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <h3 className="font-semibold text-foreground mb-3">Selected Technologies:</h3>
                                <div className="space-y-2">
                                    {Object.entries(selectedTech).map(([category, techs]) => (
                                        <div key={category} className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-medium text-muted-foreground capitalize min-w-20">
                                                {category}:
                                            </span>
                                            {techs.map(tech => (
                                                <span key={tech} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-4 mt-12">
                    <div className="flex gap-4">
                        {step === 2 && (
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-foreground border border-border/50 rounded-xl 
                                         hover:border-border hover:bg-muted/30 transition-all duration-200
                                         flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}

                        <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className="group relative px-12 py-4 bg-gradient-to-r from-primary to-primary/80 
                                     text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                     hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                     active:scale-[0.98] transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                {step === 1 ? 'Choose Tech Stack' : 'Get AI Recommendations'}
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        {step === 1 
                            ? `Selected: ${selectedType ? projectTypes.find(t => t.id === selectedType)?.label : 'None'}`
                            : `${Object.values(selectedTech).flat().length} technologies selected`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
