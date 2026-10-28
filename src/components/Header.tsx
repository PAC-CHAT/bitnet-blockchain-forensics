import React, { useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  BarChart3, 
  Newspaper, 
  FileCode2, 
  Layers, 
  CheckCircle2, 
  Cpu,
  Search,
  X
} from 'lucide-react';

export type ActiveTab = 'overview' | 'news' | 'sales' | 'security' | 'docs' | 'capabilities';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery 
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Forensics & Parser', icon: Terminal, route: '/' },
    { id: 'news' as ActiveTab, label: 'News Scraper', icon: Newspaper, route: '/ui/news-scraper' },
    { id: 'sales' as ActiveTab, label: 'Sales Dashboard', icon: BarChart3, route: '/ui/sales-dashboard' },
    { id: 'security' as ActiveTab, label: 'Security Review', icon: ShieldAlert, route: '/ui/security-review' },
    { id: 'docs' as ActiveTab, label: 'API Docs Generator', icon: FileCode2, route: '/ui/api-docs-generator' },
    { id: 'capabilities' as ActiveTab, label: 'Platform Architecture', icon: Layers, route: '/docs/platform' },
  ];

  const getPlaceholder = (tab: ActiveTab): string => {
    switch (tab) {
      case 'overview':
        return 'Search addresses, nodes, tx hashes, chains, beams...';
      case 'news':
        return 'Filter scraped headlines, sources, or topics...';
      case 'sales':
        return 'Filter months, revenue values, or orders...';
      case 'security':
        return 'Search security findings, severities, or rules...';
      case 'docs':
        return 'Filter API routes, methods, or endpoint names...';
      case 'capabilities':
        return 'Search platform capabilities, architecture layers...';
      default:
        return 'Search current dashboard dataset...';
    }
  };

  // Keyboard shortcut: '/' focuses the global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">BitNet Forensics</span>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                  b1.58 v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Blockchain Intelligence &amp; Static Audit</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none flex items-center">
                <Search className={`w-4 h-4 transition-colors ${searchQuery ? 'text-cyan-400' : 'text-slate-500'}`} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getPlaceholder(activeTab)}
                aria-label="Global search across active dataset"
                className={`w-full bg-slate-950/90 border rounded-xl pl-10 pr-20 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all ${
                  searchQuery 
                    ? 'border-cyan-500/80 shadow-md shadow-cyan-500/10' 
                    : 'border-slate-800 focus:border-cyan-500/60 focus:bg-slate-950'
                }`}
              />
              <div className="absolute right-2.5 flex items-center space-x-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800/80 border border-slate-700/60 rounded">
                    /
                  </kbd>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                    Filtered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status & Indicators */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="hidden lg:flex items-center space-x-2 text-xs font-mono bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">Core Online</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Port 3000</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.history.pushState(null, '', tab.route);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
