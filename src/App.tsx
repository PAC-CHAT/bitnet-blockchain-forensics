import React, { useState, useEffect } from 'react';
import { Header, type ActiveTab } from './components/Header';
import { ForensicsOverview } from './components/ForensicsOverview';
import { NewsScraperView } from './components/NewsScraperView';
import { SalesDashboardView } from './components/SalesDashboardView';
import { SecurityReviewView } from './components/SecurityReviewView';
import { ApiDocsGeneratorView } from './components/ApiDocsGeneratorView';
import { PlatformCapabilitiesView } from './components/PlatformCapabilitiesView';
import { Cpu } from 'lucide-react';

export const App: React.FC = () => {
  // Sync tab with URL path
  const getTabFromPath = (path: string): ActiveTab => {
    if (path.includes('/ui/news-scraper')) return 'news';
    if (path.includes('/ui/sales-dashboard')) return 'sales';
    if (path.includes('/ui/security-review')) return 'security';
    if (path.includes('/ui/api-docs-generator')) return 'docs';
    if (path.includes('/docs/platform')) return 'capabilities';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>(() =>
    getTabFromPath(window.location.pathname)
  );

  // Global search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <ForensicsOverview searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        )}
        {activeTab === 'news' && (
          <NewsScraperView searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        )}
        {activeTab === 'sales' && (
          <SalesDashboardView searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        )}
        {activeTab === 'security' && (
          <SecurityReviewView searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        )}
        {activeTab === 'docs' && (
          <ApiDocsGeneratorView searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        )}
        {activeTab === 'capabilities' && (
          <PlatformCapabilitiesView searchQuery={searchQuery} onClearSearch={handleClearSearch} />
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">BitNet Blockchain Forensics</span>
            <span>•</span>
            <span className="font-mono text-slate-500">v2.0.0 React Rewrite</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono">
            <button
              onClick={() => {
                setActiveTab('news');
                window.history.pushState(null, '', '/ui/news-scraper');
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              /ui/news-scraper
            </button>
            <button
              onClick={() => {
                setActiveTab('sales');
                window.history.pushState(null, '', '/ui/sales-dashboard');
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              /ui/sales-dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('security');
                window.history.pushState(null, '', '/ui/security-review');
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              /ui/security-review
            </button>
            <button
              onClick={() => {
                setActiveTab('docs');
                window.history.pushState(null, '', '/ui/api-docs-generator');
              }}
              className="hover:text-cyan-400 transition-colors"
            >
              /ui/api-docs-generator
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
