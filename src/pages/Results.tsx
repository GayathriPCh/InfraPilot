// Results.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPipelineOverview } from "@/utils/groq";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Results() {
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
            const res = await getPipelineOverview(state.selected, state.usages);
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
                        content: `You are helping a user understand their CI/CD pipeline. Their tools: ${state?.selected?.join(", ")}. Keep answers short, practical, and use markdown formatting for better readability.` 
                    },
                    { role: "user", content: question }
                ]
            });

            setAnswer(completion.choices[0]?.message?.content || "Sorry, I couldn't understand that question.");
            setQuestion(""); // Clear the question after asking
        } catch (error) {
            setAnswer("Sorry, there was an error processing your question. Please try again.");
        } finally {
            setAskingQuestion(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-muted-foreground">Generating your pipeline...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header with glowing back button */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Your CI/CD Pipeline</h1>
                    <p className="text-muted-foreground">
                        Generated for: {state?.selected?.join(", ") || "your selected tools"}
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/flow/add-cicd')}
                    className="group relative px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-medium rounded-lg 
                             shadow-lg hover:shadow-primary/25 hover:shadow-xl transition-all duration-300 
                             hover:scale-[1.02] active:scale-[0.98]
                             before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r 
                             before:from-primary/20 before:to-primary/10 before:opacity-0 
                             hover:before:opacity-100 before:transition-opacity before:duration-300"
                >
                    <span className="relative z-10">✨ Generate Another Setup</span>
                </button>
            </div>

            {/* Pipeline content */}
            <div className="prose prose-lg max-w-none">
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
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        style={oneDark as any}
                                        language={language || 'text'}
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
                    <span className="text-xl">💡</span>
                    Got questions about this pipeline?
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., How do I set this up? What does this step do?"
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
                                    <span>🚀</span>
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
                                        h1: ({children}) => <h1 className="text-lg font-semibold text-foreground mb-3">{children}</h1>,
                                        h2: ({children}) => <h2 className="text-base font-medium text-foreground mb-2">{children}</h2>,
                                        h3: ({children}) => <h3 className="text-sm font-medium text-foreground mb-2">{children}</h3>,
                                        
                                        p: ({children}) => <p className="text-foreground mb-3 text-sm leading-relaxed">{children}</p>,
                                        
                                        ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                                        ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                                        li: ({children}) => <li className="text-foreground text-sm">{children}</li>,
                                        
                                        code: ({node, className, children, ...props}) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const language = match ? match[1] : '';
                                            const isInline = !className;

                                            return !isInline ? (
                                                <div className="my-3">
                                                    <SyntaxHighlighter
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        style={oneDark as any}
                                                        language={language || 'text'}
                                                        className="rounded text-xs"
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <code className="bg-background px-2 py-1 rounded text-xs font-mono text-foreground" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        
                                        blockquote: ({children}) => (
                                            <blockquote className="border-l-3 border-primary/50 pl-3 py-1 my-3 bg-background/50 rounded-r">
                                                {children}
                                            </blockquote>
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

            {/* What's Next section */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Copy the configuration files to your project</li>
                    <li>• Customize the settings for your specific needs</li>
                    <li>• Test the pipeline with a small change</li>
                    <li>• Monitor and iterate based on your workflow</li>
                </ul>
            </div>
        </div>
    );
}
