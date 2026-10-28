import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Play, 
  Copy, 
  Check, 
  Code,
  Search,
  X
} from 'lucide-react';
import { reviewText } from '../services/forensics';
import type { SecurityFinding, SeverityLevel } from '../types/forensics';

interface SecurityReviewViewProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const SecurityReviewView: React.FC<SecurityReviewViewProps> = ({ 
  searchQuery = '', 
  onClearSearch 
}) => {
  const [content, setContent] = useState<string>(
    'POST http://api.internal/v1/login includes password=example'
  );
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    {
      label: 'Default Heuristic Test',
      value: 'POST http://api.internal/v1/login includes password=example',
    },
    {
      label: 'Wildcard CORS & Secret Token',
      value: 'app.use(cors({ origin: "*" }));\nconst secret_key = "sk_live_9941a8";',
    },
    {
      label: 'Clean Production API (Passing)',
      value: 'POST https://api.bitnet.org/v2/transactions\nHeaders: Authorization: Bearer [REDACTED]\nCORS: https://app.bitnet.org',
    },
    {
      label: 'Mixed Vulnerabilities',
      value: 'GET http://backup.db/dump?password=root&cors=*',
    },
  ];

  const runReview = async (customContent = content) => {
    setLoading(true);
    try {
      const res = await fetch('/api/security/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: customContent }),
      });
      if (res.ok) {
        const data = await res.json();
        setFindings(data.findings);
      } else {
        setFindings(reviewText(customContent));
      }
    } catch {
      setFindings(reviewText(customContent));
    } finally {
      setHasReviewed(true);
      setLoading(false);
    }
  };

  // Run initial scan on mount so findings exist to filter
  useEffect(() => {
    runReview('POST http://api.internal/v1/login includes password=example');
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredFindings = findings.filter((f) => {
    if (!query) return true;
    return (
      f.summary.toLowerCase().includes(query) ||
      f.recommendation.toLowerCase().includes(query) ||
      f.severity.toLowerCase().includes(query)
    );
  });

  const copyResults = () => {
    const text = filteredFindings
      .map((f) => `${f.severity.toUpperCase()}: ${f.summary} => ${f.recommendation}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-950 border border-rose-800 text-rose-300 font-mono text-xs font-bold uppercase">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>CRITICAL</span>
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-orange-950 border border-orange-800 text-orange-300 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span>HIGH</span>
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-950 border border-amber-800 text-amber-300 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>MEDIUM</span>
          </span>
        );
      case 'info':
      default:
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-950 border border-blue-800 text-blue-300 font-mono text-xs font-bold uppercase">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>INFO</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Component Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>PRODUCTION UI MODULE • /ui/security-review</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Review Tool</h1>
            <p className="text-sm text-slate-400 mt-1">
              Static heuristic analyzer evaluating API payloads, credentials disclosure, and CORS configurations backed by{' '}
              <code className="text-cyan-300 font-mono">/api/security/review</code>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? 'Hide JSON' : 'View Payload Schema'}</span>
            </button>
          </div>
        </div>

        {/* Global Search Active Banner */}
        {query && (
          <div className="mt-4 bg-cyan-950/40 border border-cyan-800/80 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs text-cyan-300 shadow-lg shadow-cyan-950/50">
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Active Filter: &ldquo;<strong className="text-white font-mono">{searchQuery}</strong>&rdquo; &bull;{' '}
                {filteredFindings.length} of {findings.length} findings matched
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

        {/* Presets */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono mr-1">Sample Snippets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setContent(p.value);
                runReview(p.value);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Textarea matching #content from /ui/security-review */}
        <div className="mt-4">
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            placeholder="Enter route definitions, HTTP requests, or security policy snippets..."
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Max characters: 12,000</span>
          <button
            onClick={() => runReview(content)}
            disabled={loading || !content.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-md shadow-cyan-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Reviewing...' : 'Review'}</span>
          </button>
        </div>

        {/* JSON Payload View */}
        {showJson && (
          <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="text-slate-400 mb-2 font-semibold">POST /api/security/review:</div>
            <pre className="text-rose-400 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify({ findings: filteredFindings }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Findings Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">Review Findings</h2>
            {filteredFindings.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {filteredFindings.length} {query ? `of ${findings.length}` : ''} flagged
              </span>
            )}
          </div>

          {filteredFindings.length > 0 && (
            <button
              onClick={copyResults}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          )}
        </div>

        {filteredFindings.length > 0 ? (
          <ul id="findings" className="space-y-3">
            {filteredFindings.map((f, index) => (
              <li
                key={index}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(f.severity)}
                    <span className="text-sm font-semibold text-slate-100">{f.summary}</span>
                  </div>
                  <div className="text-xs text-slate-400 pl-1">
                    <span className="text-slate-500 font-semibold">Recommendation: </span>
                    <span className="text-slate-300">{f.recommendation}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500 self-end sm:self-start bg-slate-900 px-2 py-1 rounded">
                  RULE-{index + 1}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">
            {hasReviewed || findings.length > 0 ? (
              <div className="flex flex-col items-center">
                {query ? (
                  <>
                    <p>No findings matched &ldquo;{searchQuery}&rdquo;</p>
                    {onClearSearch && (
                      <button onClick={onClearSearch} className="mt-2 text-cyan-400 underline font-mono text-xs">
                        Clear search filter
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                    <p>No findings recorded.</p>
                  </>
                )}
              </div>
            ) : (
              <div>
                <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>Click &ldquo;Review&rdquo; to execute the security heuristic evaluation on the text above.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
