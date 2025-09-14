/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { generateFreeformImplementation } from "@/utils/groq";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function FreeformResults() {
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
            const res = await generateFreeformImplementation(state);
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
                        content: `You are helping a user implement their project. Original idea: "${state?.originalDescription}". Selected components: ${state?.selectedComponents?.join(", ")}. Keep answers practical and use markdown formatting.` 
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
            <div className="min-h-screen bg-black text-white overflow-hidden">
                {/* Animated background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                    <div className="absolute top-1/4 right-20 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                            <div className="relative">
                                {/* Implementation plan icon */}
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center animate-pulse">
                                    <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-xl blur animate-pulse opacity-75"></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent mb-4">
                            Creating Your Implementation Plan
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">Generating comprehensive guide tailored to your specific project...</p>
                        
                        {/* Enhanced loading progress */}
                        <div className="w-80 mx-auto space-y-3">
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full animate-pulse" style={{ width: '90%' }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                                <svg className="w-4 h-4 animate-spin text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Crafting detailed implementation steps...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-bold">IP</span>
                        </div>
                        <div className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            InfraPilot
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/flow/freeform')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Analyze Another Idea
                        </span>
                    </button>
                </div>
            </header>
            
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></div>
                        </div>
                        Implementation Plan Ready
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Your Custom
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                            Implementation Plan
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Tailored specifically for: <span className="text-violet-400 font-medium">{state?.analysis?.project_type || 'your project'}</span>
                    </p>
                </div>

                {/* Original Project Summary */}
                <div className="mb-12 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/30 flex items-center justify-center">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            Your Original Idea
                        </h3>
                        <p className="text-slate-300 italic leading-relaxed">"{state?.originalDescription}"</p>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="relative group mb-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                        <div className="prose prose-lg max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-6 mt-8 first:mt-0 flex items-center gap-3">
                                        <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {children}
                                    </h1>,
                                    h2: ({children}) => <h2 className="text-xl font-semibold text-white mb-4 mt-8 first:mt-0 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        {children}
                                    </h2>,
                                    h3: ({children}) => <h3 className="text-lg font-medium text-white mb-3 mt-6 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        {children}
                                    </h3>,
                                    p: ({children}) => <p className="text-slate-300 mb-4 leading-relaxed text-lg">{children}</p>,
                                    ul: ({children}) => <ul className="list-none pl-0 mb-6 space-y-3">{children}</ul>,
                                    ol: ({children}) => <ol className="list-none pl-0 mb-6 space-y-3">{children}</ol>,
                                    li: ({children}) => <li className="text-slate-300 flex items-start gap-3">
                                        <svg className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>{children}</span>
                                    </li>,
                                    code: ({node, className, children, ...props}) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const language = match ? match[1] : '';
                                        const isInline = !className;

                                        return !isInline ? (
                                            <div className="my-6 group">
                                                <div className="relative">
                                                    <SyntaxHighlighter
                                                        style={oneDark as any}
                                                        language={language || 'bash'}
                                                        className="rounded-xl !bg-slate-950/80 border border-slate-800/50"
                                                        customStyle={{
                                                            padding: '1.5rem',
                                                            fontSize: '0.875rem',
                                                            lineHeight: '1.5'
                                                        }}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(String(children))}
                                                        className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                        title="Copy to clipboard"
                                                    >
                                                        <svg className="w-4 h-4 text-slate-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <code className="bg-slate-800/50 px-2 py-1 rounded-md text-sm font-mono text-violet-300 border border-slate-700/30" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    blockquote: ({children}) => (
                                        <blockquote className="border-l-4 border-violet-500 pl-6 py-4 my-6 bg-violet-500/5 rounded-r-lg backdrop-blur-sm">
                                            <div className="text-slate-300">
                                                {children}
                                            </div>
                                        </blockquote>
                                    ),
                                    strong: ({children}) => <strong className="font-semibold text-violet-300">{children}</strong>
                                }}
                            >
                                {result}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Enhanced Q&A Section */}
                <div className="relative group mb-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Ask anything about implementing your idea
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g., How do I handle user authentication? What's the best way to scale this?"
                                    className="flex-1 px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 
                                             focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-slate-600/50 transition-all duration-200"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                                />
                                <button
                                    onClick={handleAskQuestion}
                                    disabled={askingQuestion || !question.trim()}
                                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 
                                             text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed 
                                             transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/25"
                                >
                                    {askingQuestion ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Thinking...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            Ask AI
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            {answer && (
                                <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <span className="text-cyan-300 font-medium">AI Assistant</span>
                                    </div>
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                p: ({children}) => <p className="text-slate-300 mb-3 text-sm leading-relaxed">{children}</p>,
                                                ul: ({children}) => <ul className="list-none pl-0 mb-3 space-y-2">{children}</ul>,
                                                li: ({children}) => <li className="text-slate-300 text-sm flex items-start gap-2">
                                                    <svg className="w-3 h-3 text-cyan-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{children}</span>
                                                </li>,
                                                code: ({children, ...props}) => (
                                                    <code className="bg-slate-900/50 px-2 py-1 rounded text-xs font-mono text-cyan-300 border border-slate-700/30" {...props}>
                                                        {children}
                                                    </code>
                                                ),
                                                strong: ({children}) => <strong className="font-semibold text-cyan-300">{children}</strong>
                                            }}
                                        >
                                            {answer}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Implementation Steps */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Ready to Build?
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { 
                                    step: "1", 
                                    title: "Follow Implementation Phases", 
                                    desc: "Follow the phases in the exact order provided for optimal results",
                                    icon: "M9 5l7 7-7 7"
                                },
                                { 
                                    step: "2", 
                                    title: "Start with MVP", 
                                    desc: "Begin with core features and minimum viable product approach",
                                    icon: "M13 10V3L4 14h7v7l9-11h-7z"
                                },
                                { 
                                    step: "3", 
                                    title: "Test Each Component", 
                                    desc: "Validate functionality at every step before moving forward",
                                    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                },
                                { 
                                    step: "4", 
                                    title: "Iterate Based on Feedback", 
                                    desc: "Collect user feedback and continuously improve your solution",
                                    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex items-center justify-center gap-12 text-slate-500">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Custom Built</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>AI Optimized</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Step-by-Step</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
