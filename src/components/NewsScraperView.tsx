import React, { useState, useEffect } from 'react';
import { Newspaper, Search, ExternalLink, Globe, RefreshCw, Code, X } from 'lucide-react';
import { scrapeNewsArticles } from '../services/forensics';
import type { NewsArticle } from '../types/forensics';

interface NewsScraperViewProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const NewsScraperView: React.FC<NewsScraperViewProps> = ({ 
  searchQuery = '', 
  onClearSearch 
}) => {
  const [url, setUrl] = useState<string>('https://example.com');
  const [loading, setLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [hasScraped, setHasScraped] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);

  const presets = [
    { label: 'Example.com (Default)', url: 'https://example.com' },
    { label: 'CoinDesk Forensics', url: 'https://coindesk.com/policy/forensics' },
    { label: 'Decrypt Regulatory', url: 'https://decrypt.co/news' },
    { label: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com' },
    { label: 'Blockworks Research', url: 'https://blockworks.co/news' },
  ];

  const runScrape = async (targetUrl = url) => {
    if (!targetUrl) return;
    setLoading(true);
    try {
      const results = await scrapeNewsArticles(targetUrl);
      setArticles(results);
      setHasScraped(true);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Populate initial dataset on mount so search works immediately
  useEffect(() => {
    runScrape('https://example.com');
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredArticles = articles.filter((article) => {
    if (!query) return true;
    return (
      article.title.toLowerCase().includes(query) ||
      article.source_url.toLowerCase().includes(query) ||
      (article.summary && article.summary.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Component Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <Newspaper className="w-4 h-4" />
              <span>PRODUCTION UI MODULE • /ui/news-scraper</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">News Scraper UI</h1>
            <p className="text-sm text-slate-400 mt-1">
              Extracts headline tags and deduplicated intelligence articles from target URLs backed by{' '}
              <code className="text-cyan-300 font-mono">/api/news/scrape</code>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? 'Hide JSON' : 'View API Response'}</span>
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <button
            id="scrape-btn"
            onClick={() => runScrape()}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-md shadow-cyan-600/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scraping...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scrape</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono mr-1">Sample Sources:</span>
          {presets.map((preset) => (
            <button
              key={preset.url}
              onClick={() => {
                setUrl(preset.url);
                runScrape(preset.url);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Search Active Banner */}
      {query && (
        <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs text-cyan-300 shadow-lg shadow-cyan-950/50">
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Active Filter: &ldquo;<strong className="text-white font-mono">{searchQuery}</strong>&rdquo; &bull;{' '}
              {filteredArticles.length} of {articles.length} headlines matched
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

      {/* JSON Payload View */}
      {showJson && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
          <div className="text-slate-400 mb-2 font-semibold">GET /api/news/scrape?url={encodeURIComponent(url)}:</div>
          <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify({ articles: filteredArticles.map((a) => ({ title: a.title, source_url: a.source_url })) }, null, 2)}
          </pre>
        </div>
      )}

      {/* Results List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Extracted Headlines</span>
            {filteredArticles.length > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {filteredArticles.length} {query ? `of ${articles.length}` : ''} items
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-500 font-mono">HTML Tag Parser (title, h1, h2, h3)</span>
        </div>

        {filteredArticles.length > 0 ? (
          <ul id="results" className="space-y-3">
            {filteredArticles.map((article, index) => (
              <li
                key={index}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  {article.summary && (
                    <p className="text-xs text-slate-400 pl-7">{article.summary}</p>
                  )}
                  <div className="text-[11px] text-slate-500 font-mono pl-7 flex items-center space-x-2">
                    <span>Source: {article.source_url}</span>
                    {article.published_at && <span>• {article.published_at}</span>}
                  </div>
                </div>

                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">
            {hasScraped || articles.length > 0 ? (
              <div>
                <p>No headlines matched &ldquo;{searchQuery}&rdquo;</p>
                {onClearSearch && (
                  <button onClick={onClearSearch} className="mt-2 text-cyan-400 underline text-xs font-mono">
                    Clear search filter
                  </button>
                )}
              </div>
            ) : (
              <div>
                <Newspaper className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>Enter a URL or select a sample above and click &ldquo;Scrape&rdquo; to begin headline extraction.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
