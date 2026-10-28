export interface TransactionRecord {
  tx_hash: string;
  chain: string;
  amount: number;
  block_height: number;
}

export interface DataShardBeam {
  beam_id: string;
  source: string;
  shard_count: number;
  wavelength: string;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  orders: number;
}

export interface ChartPayload {
  labels: string[];
  revenue: number[];
  orders: number[];
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'info';

export interface SecurityFinding {
  severity: SeverityLevel;
  summary: string;
  recommendation: string;
}

export interface NewsArticle {
  title: string;
  source_url: string;
  published_at?: string;
  summary?: string;
}

export interface FeatureVector {
  transaction_count: number;
  unique_counterparties: number;
  activity_ratio: number;
}

export interface SandboxedExecutionState {
  code: string;
  error_history: string[];
  execution_result?: string;
  error_detected?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'wallet' | 'mixer' | 'exchange' | 'contract' | 'merchant';
  riskScore: number;
  balance: number;
  chain: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  amount: number;
  txHash: string;
  timestamp: string;
}
