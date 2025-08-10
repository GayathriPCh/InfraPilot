import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import FlowCanvas from "@/components/builder/FlowCanvas";
import { toast } from "@/hooks/use-toast";
import YAML from "js-yaml";
import JSZip from "jszip";

const AVAILABLE = ["node", "postgres", "redis", "nginx"] as const;
type Service = typeof AVAILABLE[number];

export default function Builder() {
  const [selected, setSelected] = useState<Record<Service, boolean>>({
    node: true,
    postgres: true,
    redis: false,
    nginx: false,
  } as Record<Service, boolean>);

  function toggle(s: Service) {
    setSelected((prev) => ({ ...prev, [s]: !prev[s] }));
  }

  async function generateZip() {
    const compose = buildCompose(selected);
    const zip = new JSZip();
    zip.file("docker-compose.yml", compose);

    if (selected.nginx) {
      zip.file(
        "nginx/nginx.conf",
        `events {}
http {
  server {
    listen 80;
    location / {
      proxy_pass http://node:3000;
    }
  }
}`
      );
    }

    if (selected.postgres) {
      zip.file("db/init.sql", "-- initialization SQL here\n");
    }

    zip.file(
      "README.md",
      `# InfraPilot export\n\nRun:\n\n\n\n`
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "infrapilot.zip";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export ready", description: "Downloaded infrapilot.zip" });
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>InfraPilot Builder — Visual infra canvas</title>
        <meta
          name="description"
          content="Drag-drop services, connect components, and generate Docker/K8s/CI/CD files."
        />
        <link rel="canonical" href="/builder" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          InfraPilot
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <a href="/">Home</a>
          </Button>
          <Button variant="hero" onClick={generateZip}>Generate ZIP</Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_320px] gap-6 pb-16">
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <FlowCanvas selected={selected} />
        </div>
        <aside className="rounded-lg border border-border bg-card p-4 h-fit sticky top-4">
          <h2 className="font-semibold mb-3">Services</h2>
          <div className="space-y-3">
            {AVAILABLE.map((s) => (
              <label key={s} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected[s]}
                  onChange={() => toggle(s)}
                />
                <span className="capitalize">{s}</span>
              </label>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="hero" className="w-full" onClick={generateZip}>
              Generate setup
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}



function buildCompose(selected: Record<Service, boolean>) {
  const services: any = {};
  const volumes: any = {};

  if (selected.postgres) {
    services.postgres = {
      image: "postgres:16-alpine",
      ports: ["5432:5432"],
      environment: {
        POSTGRES_USER: "user",
        POSTGRES_PASSWORD: "password",
        POSTGRES_DB: "mydb",
      },
      volumes: ["db-data:/var/lib/postgresql/data"],
    };
    volumes["db-data"] = {};
  }

  if (selected.redis) {
    services.redis = {
      image: "redis:7-alpine",
      ports: ["6379:6379"],
    };
  }

  if (selected.node) {
    services.node = {
      image: "node:18-alpine",
      working_dir: "/app",
      command: "node server.js",
      environment: {
        PORT: 3000,
        DB_HOST: selected.postgres ? "postgres" : undefined,
        REDIS_HOST: selected.redis ? "redis" : undefined,
      },
      ports: ["3000:3000"],
      depends_on: [
        ...(selected.postgres ? ["postgres"] : []),
        ...(selected.redis ? ["redis"] : []),
      ],
    };
  }

  if (selected.nginx) {
    services.nginx = {
      image: "nginx:alpine",
      ports: ["80:80"],
      volumes: ["./nginx/nginx.conf:/etc/nginx/nginx.conf:ro"],
      depends_on: selected.node ? ["node"] : [],
    };
  }

  const compose = {
    version: "3.9",
    services,
    ...(Object.keys(volumes).length ? { volumes } : {}),
  };

  return YAML.dump(compose, { lineWidth: 120 });
}
