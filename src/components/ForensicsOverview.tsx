import React, { useState } from 'react';
import { 
  Activity, 
  Terminal, 
  AlertTriangle, 
  Check, 
  Layers, 
  Play, 
  Lock, 
  Network,
  RotateCw,
  Search,
  X
} from 'lucide-react';
import {
  parseTransaction,
  parseDataShardBeam,
  scoreRisk,
  buildFeatures,
  renderGraphSummary,
  formatDataShardBeamCodename,
  executeSandboxedNode,
} from '../services/forensics';
import type { GraphNode, GraphEdge } from '../types/forensics';

interface ForensicsOverviewProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const ForensicsOverview: React.FC<ForensicsOverviewProps> = ({ 
  searchQuery = '', 
  onClearSearch 
}) => {
  // Transaction parser state
  const [txRawInput, setTxRawInput] = useState<string>(
    JSON.stringify(
      {
        tx_hash: '0x9a3f2b4c10d8e76a541289cf0092bcde571a8f9024c3d18e9a1b0c3d4e5f6a7b',
        chain: 'ethereum',
        amount: 45.85,
        block_height: 19482012,
      },
      null,
      2
    )
  );

  const [parsedTx, setParsedTx] = useState(() => {
    try {
      return parseTransaction(JSON.parse(txRawInput));
    } catch {
      return parseTransaction({});
    }
  });

  // Data Shard Beam parser state
  const [beamRawInput, setBeamRawInput] = useState<string>(
    JSON.stringify(
      {
        beam_id: 'DSB-INFRARED-904',
        source: 'binance-hot-wallet',
        shard_count: 64,
        wavelength: 'infrared',
      },
      null,
      2
    )
  );

  const [parsedBeam, setParsedBeam] = useState(() => {
    try {
      return parseDataShardBeam(JSON.parse(beamRawInput));
    } catch {
      return parseDataShardBeam({});
    }
  });

  // Risk Scoring state
  const [txCount, setTxCount] = useState<number>(45);
  const [counterparties, setCounterparties] = useState<number>(38);
  const features = buildFeatures(txCount, counterparties);
  const computedRisk = scoreRisk(features.activity_ratio);

  // CLI pen codename state
  const [thaiName, setThaiName] = useState<string>('อินฟราเรดชาร์ดข้อมูล');
  const [englishName, setEnglishName] = useState<string>('data shard beam');

  // Sandbox simulation state
  const [sandboxCode, setSandboxCode] = useState<string>(
    `# Forensic rule evaluation\ndef evaluate_hops():\n    token = "SUPER_SECRET_VALUE"\n    if hops > 5:\n        raise RuntimeError("Path breached: /workspace/bitnet-blockchain-forensics/private.py")\n    return "VERIFIED"`
  );
  const [sandboxState, setSandboxState] = useState<{
    code: string;
    error_history: string[];
    execution_result?: string;
    error_detected?: boolean;
  }>({
    code: '',
    error_history: [],
  });

  // Sample Nodes & Edges for Graph Visualizer
  const [nodes] = useState<GraphNode[]>([
    { id: '1', label: '0x3a91...bc21', type: 'wallet', riskScore: 0.84, balance: 142.5, chain: 'Ethereum' },
    { id: '2', label: 'Tornado.Cash Cashier', type: 'mixer', riskScore: 0.98, balance: 1250.0, chain: 'Ethereum' },
    { id: '3', label: 'Uniswap V3 Pool', type: 'contract', riskScore: 0.12, balance: 9400.2, chain: 'Ethereum' },
    { id: '4', label: 'Binance Deposit 4', type: 'exchange', riskScore: 0.25, balance: 520.0, chain: 'Ethereum' },
    { id: '5', label: '0x882c...99ef (Victim)', type: 'wallet', riskScore: 0.45, balance: 12.0, chain: 'Ethereum' },
  ]);

  const [edges] = useState<GraphEdge[]>([
    { id: 'e1', from: '5', to: '1', amount: 80.0, txHash: '0xaa1...99', timestamp: '10 mins ago' },
    { id: 'e2', from: '1', to: '2', amount: 65.5, txHash: '0xbb2...88', timestamp: '8 mins ago' },
    { id: 'e3', from: '2', to: '4', amount: 30.0, txHash: '0xcc3...77', timestamp: '4 mins ago' },
    { id: 'e4', from: '1', to: '3', amount: 14.5, txHash: '0xdd4...66', timestamp: '2 mins ago' },
  ]);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0]);

  // Query filtering
  const query = (searchQuery || '').trim().toLowerCase();

  const filteredNodes = nodes.filter((node) => {
    if (!query) return true;
    return (
      node.label.toLowerCase().includes(query) ||
      node.type.toLowerCase().includes(query) ||
      node.chain.toLowerCase().includes(query) ||
      node.id.toLowerCase().includes(query) ||
      String(node.balance).includes(query)
    );
  });

  const matchedNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = edges.filter((edge) => {
    if (!query) return true;
    return (
      matchedNodeIds.has(edge.from) ||
      matchedNodeIds.has(edge.to) ||
      edge.txHash.toLowerCase().includes(query) ||
      String(edge.amount).includes(query)
    );
  });

  const handleParseTransaction = (rawJson: string) => {
    setTxRawInput(rawJson);
    try {
      const obj = JSON.parse(rawJson);
      setParsedTx(parseTransaction(obj));
    } catch {
      // tolerate
    }
  };

  const handleParseBeam = (rawJson: string) => {
    setBeamRawInput(rawJson);
    try {
      const obj = JSON.parse(rawJson);
      setParsedBeam(parseDataShardBeam(obj));
    } catch {
      // tolerate
    }
  };

  const runSandboxExecution = (simulateError = false) => {
    const codeToRun = simulateError ? sandboxCode + '\nboom()' : sandboxCode;
    const result = executeSandboxedNode({
      code: codeToRun,
      error_history: sandboxState.error_history,
    });
    setSandboxState(result);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-400 text-xs font-mono mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>BITNET B1.58 INTELLIGENCE KERNEL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Blockchain Forensic Data Review &amp; Parsing Engine
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Production React implementation ported from the BitNet forensics architecture. Provides transaction normalization,
            fault-tolerant data shard parsing, activity-ratio risk assessment, and isolated traceback sanitization.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Wavelength Protocol</span>
            <span className="text-sm font-semibold font-mono text-cyan-400">Infrared (อินฟราเรด)</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Graph Topology</span>
            <span className="text-sm font-semibold text-slate-200">{renderGraphSummary(nodes.length, edges.length)}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Risk Evaluation</span>
            <span className="text-sm font-semibold text-emerald-400">Activity Ratio Normalization</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">Traceback Shield</span>
            <span className="text-sm font-semibold text-amber-400">Regex Path &amp; Secret Redactor</span>
          </div>
        </div>
      </div>

      {/* Global Search Active Banner */}
      {query && (
        <div className="bg-cyan-950/40 border border-cyan-800/80 rounded-xl p-3 sm:p-4 flex items-center justify-between text-xs text-cyan-300 shadow-lg shadow-cyan-950/50">
          <div className="flex items-center space-x-2.5">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Active Filter: &ldquo;<strong className="text-white font-mono">{searchQuery}</strong>&rdquo; &bull;{' '}
              {filteredNodes.length} of {nodes.length} cluster nodes matched
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

      {/* Grid: Transaction Parser & Data Shard Beam */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Transaction Parser */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Transaction Normalizer</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">core/entities.py &amp; parser.py</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Parses untrusted blockchain payloads with strict coercion for <code className="text-cyan-300">tx_hash</code>,{' '}
              <code className="text-cyan-300">chain</code>, <code className="text-cyan-300">amount</code>, and non-negative{' '}
              <code className="text-cyan-300">block_height</code>.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() =>
                  handleParseTransaction(
                    JSON.stringify(
                      {
                        tx_hash: '0x9a3f2b4c10d8e76a541289cf0092bcde571a8f9024c3d18e9a1b0c3d4e5f6a7b',
                        chain: 'ethereum',
                        amount: 45.85,
                        block_height: 19482012,
                      },
                      null,
                      2
                    )
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Standard Payload
              </button>
              <button
                type="button"
                onClick={() =>
                  handleParseTransaction(
                    JSON.stringify(
                      {
                        tx_hash: 991204,
                        chain: 1,
                        amount: 'NaN?',
                        block_height: -7,
                      },
                      null,
                      2
                    )
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 hover:bg-amber-900/60 text-amber-300"
              >
                Test Malformed / Edge Case
              </button>
              <button
                type="button"
                onClick={() => handleParseTransaction('{}')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                Empty Object
              </button>
            </div>

            <textarea
              rows={5}
              value={txRawInput}
              onChange={(e) => handleParseTransaction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-500 block mb-2">Normalized Output (TransactionRecord):</span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">tx_hash:</span>
                <span className="text-cyan-400 break-all">{parsedTx.tx_hash || '"" (empty)'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">chain:</span>
                <span className="text-emerald-400">{parsedTx.chain}</span>
              </div>
              <div>
                <span className="text-slate-500 block">amount:</span>
                <span className="text-purple-400">{parsedTx.amount}</span>
              </div>
              <div>
                <span className="text-slate-500 block">block_height:</span>
                <span className="text-amber-400">{parsedTx.block_height}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Data Shard Beam Parser & Codenames */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Data Shard Beam &amp; Codename</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">cli/main.py (pen)</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Standardized infrared shard beam packet with Thai bilingual rendering matching CLI{' '}
              <code className="text-indigo-300">pen</code> command specs.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() =>
                  handleParseBeam(
                    JSON.stringify(
                      {
                        beam_id: 'DSB-INFRARED-904',
                        source: 'binance-hot-wallet',
                        shard_count: 64,
                        wavelength: 'infrared',
                      },
                      null,
                      2
                    )
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Standard Beam
              </button>
              <button
                type="button"
                onClick={() =>
                  handleParseBeam(
                    JSON.stringify(
                      {
                        beam_id: 77,
                        source: true,
                        shard_count: -3,
                        wavelength: false,
                      },
                      null,
                      2
                    )
                  )
                }
                className="text-xs px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 hover:bg-amber-900/60 text-amber-300"
              >
                Edge Case (Defaults to Infrared)
              </button>
            </div>

            <textarea
              rows={4}
              value={beamRawInput}
              onChange={(e) => handleParseBeam(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500 block">beam_id:</span>
                  <span className="text-indigo-400">{parsedBeam.beam_id || '""'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">source:</span>
                  <span className="text-slate-300">{parsedBeam.source}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">shard_count:</span>
                  <span className="text-emerald-400">{parsedBeam.shard_count}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">wavelength:</span>
                  <span className="text-rose-400">{parsedBeam.wavelength}</span>
                </div>
              </div>
            </div>

            {/* Codename CLI pen helper */}
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
              <span className="text-xs text-indigo-300 font-semibold block mb-1">
                Bilingual Codename Formatter:
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={thaiName}
                  onChange={(e) => setThaiName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 w-1/2"
                  placeholder="Thai name"
                />
                <input
                  type="text"
                  value={englishName}
                  onChange={(e) => setEnglishName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 w-1/2"
                  placeholder="English name"
                />
              </div>
              <div className="mt-2 text-xs font-mono text-indigo-200 font-bold">
                Result: &ldquo;{formatDataShardBeamCodename(thaiName, englishName)}&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module 3: Activity Ratio & Risk Scoring */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Address Activity Ratio &amp; Risk Scoring</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">learning/features.py &amp; inference/scoring.py</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Transaction Count</span>
                <span className="font-mono text-white">{txCount}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={txCount}
                onChange={(e) => setTxCount(parseInt(e.target.value) || 0)}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Unique Counterparties</span>
                <span className="font-mono text-white">{counterparties}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={counterparties}
                onChange={(e) => setCounterparties(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              Formula: <code className="text-cyan-300">activity_ratio = counterparties / max(tx_count, 1)</code>
              <br />
              Risk: <code className="text-cyan-300">score_risk(ratio) = min(max(ratio, 0.0), 1.0)</code>
            </div>
          </div>

          {/* Metric Displays */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-xs text-slate-400 uppercase font-mono">Normalized Activity Ratio</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono">
              {(features.activity_ratio).toFixed(3)}
            </div>
            <p className="text-xs text-slate-500">
              {counterparties} counterparties across {txCount} transactions
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-xs text-slate-400 uppercase font-mono">Clamped Risk Score</span>
            <div className="text-3xl font-extrabold font-mono flex items-center justify-center space-x-2">
              <span
                className={
                  computedRisk > 0.8
                    ? 'text-rose-400'
                    : computedRisk > 0.5
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }
              >
                {(computedRisk * 100).toFixed(1)}%
              </span>
            </div>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                computedRisk > 0.8
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : computedRisk > 0.5
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {computedRisk > 0.8 ? 'High Risk Cluster' : computedRisk > 0.5 ? 'Medium Suspicion' : 'Low Anomaly Rate'}
            </span>
          </div>
        </div>
      </div>

      {/* Module 4: Graph Topology & On-Chain Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Forensic Address Cluster Graph</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">visualization/graphs.py</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Topology Canvas */}
          <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 relative min-h-[300px] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800/80 pb-2">
              <span className="font-mono">{renderGraphSummary(filteredNodes.length, filteredEdges.length)}</span>
              <span className="text-cyan-400">
                {query ? `Filtered (${filteredNodes.length}/${nodes.length} nodes)` : 'Click a node to inspect entity details'}
              </span>
            </div>

            {/* Visual Node Diagram */}
            {filteredNodes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-slate-300 font-semibold">{node.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            node.riskScore > 0.8
                              ? 'bg-rose-950 text-rose-300'
                              : node.riskScore > 0.4
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {(node.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">{node.type} • {node.balance} ETH</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                <p>No nodes match &ldquo;{searchQuery}&rdquo;</p>
                {onClearSearch && (
                  <button onClick={onClearSearch} className="mt-2 text-cyan-400 underline">
                    Clear filter
                  </button>
                )}
              </div>
            )}

            {/* Edge Flow List */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 text-xs">
              <span className="text-[11px] font-mono text-slate-400 block mb-1 font-semibold">Active Fund Hops (Edges):</span>
              <div className="space-y-1 font-mono text-[11px]">
                {filteredEdges.length > 0 ? (
                  filteredEdges.map((edge) => (
                    <div key={edge.id} className="flex items-center justify-between text-slate-300 py-0.5 border-b border-slate-800/40 last:border-0">
                      <span className="text-slate-400">
                        Node {edge.from} &rarr; Node {edge.to}
                      </span>
                      <span className="text-purple-400">{edge.amount} ETH</span>
                      <span className="text-slate-500">{edge.timestamp}</span>
                      <span className="text-cyan-400">{edge.txHash}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 py-1">No active edge transfers match search filter.</div>
                )}
              </div>
            </div>
          </div>

          {/* Node Inspector */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 block mb-2 font-semibold">Selected Entity Inspector</span>
              {selectedNode ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Identifier:</span>
                    <span className="font-mono text-white text-sm font-semibold">{selectedNode.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Type:</span>
                      <span className="text-cyan-400 uppercase">{selectedNode.type}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Chain:</span>
                      <span className="text-slate-200">{selectedNode.chain}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Balance:</span>
                      <span className="text-emerald-400">{selectedNode.balance} ETH</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Risk Score:</span>
                      <span className={selectedNode.riskScore > 0.7 ? 'text-rose-400' : 'text-slate-200'}>
                        {(selectedNode.riskScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-8 text-center">Select a node from graph</div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Direct connection to BitNet graph walker algorithms for automated clustering.
            </div>
          </div>
        </div>
      </div>

      {/* Module 5: Sandboxed Executor & Traceback Sanitization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Sandboxed Executor &amp; Traceback Sanitizer</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">core/sandbox.py &amp; pipeline/jobs.py</span>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Simulates isolated pipeline execution with deterministic redaction of internal filesystem paths and sensitive credentials
          (<code className="text-amber-300">[PATH_REDACTED]</code>, <code className="text-amber-300">[REDACTED]</code>).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <textarea
              rows={5}
              value={sandboxCode}
              onChange={(e) => setSandboxCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center space-x-2 mt-2">
              <button
                type="button"
                onClick={() => runSandboxExecution(false)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Code</span>
              </button>
              <button
                type="button"
                onClick={() => runSandboxExecution(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Trigger Error &amp; Redaction</span>
              </button>
              <button
                type="button"
                onClick={() => setSandboxState({ code: '', error_history: [] })}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 block mb-1">Executor Output Delta:</span>
            {sandboxState.execution_result && (
              <div className="p-2.5 rounded bg-emerald-950/50 border border-emerald-800 text-emerald-300 mb-2">
                <span className="font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Success:</span>
                {sandboxState.execution_result}
              </div>
            )}

            {sandboxState.error_detected && (
              <div className="p-2.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 mb-2">
                <span className="font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Error Sanitized:</span>
                <pre className="whitespace-pre-wrap mt-1 text-[11px]">
                  {sandboxState.error_history[sandboxState.error_history.length - 1]}
                </pre>
              </div>
            )}

            <div className="text-slate-500 text-[11px] mt-2">
              Error history log entries: {sandboxState.error_history.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
