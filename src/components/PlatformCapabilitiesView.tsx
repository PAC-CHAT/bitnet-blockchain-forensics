import React, { useState } from 'react';
import { Layers, FolderTree, CheckCircle2, Box, Search, X } from 'lucide-react';

interface PlatformCapabilitiesViewProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const PlatformCapabilitiesView: React.FC<PlatformCapabilitiesViewProps> = ({
  searchQuery = '',
  onClearSearch,
}) => {
  const [selectedCap, setSelectedCap] = useState<number>(0);

  const capabilities = [
    {
      title: 'Unlimited number of apps',
      status: 'Architected',
      description: 'Tenancy isolation, workspace lifecycle management, and dynamic execution environments.',
      modules: [
        { layer: 'core/', role: 'Define application tenancy and entity contracts' },
        { layer: 'pipeline/', role: 'Implement application provisioning and lifecycle orchestrators' },
        { layer: 'api/', role: 'FastAPI / React endpoints for multi-app management' },
        { layer: 'cli/', role: 'Typer CLI commands for platform provisioning' },
      ],
      sampleContract: `interface AppTenant {\n  id: string;\n  name: string;\n  ownerId: string;\n  status: 'active' | 'archived';\n  allocatedShards: number;\n}`,
    },
    {
      title: 'In-app code edits',
      status: 'Architected',
      description: 'Interactive code modification, AST validation, and model-assisted patching workflows.',
      modules: [
        { layer: 'pipeline/', role: 'Patch orchestrator and staging services' },
        { layer: 'inference/', role: 'Model-assisted edit suggestions and syntax verification' },
        { layer: 'data/', role: 'Shared patch and event schema records' },
      ],
      sampleContract: `interface CodePatch {\n  file: string;\n  patchDiff: string;\n  author: 'investigator' | 'copilot';\n  checksum: string;\n}`,
    },
    {
      title: 'Backend functions',
      status: 'Architected',
      description: 'Typed serverless execution contracts, background scheduling, and telemetry.',
      modules: [
        { layer: 'core/', role: 'Backend function contracts and typed interfaces' },
        { layer: 'pipeline/', role: 'Runtime execution adapters and scheduling queues' },
        { layer: 'utils/', role: 'Observability, structured logging, and metrics' },
      ],
      sampleContract: `interface BackendFunction {\n  functionName: string;\n  trigger: 'http' | 'event' | 'cron';\n  timeoutMs: number;\n  memoryMb: number;\n}`,
    },
    {
      title: 'Connect a domain',
      status: 'Architected',
      description: 'Custom domain mapping, DNS challenge verification, and automated SSL/TLS provisioning.',
      modules: [
        { layer: 'config/', role: 'Domain verification and routing definitions' },
        { layer: 'pipeline/', role: 'DNS challenge and certificate lifecycle automation' },
        { layer: 'api/', role: 'Setup and validation status endpoints' },
      ],
      sampleContract: `interface DomainConfig {\n  hostname: string;\n  cnameTarget: string;\n  tlsStatus: 'pending' | 'provisioned';\n}`,
    },
    {
      title: 'GitHub integration',
      status: 'Architected',
      description: 'Repository synchronization, webhook event ingestion, and automated CI/CD coordination.',
      modules: [
        { layer: 'models/', role: 'Provider adapters and integration wrappers' },
        { layer: 'data/', role: 'Webhook and event normalization schemas' },
        { layer: 'cli/', role: 'Repository linking and sync operations' },
      ],
      sampleContract: `interface GitHubRepoBinding {\n  repoFullName: string;\n  webhookSecret: string;\n  syncBranch: string;\n  autoDeploy: boolean;\n}`,
    },
  ];

  const query = searchQuery.trim().toLowerCase();
  const filteredCapabilities = capabilities.filter((cap) => {
    if (!query) return true;
    return (
      cap.title.toLowerCase().includes(query) ||
      cap.description.toLowerCase().includes(query) ||
      cap.sampleContract.toLowerCase().includes(query) ||
      cap.modules.some(
        (m) => m.layer.toLowerCase().includes(query) || m.role.toLowerCase().includes(query)
      )
    );
  });

  const activeIndex = Math.min(selectedCap, Math.max(0, filteredCapabilities.length - 1));
  const current = filteredCapabilities[activeIndex] || capabilities[0];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
          <Layers className="w-4 h-4" />
          <span>ARCHITECTURE SPECIFICATION • docs/platform_capabilities.md</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Capabilities Architecture</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Visual interactive representation of the five requested platform capabilities mapped into the modular source-layout architecture.
        </p>

        {/* Global Search Active Banner */}
        {query && (
          <div className="mt-4 bg-cyan-950/40 border border-cyan-800/80 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs text-cyan-300 shadow-lg shadow-cyan-950/50">
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Active Filter: &ldquo;<strong className="text-white font-mono">{searchQuery}</strong>&rdquo; &bull;{' '}
                {filteredCapabilities.length} of {capabilities.length} capabilities matched
              </span>
            </div>
            {onClearSearch && (
              <button
                onClick={onClearSearch}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 transition-colors font-mono"
              >
                <X className="w-3 h-3" />
                <span>Clear Filter</span>
              </button>
            )}
          </div>
        )}

        {/* Tab Selector */}
        {filteredCapabilities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
            {filteredCapabilities.map((cap, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCap(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeIndex === idx
                    ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-white truncate">{cap.title}</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Mapped</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 py-8 text-center text-slate-500 text-xs">
            <p>No capabilities match &ldquo;{searchQuery}&rdquo;</p>
            {onClearSearch && (
              <button onClick={onClearSearch} className="mt-2 text-cyan-400 underline font-mono">
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selected Capability Details */}
      {current && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Box className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">{current.title}</h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">{current.description}</p>

            <h3 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-3">
              Source-Layout Package Allocations:
            </h3>
            <div className="space-y-3">
              {current.modules.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                    {m.layer}
                  </span>
                  <span className="text-xs text-slate-300">{m.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FolderTree className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Interface Contract Schema</h3>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {current.sampleContract}
              </pre>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Governance: AGENTS.md</span>
              <span>BitNet v2.0 Platform Layer</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
