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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        AI Project Analysis
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        Tell us about your project
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {step === 1 
                            ? "Describe your idea in plain English and our AI will help you build the perfect tech stack"
                            : "Help us understand your project better with these quick questions"
                        }
                    </p>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                            Describe
                        </div>
                        <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
                            Clarify
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-8">
                        {/* Main Description Input */}
                        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
                            <label className="block text-xl font-semibold text-foreground mb-4">
                                What do you want to build or automate?
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your project idea, business problem, or automation need in your own words..."
                                rows={6}
                                className="w-full px-4 py-4 bg-background/80 border border-border rounded-xl 
                                         focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                         transition-all duration-200 resize-none text-lg"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <span className={`text-sm ${description.length < 10 ? 'text-muted-foreground' : 'text-green-600'}`}>
                                    {description.length < 10 
                                        ? `${10 - description.length} more characters needed`
                                        : "Looking good! ✓"
                                    }
                                </span>
                                <span className="text-xs text-muted-foreground">{description.length}/1000</span>
                            </div>
                        </div>

                        {/* Example Prompts */}
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Need inspiration? Try these examples:
                            </h2>
                            <div className="grid md:grid-cols-2 gap-3">
                                {examplePrompts.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleExampleClick(example)}
                                        className={`p-4 text-left rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                                            selectedExample === example
                                                ? 'border-primary/50 bg-primary/5 shadow-sm'
                                                : 'border-border/50 bg-card/30 hover:border-border'
                                        }`}
                                    >
                                        <p className="text-sm text-foreground">{example}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Suggestions */}
                        <div>
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Or pick a category to get started:
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedCategories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-xl border border-border/50 bg-card/30 hover:border-border 
                                                 transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                                        onClick={() => setDescription(`I want to build something in the ${category.label.toLowerCase()} space. `)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">{category.icon}</span>
                                            <h3 className="font-medium text-foreground">{category.label}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{category.examples}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {description.length > 50 && (
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        Great description! Our AI will analyze this and ask clarifying questions to recommend the best tech stack.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        {/* Show original description */}
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                            <h3 className="font-semibold text-foreground mb-2">Your Project:</h3>
                            <p className="text-sm text-muted-foreground italic">"{description}"</p>
                        </div>

                        {/* Clarifying questions */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground">Help us understand better:</h2>
                            {clarifyingQuestions.map((question, index) => (
                                <div key={index} className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl p-6">
                                    <label className="block text-lg font-medium text-foreground mb-3">
                                        {index + 1}. {question}
                                    </label>
                                    <textarea
                                        value={answers[question] || ''}
                                        onChange={(e) => updateAnswer(question, e.target.value)}
                                        placeholder="Your answer..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-background/80 border border-border rounded-lg 
                                                 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                                                 transition-all duration-200 resize-none"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${(Object.values(answers).filter(a => a.trim()).length / clarifyingQuestions.length) * 100}%` 
                                    }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {Object.values(answers).filter(a => a.trim()).length}/{clarifyingQuestions.length} answered
                            </span>
                        </div>
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
                            onClick={step === 1 ? handleAnalyze : handleContinue}
                            disabled={!canContinue || isAnalyzing}
                            className="group relative px-12 py-4 bg-gradient-to-r from-primary to-primary/80 
                                     text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                     hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                     active:scale-[0.98] transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <span className="relative flex items-center justify-center gap-2">
                                {isAnalyzing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Analyzing Project...
                                    </>
                                ) : step === 1 ? (
                                    <>
                                        Analyze & Continue
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        Get AI Recommendations
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        {step === 1 
                            ? description.length > 0 ? "Ready to analyze your project idea" : "Describe your project to get started"
                            : `${Object.values(answers).filter(a => a.trim()).length} of ${clarifyingQuestions.length} questions answered`
                        }
                    </p>
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
