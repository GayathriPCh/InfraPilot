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
        { id: 'backend', label: 'Backend Framework', value: backend, setter: setBackend, placeholder: 'Node.js, Python FastAPI, Django, Spring Boot...' },
        { id: 'frontend', label: 'Frontend Framework', value: frontend, setter: setFrontend, placeholder: 'React, Angular, Vue, Next.js...' },
        { id: 'db', label: 'Database', value: db, setter: setDb, placeholder: 'PostgreSQL, MongoDB, MySQL, Redis...' },
        { id: 'scm', label: 'Source Code Hosting', value: scm, setter: setScm, placeholder: 'GitHub, GitLab, Bitbucket...' },
        { id: 'buildToolsTests', label: 'Build Tools & Testing', value: buildToolsTests, setter: setBuildToolsTests, placeholder: 'Maven, npm, Gradle, JUnit, pytest...' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            {/* Back to home button */}
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
            
            <div className="relative max-w-2xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        CI/CD Setup
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        Add CI/CD to your existing project
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Tell us about your current tech stack and we'll recommend the perfect CI/CD tools for you
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl shadow-black/5 p-8">
                    <div className="space-y-6">
                        {inputFields.map((field, index) => (
                            <div key={field.id} className="space-y-2">
                                <label htmlFor={field.id} className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                        {index + 1}
                                    </span>
                                    {field.label}
                                </label>
                                <div className="relative">
                                    <input
                                        id={field.id}
                                        type="text"
                                        value={field.value}
                                        onChange={e => field.setter(e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full px-4 py-4 bg-background/80 border border-border rounded-xl 
                                                 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                                 transition-all duration-200 placeholder:text-muted-foreground/70
                                                 hover:bg-background focus:bg-background"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-col items-center gap-6">
                        <button
                            onClick={handleSubmit}
                            className="group relative w-full max-w-sm px-8 py-4 bg-gradient-to-r from-primary to-primary/80 
                                     text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                     hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                     active:scale-[0.98] transition-all duration-200
                                     before:absolute before:inset-0 before:rounded-xl 
                                     before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                                     before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                Continue to Recommendations
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </button>

                        {/* Secondary action - back to other features */}
                        <button
                            onClick={() => navigate('/')}
                            className="group px-6 py-3 text-muted-foreground hover:text-foreground 
                                     border border-border/50 rounded-xl hover:border-border 
                                     hover:bg-muted/30 transition-all duration-200
                                     flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Try Our Other Features
                        </button>
                        
                        <p className="text-xs text-muted-foreground text-center">
                            We'll analyze your stack and suggest the best CI/CD tools
                        </p>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-8 flex items-center justify-center gap-8 text-muted-foreground">
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        AI-Powered
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Secure
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Personalized
                    </div>
                </div>
            </div>
        </div>
    );
}
