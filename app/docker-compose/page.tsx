"use client";
import { useState } from "react";

interface Service {
  name: string;
  image: string;
  ports: string;
  env: string;
  volumes: string;
  restart: string;
}

const presets: Record<string, Service[]> = {
  "node-mongo": [
    { name: "app", image: "node:20-alpine", ports: "3000:3000", env: "NODE_ENV=production\nMONGO_URL=mongodb://mongo:27017/mydb", volumes: "./:/app", restart: "unless-stopped" },
    { name: "mongo", image: "mongo:7", ports: "27017:27017", env: "MONGO_INITDB_ROOT_USERNAME=admin\nMONGO_INITDB_ROOT_PASSWORD=password", volumes: "mongo-data:/data/db", restart: "unless-stopped" },
  ],
  "node-postgres": [
    { name: "app", image: "node:20-alpine", ports: "3000:3000", env: "NODE_ENV=production\nDATABASE_URL=postgres://user:pass@db:5432/mydb", volumes: "./:/app", restart: "unless-stopped" },
    { name: "db", image: "postgres:16-alpine", ports: "5432:5432", env: "POSTGRES_USER=user\nPOSTGRES_PASSWORD=pass\nPOSTGRES_DB=mydb", volumes: "pg-data:/var/lib/postgresql/data", restart: "unless-stopped" },
  ],
  "wordpress": [
    { name: "wordpress", image: "wordpress:latest", ports: "8080:80", env: "WORDPRESS_DB_HOST=db\nWORDPRESS_DB_USER=wp\nWORDPRESS_DB_PASSWORD=secret\nWORDPRESS_DB_NAME=wordpress", volumes: "wp-data:/var/www/html", restart: "unless-stopped" },
    { name: "db", image: "mysql:8", ports: "", env: "MYSQL_DATABASE=wordpress\nMYSQL_USER=wp\nMYSQL_PASSWORD=secret\nMYSQL_ROOT_PASSWORD=rootsecret", volumes: "db-data:/var/lib/mysql", restart: "unless-stopped" },
  ],
  "nginx-node": [
    { name: "nginx", image: "nginx:alpine", ports: "80:80\n443:443", env: "", volumes: "./nginx.conf:/etc/nginx/nginx.conf\n./ssl:/etc/ssl", restart: "unless-stopped" },
    { name: "app", image: "node:20-alpine", ports: "", env: "NODE_ENV=production", volumes: "./:/app", restart: "unless-stopped" },
  ],
};

export default function DockerCompose() {
  const [services, setServices] = useState<Service[]>(presets["node-mongo"]);
  const [version, setVersion] = useState("3.8");
  const [copied, setCopied] = useState(false);

  const addService = () => setServices([...services, { name: "service", image: "alpine:latest", ports: "", env: "", volumes: "", restart: "unless-stopped" }]);
  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));
  const updateService = (i: number, field: keyof Service, value: string) => {
    const copy = [...services];
    copy[i][field] = value;
    setServices(copy);
  };

  const generate = (): string => {
    const lines = [`version: "${version}"`, "", "services:"];

    services.forEach((svc) => {
      lines.push(`  ${svc.name}:`);
      lines.push(`    image: ${svc.image}`);
      if (svc.restart) lines.push(`    restart: ${svc.restart}`);
      if (svc.ports.trim()) {
        lines.push("    ports:");
        svc.ports.split("\n").filter(Boolean).forEach((p) => lines.push(`      - "${p.trim()}"`));
      }
      if (svc.env.trim()) {
        lines.push("    environment:");
        svc.env.split("\n").filter(Boolean).forEach((e) => lines.push(`      - ${e.trim()}`));
      }
      if (svc.volumes.trim()) {
        lines.push("    volumes:");
        svc.volumes.split("\n").filter(Boolean).forEach((v) => lines.push(`      - ${v.trim()}`));
      }
      lines.push("");
    });

    // Detect named volumes
    const namedVolumes = new Set<string>();
    services.forEach((svc) => {
      svc.volumes.split("\n").filter(Boolean).forEach((v) => {
        const name = v.split(":")[0].trim();
        if (name && !name.startsWith(".") && !name.startsWith("/")) namedVolumes.add(name);
      });
    });

    if (namedVolumes.size > 0) {
      lines.push("volumes:");
      namedVolumes.forEach((v) => lines.push(`  ${v}:`));
    }

    return lines.join("\n");
  };

  const output = generate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Docker Compose Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate docker-compose.yml files visually. Presets for common stacks. Free Docker Compose config generator.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(presets).map(([k]) => (
          <button key={k} onClick={() => setServices([...presets[k]])} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white capitalize">{k.replace("-", " + ")}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {services.map((svc, i) => (
            <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <input value={svc.name} onChange={(e) => updateService(i, "name", e.target.value)} className="bg-transparent text-white font-bold text-sm outline-none" />
                {services.length > 1 && <button onClick={() => removeService(i)} className="text-xs text-red-400">Remove</button>}
              </div>
              <input value={svc.image} onChange={(e) => updateService(i, "image", e.target.value)} placeholder="Image" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" />
              <input value={svc.ports} onChange={(e) => updateService(i, "ports", e.target.value)} placeholder="Ports (e.g. 3000:3000)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" />
              <textarea value={svc.env} onChange={(e) => updateService(i, "env", e.target.value)} placeholder="Environment vars (one per line)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono h-14 resize-none" />
              <input value={svc.volumes} onChange={(e) => updateService(i, "volumes", e.target.value)} placeholder="Volumes" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-white text-xs font-mono" />
            </div>
          ))}
          <button onClick={addService} className="text-sm text-purple-400 hover:text-purple-300">+ Add Service</button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">docker-compose.yml</label>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400 overflow-auto max-h-[500px] whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
