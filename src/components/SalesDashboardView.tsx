import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  RefreshCw, 
  Code, 
  Plus, 
  RotateCcw,
  Search,
  X
} from 'lucide-react';
import { buildSalesSnapshot, toChartPayload } from '../services/forensics';
import type { MonthlySales, ChartPayload } from '../types/forensics';

interface SalesDashboardViewProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const SalesDashboardView: React.FC<SalesDashboardViewProps> = ({ 
  searchQuery = '', 
  onClearSearch 
}) => {
  const [salesRows, setSalesRows] = useState<MonthlySales[]>(buildSalesSnapshot);
  const [metrics, setMetrics] = useState<ChartPayload>(() => toChartPayload(buildSalesSnapshot()));
  const [loading, setLoading] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // New month input
  const [newMonth, setNewMonth] = useState('');
  const [newRev, setNewRev] = useState('');
  const [newOrders, setNewOrders] = useState('');

  const loadMetricsFromApi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sales/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        setMetrics(toChartPayload(salesRows));
      }
    } catch {
      setMetrics(toChartPayload(salesRows));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMetrics(toChartPayload(salesRows));
  }, [salesRows]);

  const query = searchQuery.trim().toLowerCase();
  const filteredRows = salesRows.filter((row) => {
    if (!query) return true;
    const avg = row.orders ? row.revenue / row.orders : 0;
    return (
      row.month.toLowerCase().includes(query) ||
      String(row.revenue).includes(query) ||
      String(row.orders).includes(query) ||
      avg.toFixed(2).includes(query)
    );
  });

  const displayRows = query ? filteredRows : salesRows;
  const displayMetrics = query ? toChartPayload(displayRows) : metrics;

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonth || !newRev || !newOrders) return;
    const r = parseFloat(newRev) || 0;
    const o = parseInt(newOrders) || 0;
    setSalesRows([...salesRows, { month: newMonth, revenue: r, orders: o }]);
    setNewMonth('');
    setNewRev('');
    setNewOrders('');
  };

  const handleReset = () => {
    setSalesRows(buildSalesSnapshot());
  };

  const maxRevenue = Math.max(...displayMetrics.revenue, 25000);

  return (
    <div className="space-y-6">
      {/* Component Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>PRODUCTION UI MODULE • /ui/sales-dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sales Dashboard with Charts</h1>
            <p className="text-sm text-slate-400 mt-1">
              Operational revenue &amp; performance metrics backed by{' '}
              <code className="text-cyan-300 font-mono">/api/sales/metrics</code>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showJson ? 'Hide JSON' : 'View API Metrics'}</span>
            </button>
            <button
              onClick={loadMetricsFromApi}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Endpoint</span>
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
                {filteredRows.length} of {salesRows.length} months matched
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
          <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="text-slate-400 mb-2 font-semibold">GET /api/sales/metrics:</div>
            <pre className="text-cyan-400 overflow-x-auto">{JSON.stringify(displayMetrics, null, 2)}</pre>
          </div>
        )}

        {/* Summary Metric Cards matching /ui/sales-dashboard values */}
        <div id="summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase font-mono">
                {query ? 'Filtered Revenue' : 'Total Revenue'}
              </span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
              ${displayMetrics.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {query ? `Sum of ${displayRows.length} matching periods` : 'Sum of all monthly settlements'}
            </span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase font-mono">Avg Order Value</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-2">
              ${displayMetrics.avg_order_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Revenue per fulfilled order</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase font-mono">
                {query ? 'Filtered Orders' : 'Total Orders'}
              </span>
              <ShoppingCart className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-2">
              {displayMetrics.total_orders.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {displayMetrics.labels.length} active reporting periods
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Revenue Performance (Monthly)</h2>
            <p className="text-xs text-slate-400">Interactive visual equivalent of canvas #revenueChart</p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>
        </div>

        {/* SVG Bar Chart */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
          {displayRows.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-8 pb-4">
              {displayMetrics.labels.map((label, idx) => {
                const rev = displayMetrics.revenue[idx] || 0;
                const ord = displayMetrics.orders[idx] || 0;
                const heightPct = Math.max(10, Math.min(100, (rev / maxRevenue) * 100));
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div
                      className={`text-[11px] font-mono mb-2 transition-opacity duration-150 text-center ${
                        isHovered ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
                      }`}
                    >
                      <span className="text-emerald-400 font-semibold block">${rev.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px] block">{ord} orders</span>
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[50px] bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full transition-all duration-300 rounded-t-lg ${
                          isHovered
                            ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-lg shadow-cyan-500/30'
                            : 'bg-gradient-to-t from-blue-600 to-cyan-500'
                        }`}
                      />
                    </div>

                    {/* Month Label */}
                    <div className="mt-2 text-xs font-mono font-medium text-slate-400 group-hover:text-cyan-400">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              <p>No sales months match &ldquo;{searchQuery}&rdquo;</p>
              {onClearSearch && (
                <button onClick={onClearSearch} className="mt-2 text-cyan-400 underline font-mono">
                  Clear search filter
                </button>
              )}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500 inline-block"></span>
              <span>Dataset: Revenue ($ USD)</span>
            </span>
            <span>Target Wavelength: Infrared Normalized</span>
          </div>
        </div>

        {/* Data Table & Month Adder */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Revenue ($)</th>
                  <th className="py-2.5 px-3">Orders</th>
                  <th className="py-2.5 px-3">Average / Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {displayRows.length > 0 ? (
                  displayRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{row.month}</td>
                      <td className="py-2.5 px-3 text-emerald-400">${row.revenue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-purple-400">{row.orders}</td>
                      <td className="py-2.5 px-3 text-cyan-400">
                        ${(row.orders ? row.revenue / row.orders : 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No rows match the search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">Add Custom Reporting Month</h3>
            <form onSubmit={handleAddRow} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Month Label</label>
                <input
                  type="text"
                  placeholder="e.g. Jul"
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Revenue ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 21500"
                  value={newRev}
                  onChange={(e) => setNewRev(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block mb-1">Order Count</label>
                <input
                  type="number"
                  placeholder="e.g. 195"
                  value={newOrders}
                  onChange={(e) => setNewOrders(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append Month</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
