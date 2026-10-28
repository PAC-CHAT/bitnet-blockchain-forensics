import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function apiMockPlugin(): Plugin {
  return {
    name: 'api-mock-endpoints',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? new URL(req.url, 'http://localhost:3000') : null;
        if (!url) return next();

        // /health
        if (url.pathname === '/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok' }));
          return;
        }

        // /api/sales/metrics
        if (url.pathname === '/api/sales/metrics') {
          const rows = [
            { month: 'Jan', revenue: 12000.0, orders: 120 },
            { month: 'Feb', revenue: 15450.0, orders: 142 },
            { month: 'Mar', revenue: 16900.0, orders: 158 },
            { month: 'Apr', revenue: 14300.0, orders: 133 },
            { month: 'May', revenue: 18000.0, orders: 166 },
            { month: 'Jun', revenue: 20100.0, orders: 181 },
          ];
          const total_revenue = rows.reduce((acc, r) => acc + r.revenue, 0);
          const total_orders = rows.reduce((acc, r) => acc + r.orders, 0);
          const avg_order_value = total_orders ? total_revenue / total_orders : 0;

          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              labels: rows.map((r) => r.month),
              revenue: rows.map((r) => r.revenue),
              orders: rows.map((r) => r.orders),
              total_revenue: Math.round(total_revenue * 100) / 100,
              total_orders: total_orders,
              avg_order_value: Math.round(avg_order_value * 100) / 100,
            })
          );
          return;
        }

        // /api/security/review
        if (url.pathname === '/api/security/review' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const text = (parsed.content || '').toLowerCase();
              const findings = [];

              if (text.includes('http://')) {
                findings.push({
                  severity: 'high',
                  summary: 'Insecure protocol usage detected (HTTP).',
                  recommendation: 'Use HTTPS/TLS for all production endpoints.',
                });
              }
              if (text.includes('password') || text.includes('secret')) {
                findings.push({
                  severity: 'critical',
                  summary: 'Potential sensitive credential disclosure.',
                  recommendation: 'Remove hardcoded secrets and rotate exposed credentials.',
                });
              }
              if (text.includes('*') && text.includes('cors')) {
                findings.push({
                  severity: 'medium',
                  summary: 'Overly permissive CORS pattern detected.',
                  recommendation: 'Restrict CORS origins to trusted hostnames.',
                });
              }
              if (findings.length === 0) {
                findings.push({
                  severity: 'info',
                  summary: 'No obvious heuristic issues found.',
                  recommendation: 'Run SAST/DAST and perform manual review before release.',
                });
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ findings }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON request' }));
            }
          });
          return;
        }

        // /api/news/scrape
        if (url.pathname === '/api/news/scrape') {
          const targetUrl = url.searchParams.get('url') || 'https://example.com';
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              articles: [
                {
                  title: 'Bitcoin Hashrate Reaches New All-Time High Amid Network Upgrades',
                  source_url: targetUrl,
                },
                {
                  title: 'Ethereum Layer 2 Activity Surges Following Zero-Knowledge Rollup Milestone',
                  source_url: targetUrl,
                },
                {
                  title: 'Global Regulators Publish Comprehensive Framework on Cross-Border Asset Tracing',
                  source_url: targetUrl,
                },
                {
                  title: 'BitNet b1.58 Forensic Sharding Algorithm Accelerates Graph Clustering',
                  source_url: targetUrl,
                },
              ],
            })
          );
          return;
        }

        // /api/docs/markdown
        if (url.pathname === '/api/docs/markdown') {
          const docs = `# BitNet API Route Documentation

| Method | Path | Name |
|---|---|---|
| GET | \`/api/docs/markdown\` | api_docs_markdown |
| GET | \`/api/news/scrape\` | api_news_scrape |
| GET | \`/api/sales/metrics\` | api_sales_metrics |
| POST | \`/api/security/review\` | api_security_review |
| GET | \`/health\` | health |
| GET | \`/ui/api-docs-generator\` | api_docs_generator_ui |
| GET | \`/ui/news-scraper\` | news_scraper_ui |
| GET | \`/ui/sales-dashboard\` | sales_dashboard_ui |
| GET | \`/ui/security-review\` | security_review_ui |

Generated automatically from FastAPI route metadata.`;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(docs);
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiMockPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
