import React, { useState, useEffect } from 'react';
import { FileCode2, Copy, Check, Download, RefreshCw, Send, CheckCircle2, Search, X } from 'lucide-react';
import { generateMarkdownDocsList } from '../services/forensics';

interface ApiDocsGeneratorViewProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const ApiDocsGeneratorView: React.FC<ApiDocsGeneratorViewProps> = ({ 
  searchQuery = '', 
  onClearSearch 
}) => {
  const [docsText, setDocsText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/sales/metrics');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);

  const allEndpoints = [
    { label: 'GET /health', path: '/health', method: 'GET', name: 'health' },
    { label: 'GET /api/sales/metrics', path: '/api/sales/metrics', method: 'GET', name: 'api_sales_metrics' },
    { label: 'GET /api/news/scrape', path: '/api/news/scrape?url=https://example.com', method: 'GET', name: 'api_news_scrape' },
    { label: 'POST /api/security/review', path: '/api/security/review', method: 'POST', name: 'api_security_review' },
    { label: 'GET /api/docs/markdown', path: '/api/docs/markdown', method: 'GET', name: 'api_docs_markdown' },
    { label: 'GET /ui/news-scraper', path: '/ui/news-scraper', method: 'GET', name: 'news_scraper_ui' },
    { label: 'GET /ui/sales-dashboard', path: '/ui/sales-dashboard', method: 'GET', name: 'sales_dashboard_ui' },
    { label: 'GET /ui/security-review', path: '/ui/security-review', method: 'GET', name: 'security_review_ui' },
    { label: 'GET /ui/api-docs-generator', path: '/ui/api-docs-generator', method: 'GET', name: 'api_docs_generator_ui' },
  ];

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/docs/markdown');
      if (res.ok) {
        const text = await res.text();
        setDocsText(text);
      } else {
        setDocsText(generateMarkdownDocsList());
      }
    } catch {
      setDocsText(generateMarkdownDocsList());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const query = searchQuery.trim().toLowerCase();

  // Filter markdown text lines
  const displayDocsText = React.useMemo(() => {
    if (!docsText) return '';
    if (!query) return docsText;
    const lines = docsText.split('\n');
    const headerLines = lines.slice(0, 4); // table headers
    const matchedRows = lines.slice(4).filter((line) => line.toLowerCase().includes(query));
    if (matchedRows.length === 0) {
      return `${headerLines.join('\n')}\n| (No routes match query "${searchQuery}") | | | |\n\nFiltered 0 routes matching "${searchQuery}"`;
    }
    return `${headerLines.join('\n')}\n${matchedRows.join('\n')}\n\nFiltered matching routes for "${searchQuery}"`;
  }, [docsText, query, searchQuery]);

  const filteredEndpoints = allEndpoints.filter((item) => {
    if (!query) return true;
    return (
      item.label.toLowerCase().includes(query) ||
      item.path.toLowerCase().includes(query) ||
      item.name.toLowerCase().includes(query) ||
      item.method.toLowerCase().includes(query)
    );
  });

  const copyDocs = () => {
    navigator.clipboard.writeText(displayDocsText || docsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([displayDocsText || docsText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BitNet_API_Documentation.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const executeLiveTest = async (path: string) => {
    setTestEndpoint(path);
    setTestLoading(true);
    try {
      let res;
      if (path === '/api/security/review') {
        res = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: 'POST http://api.internal/test with password=admin' }),
        });
      } else {
        res = await fetch(path);
      }
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setTestResponse(JSON.stringify(json, null, 2));
      } catch {
        setTestResponse(text);
      }
    } catch (e: unknown) {
      setTestResponse(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Component Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <FileCode2 className="w-4 h-4" />
              <span>PRODUCTION UI MODULE • /ui/api-docs-generator</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">API Documentation Generator</h1>
            <p className="text-sm text-slate-400 mt-1">
              Exports Markdown formatted route schemas backed by{' '}
              <code className="text-cyan-300 font-mono">/api/docs/markdown</code>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadDocs}
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-md shadow-cyan-600/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Route Table</span>
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
                {filteredEndpoints.length} of {allEndpoints.length} registered routes matched
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
      </div>

      {/* Docs Output Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">Generated Markdown Output</h2>
            {docsText && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            )}
          </div>

          {docsText && (
            <div className="flex items-center space-x-2">
              <button
                onClick={copyDocs}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={downloadMarkdown}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            </div>
          )}
        </div>

        {displayDocsText ? (
          <pre
            id="docs"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner"
          >
            {displayDocsText}
          </pre>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">
            <FileCode2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>Click &ldquo;Refresh Route Table&rdquo; above to load the registered API route table.</p>
          </div>
        )}
      </div>

      {/* Live Endpoint Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-white">Live Route Tester</h2>
          {query && (
            <span className="text-xs font-mono text-cyan-400">
              {filteredEndpoints.length} matching endpoints
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Directly ping endpoints on the active server to test responses.
        </p>

        {filteredEndpoints.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {filteredEndpoints.map((item) => (
              <button
                key={item.path}
                onClick={() => executeLiveTest(item.path)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono flex items-center space-x-1.5"
              >
                <Send className="w-3 h-3 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-xs py-3 font-mono">
            No live test endpoints match &ldquo;{searchQuery}&rdquo;.
          </div>
        )}

        {testResponse && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <span>Response for {testEndpoint}:</span>
              {testLoading && <span className="text-cyan-400 animate-pulse">Requesting...</span>}
            </div>
            <pre className="text-emerald-400 overflow-x-auto max-h-60 whitespace-pre-wrap">{testResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
