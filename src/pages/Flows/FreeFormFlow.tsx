import { useNavigate } from "react-router-dom";
import { useState } from "react";

const examplePrompts = [
    "I want to build a food delivery app like Uber Eats but for my local area",
    "Create a platform where freelancers can showcase their work and get hired",
    "Build an inventory management system for my small retail business",
    "I need a booking system for my yoga studio with payments and scheduling",
    "Want to create a social network for pet owners in my city",
    "Build a tool to automate my company's invoice generation and tracking",
    "Create a learning platform for coding tutorials with interactive exercises",
    "I want to digitize my family recipe collection and share with relatives"
];

const suggestedCategories = [
    { icon: '🏪', label: 'Business/Commerce', examples: 'E-commerce, booking systems, CRM' },
    { icon: '🤝', label: 'Social/Community', examples: 'Forums, social networks, collaboration' },
    { icon: '⚡', label: 'Automation/Tools', examples: 'Workflow automation, data processing' },
    { icon: '📚', label: 'Education/Learning', examples: 'Online courses, skill tracking' },
    { icon: '💼', label: 'Professional Services', examples: 'Portfolio sites, service platforms' },
    { icon: '🎮', label: 'Entertainment/Media', examples: 'Content platforms, games, apps' }
];

export default function FreeformFlow() {
    const [description, setDescription] = useState("");
    const [selectedExample, setSelectedExample] = useState("");
    const [step, setStep] = useState(1);
    const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const navigate = useNavigate();

    const handleExampleClick = (example: string) => {
        setDescription(example);
        setSelectedExample(example);
    };

    const handleAnalyze = async () => {
        if (!description.trim()) return;

        setIsAnalyzing(true);
        try {
            // Get AI to generate clarifying questions
            const questions = await generateClarifyingQuestions(description);
            setClarifyingQuestions(questions);
            setStep(2);
        } catch (error) {
            console.error("Error analyzing description:", error);
            // Fallback - go directly to recommendations
            navigate("/freeform-recommendations", {
                state: { 
                    description, 
                    clarifyingAnswers: {} 
                }
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleContinue = () => {
        navigate("/freeform-recommendations", {
            state: { 
                description, 
                clarifyingAnswers: answers 
            }
        });
    };

    const updateAnswer = (question: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [question]: answer
        }));
    };

    const canContinue = step === 1 ? description.trim().length > 10 : 
        clarifyingQuestions.every(q => answers[q]?.trim());

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></div>
                        </div>
                        AI Project Analysis
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            {step === 1 ? "Tell us about your" : "Help us understand"}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
                            {step === 1 ? "project idea" : "your project better"}
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {step === 1 
                            ? "Describe your idea in plain English and our AI will help you build the perfect tech stack"
                            : "Help us understand your project better with these quick questions"
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            step >= 1 ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/25' : 'bg-slate-800/50 text-slate-400'
                        }`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                            Describe
                        </div>
                        <div className={`w-12 h-0.5 transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-slate-700'}`} />
                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            step >= 2 ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/25' : 'bg-slate-800/50 text-slate-400'
                        }`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
                            Clarify
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-8">
                        {/* Main Description Input */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                                <label className="block text-xl font-semibold text-white mb-4 items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center">
                                        <span className="text-lg">💡</span>
                                    </div>
                                    What do you want to build or automate?
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your project idea, business problem, or automation need in your own words..."
                                    rows={6}
                                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                                             text-white placeholder:text-slate-500 text-lg
                                             focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 
                                             hover:border-slate-600/50 transition-all duration-200 resize-none"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`text-sm font-medium ${description.length < 10 ? 'text-slate-400' : 'text-green-400'}`}>
                                        {description.length < 10 
                                            ? `${10 - description.length} more characters needed`
                                            : "Looking good! ✓"
                                        }
                                    </span>
                                    <span className="text-xs text-slate-500">{description.length}/1000</span>
                                </div>
                            </div>
                        </div>

                        {/* Example Prompts */}
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                <span className="text-xl">💭</span>
                                Need inspiration? Try these examples:
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {examplePrompts.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleExampleClick(example)}
                                        className={`group p-4 text-left rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                                            selectedExample === example
                                                ? 'border-orange-500/50 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                                                : 'border-slate-800/50 bg-slate-900/30 hover:border-slate-700/50 hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <p className="text-sm text-white group-hover:text-orange-300 transition-colors">{example}</p>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Suggestions */}
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                                <span className="text-xl">🎯</span>
                                Or pick a category to get started:
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedCategories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="group p-5 rounded-xl border border-slate-800/50 bg-slate-900/30 hover:border-slate-700/50 hover:bg-slate-800/50 
                                                 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                                        onClick={() => setDescription(`I want to build something in the ${category.label.toLowerCase()} space. `)}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                                            <h3 className="font-medium text-white group-hover:text-orange-300 transition-colors">{category.label}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{category.examples}</p>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {description.length > 50 && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <p className="text-sm text-green-300 font-medium">
                                        Great description! Our AI will analyze this and ask clarifying questions to recommend the best tech stack.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        {/* Show original description */}
                        <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="text-lg">📝</span>
                                Your Project:
                            </h3>
                            <p className="text-sm text-slate-300 italic leading-relaxed">"{description}"</p>
                        </div>

                        {/* Clarifying questions */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                                <span className="text-2xl">🤔</span>
                                Help us understand better:
                            </h2>
                            {clarifyingQuestions.map((question, index) => (
                                <div key={index} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6">
                                        <label className="block text-lg font-medium text-white mb-4 items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            </div>
                                            {question}
                                        </label>
                                        <textarea
                                            value={answers[question] || ''}
                                            onChange={(e) => updateAnswer(question, e.target.value)}
                                            placeholder="Your answer..."
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg 
                                                     text-white placeholder:text-slate-500
                                                     focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                                                     hover:border-slate-600/50 transition-all duration-200 resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-slate-400">
                                <span>Question Progress</span>
                                <span>{Object.values(answers).filter(a => a.trim()).length}/{clarifyingQuestions.length} answered</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ 
                                        width: `${(Object.values(answers).filter(a => a.trim()).length / clarifyingQuestions.length) * 100}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
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
                                <svg className="w-4 h-4 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}

                        <button
                            onClick={step === 1 ? handleAnalyze : handleContinue}
                            disabled={!canContinue || isAnalyzing}
                            className="group relative px-12 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 
                                     hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl 
                                     shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40
                                     hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                     disabled:shadow-none"
                        >
                            <span className="relative flex items-center justify-center gap-3">
                                {isAnalyzing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Analyzing Project...
                                    </>
                                ) : step === 1 ? (
                                    <>
                                        <span className="text-lg">🧠</span>
                                        Analyze & Continue
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg">🚀</span>
                                        Get AI Recommendations
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    <p className="text-xs text-slate-500 text-center max-w-md">
                        {step === 1 
                            ? description.length > 0 ? "Ready to analyze your project idea with AI" : "Describe your project to get started"
                            : `${Object.values(answers).filter(a => a.trim()).length} of ${clarifyingQuestions.length} questions completed`
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
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Smart Recommendations</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Personalized Stack</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to generate clarifying questions
async function generateClarifyingQuestions(description: string): Promise<string[]> {
    try {
        const groq = new (await import("groq-sdk")).default({
            apiKey: import.meta.env.VITE_GROQ_API_KEY,
            dangerouslyAllowBrowser: true
        });

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: "You are a technical consultant. Generate 3-4 clarifying questions to better understand a project description. Return only a JSON array of question strings."
                },
                { 
                    role: "user", 
                    content: `Project description: "${description}"\n\nGenerate clarifying questions about target users, scale, key features, technical requirements, timeline, or budget. Return as JSON array.`
                }
            ]
        });

        const rawContent = completion.choices[0]?.message?.content || "[]";
        const cleanJson = rawContent.replace(/``````/g, '').trim();
        const questions = JSON.parse(cleanJson);
        
        return Array.isArray(questions) ? questions : [
            "Who are your target users?",
            "How many users do you expect?",
            "What are the most important features?",
            "Any specific technical requirements?"
        ];
    } catch (error) {
        console.error("Error generating questions:", error);
        return [
            "Who are your target users and what problem does this solve for them?",
            "How many users do you expect to have initially and at scale?",
            "What are the 3 most important features for your first version?",
            "Do you have any technical preferences or constraints?"
        ];
    }
}
