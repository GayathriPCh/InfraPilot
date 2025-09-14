import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const chips = [
  { 
    label: "Add CI/CD to my existing project", 
    path: "/flow/add-cicd",
    icon: "🚀",
    description: "Boost your existing codebase with smart CI/CD pipelines"
  },
  { 
    label: "Create a Docker Compose for my services", 
    path: "/flow/docker-compose",
    icon: "🐳",
    description: "Container orchestration made simple and intelligent"
  },
  { 
    label: "Build infra for a new project", 
    path: "/flow/new-project",
    icon: "⚡",
    description: "Complete tech stack recommendations from scratch"
  },
  { 
    label: "Not sure? Tell us about your project", 
    path: "/flow/freeform",
    icon: "🤖",
    description: "AI-powered project analysis from natural language"
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>InfraPilot — The Agentic Infrastructure Builder</title>
        <meta
          name="description"
          content="AI-powered infrastructure design. From idea to deployment in minutes. Generate Docker Compose, CI/CD, and complete tech stacks with intelligent recommendations."
        />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "InfraPilot",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            description: "AI-powered infrastructure builder for modern developers.",
          })}
        </script>
      </Helmet>

      {/* Animated background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

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
          
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#examples" className="hover:text-white transition-colors">Examples</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-white border-slate-700 hover:border-slate-600"
              onClick={() => navigate('/builder')}
            >
              Visual Builder
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/25"
              onClick={() => navigate('/flow/freeform')}
            >
              Try AI Builder →
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10" onMouseMove={handleMouseMove}>
        {/* Hero Section - Warp-inspired */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-slate-300">AI-powered infrastructure builder</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  The Agentic
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Infrastructure Builder
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                From idea to deployment in minutes. AI analyzes your project, recommends the perfect tech stack, 
                and generates production-ready configs.
              </p>

              {/* AI Flow Chips - Enhanced */}
              <div className="mb-12">
                <p className="text-sm text-slate-500 mb-6 uppercase tracking-wider font-medium">
                  Choose your starting point
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {chips.map((chip, index) => (
                    <div
                      key={chip.path}
                      onClick={() => navigate(chip.path)}
                      className={`group relative p-6 rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {chip.icon}
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                            {chip.label}
                          </h3>
                          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                            {chip.description}
                          </p>
                        </div>
                        <svg 
                          className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-2xl shadow-indigo-500/25 px-8 py-4 text-lg"
                  onClick={() => navigate('/flow/freeform')}
                >
                  Start Building with AI
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-8 py-4 text-lg"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See it in action
                </Button>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500" />
        </section>

        {/* Features Section - Warp style */}
        <section id="features" className="relative py-24 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Intelligence meets Infrastructure
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powered by advanced AI that understands your project context and generates production-ready infrastructure.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🧠",
                  title: "AI Project Analysis",
                  description: "Natural language processing understands your project requirements and suggests optimal tech stacks.",
                  features: ["Context-aware recommendations", "Multi-modal input support", "Intelligent questioning"]
                },
                {
                  icon: "⚡",
                  title: "Instant Code Generation",
                  description: "From Docker Compose to CI/CD pipelines, get production-ready configs in seconds.",
                  features: ["Docker orchestration", "CI/CD automation", "Infrastructure as Code"]
                },
                {
                  icon: "🎯",
                  title: "Smart Customization",
                  description: "Fine-tune every recommendation with intelligent defaults and expert-level configurations.",
                  features: ["Environment-specific configs", "Security best practices", "Scalability planning"]
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group relative p-8 rounded-2xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/30 transition-all duration-300"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works - Terminal-like */}
        <section id="how-it-works" className="relative py-24 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  From idea to infrastructure
                </span>
              </h2>
              <p className="text-xl text-slate-400">
                Watch InfraPilot transform your project description into production-ready infrastructure
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Terminal mockup */}
              <div className="relative">
                <div className="rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/50">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500 ml-4">InfraPilot AI</span>
                  </div>
                  <div className="p-6 font-mono text-sm">
                    <div className="mb-4">
                      <span className="text-indigo-400">→</span>
                      <span className="text-slate-300 ml-2">Describe your project idea...</span>
                    </div>
                    <div className="mb-4 text-slate-400">
                      "I want to build a food delivery app like Uber Eats but for my local area"
                    </div>
                    <div className="mb-4">
                      <span className="text-purple-400">🤖</span>
                      <span className="text-slate-300 ml-2">Analyzing project requirements...</span>
                    </div>
                    <div className="mb-4 text-green-400">
                      ✓ E-commerce platform detected<br />
                      ✓ Mobile-first approach recommended<br />
                      ✓ Payment integration required<br />
                      ✓ Real-time tracking needed
                    </div>
                    <div className="text-indigo-400">
                      Generated: React Native + Node.js + PostgreSQL + Stripe + Docker
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Describe Your Vision",
                    description: "Tell us about your project in plain English. Our AI understands context, scale, and requirements."
                  },
                  {
                    step: "02", 
                    title: "AI Analysis & Questions",
                    description: "Get intelligent follow-up questions that help refine the perfect tech stack for your needs."
                  },
                  {
                    step: "03",
                    title: "Smart Recommendations", 
                    description: "Review AI-curated technology choices with explanations for why each tool fits your project."
                  },
                  {
                    step: "04",
                    title: "Generate & Deploy",
                    description: "Get production-ready configs, step-by-step guides, and deployment instructions."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-mono text-sm font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section id="examples" className="relative py-24 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Built for every project
                </span>
              </h2>
              <p className="text-xl text-slate-400">
                From simple websites to complex distributed systems
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "🛒", title: "E-commerce Platform", tech: "Next.js • Stripe • PostgreSQL" },
                { icon: "📱", title: "Mobile App Backend", tech: "Node.js • MongoDB • Redis" },
                { icon: "🤖", title: "AI/ML Pipeline", tech: "Python • Docker • Kubernetes" },
                { icon: "📊", title: "Analytics Dashboard", tech: "React • ClickHouse • Grafana" },
                { icon: "🎮", title: "Gaming Platform", tech: "Go • WebSockets • Redis" },
                { icon: "💰", title: "Fintech App", tech: "Java • Spring • PostgreSQL" }
              ].map((example, index) => (
                <div key={index} className="group p-6 rounded-xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/30 transition-all duration-300">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {example.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{example.title}</h3>
                  <p className="text-sm text-slate-500">{example.tech}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Ready to build something amazing?
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Join thousands of developers who've shipped faster with AI-powered infrastructure generation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 shadow-2xl shadow-indigo-500/25 px-12 py-6 text-xl"
                onClick={() => navigate('/flow/freeform')}
              >
                Start Building Now
              </Button>
              <Button 
                variant="ghost"
                size="lg" 
                className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 px-8 py-6 text-lg"
                onClick={() => navigate('/builder')}
              >
                Try Visual Builder
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-bold">IP</span>
              </div>
              <span className="text-slate-400">
                © {new Date().getFullYear()} InfraPilot — Build with intelligence.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
