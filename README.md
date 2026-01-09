# PROJECT SWARM

A modular, autonomous **multi‑agent orchestration platform** for building cooperative AI systems that can plan, communicate, execute tools, and self‑organize to solve complex tasks — with **policy guardrails, observability, and evaluation** built in.

> This repository is the **unified home** for everything previously split across SWARM / Project‑SWARM efforts.

---

## Table of Contents
1. Overview
2. Core Concepts
3. Quickstart
4. Repository Layout
5. Policy & Safety
6. Observability
7. Evaluation
8. Roadmap
9. Contributing & Security
10. Migration

---

## 1) Overview
PROJECT SWARM is designed to run multiple specialized agents as a coordinated system:
- **Agents** — bounded actors with explicit capabilities and tool access
- **Runtime** — schedules agents, routes messages, orchestrates tools
- **Tools** — adapters to external systems (GitHub, cloud, shell, HTTP, etc.)
- **Memory** — short‑term context + long‑term stores (relational/vector)
- **Policy** — enforceable rules and approvals before actions execute
- **Observability** — tracing/metrics/logging for every run
- **Evaluation** — regression tests for capability + safety

The goal: **decentralized intelligence that is debuggable**, not a vibe-based black box.

---

## 2) Core Concepts
### A) Agent
An agent is a bounded actor with:
- a role/purpose
- a capability set
- explicit tool allowlists
- scoped memory access
- stop conditions (fail‑safe behavior)

### B) Tool Adapter
A tool adapter is a controlled integration point:
- typed inputs/outputs (or well-defined schemas)
- policy checks **before** execution
- traceable, auditable execution

### C) Run / Session
A run is a replayable execution record:
- event stream
- deterministic replay (when tool outputs are cached)
- audit trail for actions and decisions

---

## 3) Quickstart (skeleton)
This repo is currently a **scaffold** (structure + governance + docs). The runtime implementation can be added under `packages/`.

### Local dev requirements
- Python 3.11+
- (Optional) Docker

### Next steps
- Add `packages/swarm-core` and `packages/swarm-cli`
- Add at least one example agent + workflow
- Wire CI to run lint/tests

---

## 4) Repository Layout
High-level:
- `docs/` — architecture, specs, guides
- `packages/` — core runtime + CLI + optional UI
- `agents/` — agent blueprints + implementations
- `tools/` — tool adapters + sandboxing wrappers
- `workflows/` — workflow specs + compiler/validator
- `eval/` — evaluation harness + suites
- `infra/` — docker/k8s/terraform
- `visuals/` — Mermaid diagrams and renders

See: `docs/00-vision/003_architecture-at-a-glance.md`

---

## 5) Policy & Safety
Policy is an enforcement system (not optional guidance):
- tool allowlists and domain constraints
- rate limits and timeouts
- data redaction and PII handling
- approval gates for high-risk actions
- immutable audit logs per run

See: `configs/policies/`

---

## 6) Observability
OpenTelemetry-first.
- traces per run
- metrics per agent/tool
- structured logs with redaction

See: `configs/logging/otel.yaml`

---

## 7) Evaluation
Evaluation prevents “it feels smarter” regressions:
- `eval/suites/` define test packs
- harness generates reports
- CI runs smoke + regression + safety suites

---

## 8) Roadmap
See `docs/90-roadmap/roadmap.md`.

---

## 9) Contributing & Security
- Contributing: `CONTRIBUTING.md`
- Security: `SECURITY.md`
- Code of Conduct: `CODE_OF_CONDUCT.md`

---

## 10) Migration
See `MIGRATION.md` for recommended approaches (git subtree preferred).
