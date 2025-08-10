import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const chips = [
  "Add CI/CD to my existing project",
  "Create a Docker Compose for my services",
  "Build infra for a new project",
  "Not sure? Tell us about your project",
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>InfraPilot — Design, visualize & export infra</title>
        <meta
          name="description"
          content="InfraPilot lets you design, visualize, and export infrastructure like a pro. Drag-drop services, map connections, and generate Docker/K8s/CI/CD."
        />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "InfraPilot",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            description:
              "Visual infrastructure designer with code generation for Docker, Kubernetes, and CI/CD.",
          })}
        </script>
      </Helmet>

      <header className="w-full">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            InfraPilot
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#export" className="hover:text-foreground">Export</a>
          </nav>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/builder')}>Open Builder</Button>
            <Button variant="hero" size="xl" onClick={() => navigate('/builder')}>Start Building</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          {/* Signature gradient field */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(800px 400px at var(--x,50%) var(--y,30%), hsl(var(--accent) / 0.12), transparent 60%)",
            }}
          />

          <div
            className="max-w-6xl mx-auto px-6 py-24"
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              (e.currentTarget.parentElement as HTMLElement)?.style.setProperty('--x', `${x}%`);
              (e.currentTarget.parentElement as HTMLElement)?.style.setProperty('--y', `${y}%`);
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Design, visualize, and export infrastructure like a pro.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Drag-drop services, map connections, and generate Docker Compose, Kubernetes, and CI/CD files — all in your browser.
            </p>

            <div className="mt-8 flex flex-wrap gap-3" role="list">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => navigate('/builder')}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-sm"
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <Button variant="hero" size="xl" onClick={() => navigate('/builder')}>
                Get started — it’s free
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('#features')}>
                Learn more
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Visual Infra Builder',
              desc: 'Drag services, connect dependencies, configure ports and envs with helpful defaults.',
            },
            {
              title: 'Service Communication Map',
              desc: 'Arrows with ports and protocols, hover for data flow insights.',
            },
            {
              title: 'Infra Code Generator',
              desc: 'Generate Docker Compose, Kubernetes manifests, and CI/CD pipelines.',
            },
          ].map(({ title, desc }) => (
            <article key={title} className="rounded-lg border border-border p-6 bg-card">
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </article>
          ))}
        </section>

        <section id="export" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-xl border border-border p-8 bg-card">
            <h2 className="text-2xl font-semibold mb-3">Full export as ZIP</h2>
            <p className="text-muted-foreground">Preview files, then download a ready-to-run project bundle.</p>
            <div className="mt-6">
              <Button variant="hero" onClick={() => navigate('/builder')}>Try the Builder</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} InfraPilot — Build with confidence.
        </div>
      </footer>
    </div>
  );
};

export default Index;
