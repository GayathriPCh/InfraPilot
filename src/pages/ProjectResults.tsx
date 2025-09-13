/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateProjectBlueprint } from "@/utils/groq";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ProjectResults() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [askingQuestion, setAskingQuestion] = useState(false);

    useEffect(() => {
        if (!state) return;
        (async () => {
            setLoading(true);
            const res = await generateProjectBlueprint(state);
            setResult(res);
            setLoading(false);
        })();
    }, [state]);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;
        
        setAskingQuestion(true);
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
                        content: `You are helping a user understand their project blueprint. Selected components: ${state?.selectedComponents?.join(", ")}. Project type: ${state?.originalInput?.selectedType}. Keep answers practical and use markdown formatting.` 
                    },
                    { role: "user", content: question }
                ]
            });

            setAnswer(completion.choices[0]?.message?.content || "Sorry, I couldn't understand that question.");
            setQuestion("");
        } catch (error) {
            setAnswer("Sorry, there was an error processing your question. Please try again.");
        } finally {
            setAskingQuestion(false);
        }
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
                    <h2 className="text-xl font-semibold text-foreground mb-2">Creating Your Project Blueprint</h2>
                    <p className="text-muted-foreground">Generating comprehensive setup guide and implementation plan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            <div className="relative max-w-4xl mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Project Blueprint</h1>
                        <p className="text-muted-foreground">
                            Complete setup guide for: {state?.originalInput?.selectedType && 
                            state.originalInput.selectedType !== 'other' ? 
                            state.originalInput.selectedType.replace(/([A-Z])/g, ' $1').trim() : 
                            'your custom project'}
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/flow/new-project')}
                        className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-lg 
                                 shadow-lg hover:shadow-primary/25 hover:shadow-xl transition-all duration-300 
                                 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="relative z-10">✨ Create Another Project</span>
                    </button>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                    <ReactMarkdown
                        components={{
                            h1: ({children}) => <h1 className="text-2xl font-bold text-foreground mb-4 mt-8 first:mt-0">{children}</h1>,
                            h2: ({children}) => <h2 className="text-xl font-semibold text-foreground mb-3 mt-6 first:mt-0">{children}</h2>,
                            h3: ({children}) => <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{children}</h3>,
                            p: ({children}) => <p className="text-foreground mb-4 leading-relaxed">{children}</p>,
                            ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                            li: ({children}) => <li className="text-foreground">{children}</li>,
                            code: ({node, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const language = match ? match[1] : '';
                                const isInline = !className;

                                return !isInline ? (
                                    <div className="my-4">
                                        <SyntaxHighlighter
                                            style={oneDark as any}
                                            language={language || 'bash'}
                                            className="rounded-lg"
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            blockquote: ({children}) => (
                                <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r">
                                    {children}
                                </blockquote>
                            ),
                            strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>
                        }}
                    >
                        {result}
                    </ReactMarkdown>
                </div>

                {/* Question box */}
                <div className="mt-8 p-6 border border-border rounded-lg bg-card shadow-sm">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        Questions about your project setup?
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="e.g., How do I start development? What's the best deployment strategy?"
                                className="flex-1 px-4 py-3 border border-border rounded-lg bg-background 
                                         focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                            />
                            <button
                                onClick={handleAskQuestion}
                                disabled={askingQuestion || !question.trim()}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 
                                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                                         flex items-center gap-2"
                            >
                                {askingQuestion ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Asking...
                                    </>
                                ) : (
                                    <>
                                        <span>💡</span>
                                        Ask
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {answer && (
                            <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown
                                        components={{
                                            p: ({children}) => <p className="text-foreground mb-3 text-sm leading-relaxed">{children}</p>,
                                            ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                                            li: ({children}) => <li className="text-foreground text-sm">{children}</li>,
                                            code: ({children, ...props}) => (
                                                <code className="bg-background px-2 py-1 rounded text-xs font-mono text-foreground" {...props}>
                                                    {children}
                                                </code>
                                            ),
                                            strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>
                                        }}
                                    >
                                        {answer}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Next Steps</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Set up your development environment</li>
                        <li>• Initialize your project with the recommended structure</li>
                        <li>• Configure your chosen deployment platform</li>
                        <li>• Start with the MVP features and iterate</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
