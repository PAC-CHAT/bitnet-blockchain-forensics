# Agentic Architecture 4.0 Blueprints (Production-Ready)

เอกสารนี้แปลงแนวคิด Agentic OS ที่คุณเสนอให้เป็นพิมพ์เขียวเชิงปฏิบัติสำหรับโปรเจ็กต์ `bitnet-blockchain-forensics` โดยเน้น 2 แกนหลัก:

1. **Security-by-design** (sandbox, policy gates, prompt-injection defense)
2. **Stateful orchestration** (checkpointing, replay, auditability)

## 0) Cross-cutting standards (ใช้ร่วมกันทั้ง 4 component)

### Runtime topology

- **Control plane:** LangGraph orchestrator + policy engine
- **Execution plane:** isolated executor workers (Docker + gVisor/Kata)
- **State plane:** Redis (short-lived graph state) + Postgres (durable records)
- **Observability:** LangSmith traces + OpenTelemetry metrics/logs

### Security controls

- Prompt injection firewall ก่อนทุก external-content tool call
- Allowlist ของ domain/tool/action
- Egress policy จำกัด outbound network ตามงาน
- Signed artifacts + immutable audit logs
- Human approval gate สำหรับ high-risk actions

### State model (minimum)

```python
from typing import Any, Literal, TypedDict

class AgentRunState(TypedDict, total=False):
    run_id: str
    tenant_id: str
    status: Literal["queued", "running", "needs_review", "done", "failed"]
    input_payload: dict[str, Any]
    working_memory: dict[str, Any]
    tool_events: list[dict[str, Any]]
    risk_flags: list[str]
    output_payload: dict[str, Any]
```

---

## 1) News Scraper UI (Self-healing Agentic Workflow)

### Goal

สร้างระบบ scrape ข่าวที่รับมือ DOM เปลี่ยนแปลงได้ และอธิบายสถานะการทำงานแบบ step-by-step ใน UI

### Suggested placement in this repository

- `api/`: endpoint รับงาน scrape + status stream
- `pipeline/`: orchestration graph
- `utils/`: sandbox executor client + retry helpers
- `data/`: schema สำหรับข่าวที่ normalize แล้ว

### Graph design (LangGraph)

- `planner_node`: parse URL, classify source type
- `executor_node`: run Playwright ใน ephemeral sandbox
- `extract_node`: parse title/date/body/entities
- `validate_node`: quality + anti-dup checks
- `summarize_node`: summarize + classify
- `review_node` (conditional): ส่ง human-in-the-loop ถ้า confidence ต่ำ

```python
from langgraph.graph import StateGraph, END

workflow = StateGraph(AgentRunState)
workflow.add_node("planner", planner_node)
workflow.add_node("executor", executor_node)
workflow.add_node("extract", extract_node)
workflow.add_node("validate", validate_node)
workflow.add_node("summarize", summarize_node)
workflow.set_entry_point("planner")
workflow.add_edge("planner", "executor")
workflow.add_edge("executor", "extract")
workflow.add_edge("extract", "validate")
workflow.add_conditional_edges("validate", route_after_validation, {
    "summarize": "summarize",
    "review": "review",
})
workflow.add_edge("summarize", END)
```

### UI behavior

- React + Tailwind + shadcn/ui timeline
- แสดงสถานะ per-node: queued/running/retry/done
- แสดง sandbox evidence: screenshot hash, source URL, extraction confidence

---

## 2) Sales Dashboard (Natural Language → SQL → Chart)

### Goal

รับคำถามภาษาไทยแล้วสร้าง query + chart อัตโนมัติ พร้อมกลไกแก้ SQL เองเมื่อ query error

### Agent pattern

- `planner_node`: intent + metric + timeframe extraction
- `sql_node`: Text-to-SQL พร้อม schema-aware retrieval
- `reviewer_node`: run-time SQL lint + dry-run + auto-fix loop
- `viz_dispatch_node`: เลือก chart type (bar/line/pie/table)

### Dynamic chart dispatch rule (ตัวอย่าง)

- มีมิติเวลา + series เดียว → line
- เปรียบเทียบหมวดหมู่หลายค่า → bar
- composition ภายในช่วงเดียว → pie (เมื่อหมวดไม่เกิน ~6)
- cardinality สูง/ข้อมูลซับซ้อน → table + filters

### Hardening notes

- จำกัด SQL เป็น read-only role
- Query governor: timeout, row limit, cost limit
- Cache key จาก normalized intent + tenant scope

---

## 3) Security Review Tool (Hardened Sandbox + Multi-agent Debate)

### Goal

สแกนช่องโหว่โค้ดด้วย static tools + LLM reasoning ใน runtime ที่แยกขาดจาก host

### Sandbox baseline

- Docker image แบบ least privilege
- gVisor runtime
- non-root user
- no-new-privileges, read-only rootfs, seccomp profile
- network off by default (เปิดเฉพาะกรณีต้องใช้ CVE DB mirror ภายใน)

### Debate workflow

- `finder_agent`: หา vulnerability candidates
- `challenger_agent`: พยายามหาหลักฐานโต้แย้ง/พิสูจน์ exploitability
- `arbiter_agent`: สรุป severity + confidence + remediation

### Output contract

- CWE, CVSS estimate, exploit preconditions
- repro steps (ถ้าปลอดภัยต่อระบบทดสอบ)
- suggested patch + secure coding rationale

---

## 4) API Documentation Generator (Self-syncing)

### Goal

อัปเดตเอกสาร API อัตโนมัติทุกครั้งที่ route/controller เปลี่ยนใน CI/CD

### CI pipeline

1. Detect changed files (`src/bitnet_forensics/api/**`)
2. Build route map + parse docstrings + pydantic models
3. Generate OpenAPI extensions + markdown docs
4. Validate examples via schema check
5. Open PR with doc diff + summary

### Quality gates

- fail ถ้าขาด response model ใน route ใหม่
- fail ถ้า endpoint ไม่มี error response mapping
- warn ถ้า example payload ไม่ผ่าน schema validation

---

## Enterprise rollout plan

### Phase 1: Foundation

- ตั้ง LangGraph runtime + Redis/Postgres state store
- เพิ่ม security guardrails (firewall, allowlists, approval gates)
- เปิด tracing มาตรฐานสำหรับทุก node

### Phase 2: Component pilots

- เริ่มจาก News Scraper และ API Doc Generator (risk ต่ำกว่า)
- เก็บ SLO: success rate, median latency, manual-review ratio

### Phase 3: Regulated operations

- เพิ่ม policy-as-code + signed execution attestations
- เพิ่ม retention policy และ tenant-level data boundary checks

## Suggested KPIs

- Agent success rate (no-human-intervention)
- Mean retries per run
- False positive rate (security findings)
- Documentation drift (code vs docs mismatch)
- Incident count from prompt injection attempts
