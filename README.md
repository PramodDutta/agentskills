# AgentSkills

AI agent skills and tools for automated test planning, QA workflows, and Jira integration.

This repository contains reusable **agent skills** — self-contained instruction sets that guide AI coding agents (Claude Code, GitHub Copilot, Cline, etc.) to perform specialized QA and testing tasks. The flagship skill is the **Test Plan Generator**, which turns Jira tickets into review-ready test plans.

---

## 📦 Repository Structure

```
AgentSkills/
├── output/                              # Generated outputs (test plans, reports)
│   └── test-plan-VWO-49.md              # Sample: test plan for VWO-49
│
└── testplan-creater-via-jira/           # Test Plan Generator skill
    ├── SKILL.md                         # Agent skill definition (Claude/Cline)
    ├── assets/                          # Images, diagrams, screenshots
    ├── context/
    │   └── How_to_Create_TestPlan_VWO.md # Project-specific context for agents
    ├── copilot/
    │   └── test-plan.prompt.md          # GitHub Copilot prompt file
    ├── references/
    │   └── requirement-checklist.md     # Gap-analysis checklist for requirements
    ├── scripts/
    │   └── fetch_jira.sh                # Bash script to fetch Jira issues via REST API
    └── template/
        └── test-plan-template.md        # Test plan markdown template
```

---

## 🚀 Getting Started

### Prerequisites

- **Jira API access** — You need a Jira account with API token access.
- **`jq`** (recommended) — For pretty-printing JSON output from the fetch script.
  ```bash
  brew install jq   # macOS
  ```

### 1. Fetch a Jira Ticket

Use the `fetch_jira.sh` script to pull ticket details over the Jira REST API v3:

```bash
cd testplan-creater-via-jira

export JIRA_BASE_URL="https://your-domain.atlassian.net"
export JIRA_EMAIL="your-email@example.com"
export JIRA_TOKEN="your-api-token"

./scripts/fetch_jira.sh VWO-49
```

The script returns a structured JSON object with key, summary, type, priority, components, labels, description, links, and attachments.

### 2. Generate a Test Plan

#### Option A — Claude Code / Cline (via SKILL.md)

The `SKILL.md` file is a self-contained agent skill. When you ask your agent:

> "Create a test plan for VWO-49 using the test-plan-generator skill"

The agent will:
1. Fetch the ticket via MCP or the `fetch_jira.sh` script
2. Analyze requirements against the gap-analysis checklist
3. Draft the test plan using the template
4. **STOP for human review** — the plan is never marked final without approval

#### Option B — GitHub Copilot (via prompt file)

Place `copilot/test-plan.prompt.md` in your repo at `.github/prompts/test-plan.prompt.md`. Then in VS Code Copilot Chat:

> `/test-plan VWO-49`

Copilot will follow the same workflow — fetch, analyze, draft, and stop for review.

---

## 🧪 Test Plan Generator — Workflow

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. FETCH the Jira ticket                            │
│     └─ Via Atlassian MCP / Jira REST API / Paste     │
│                                                     │
│  2. ANALYZE against the requirement checklist        │
│     └─ Flag gaps: missing ACs, ambiguous wording,    │
│        missing test data, env, a11y, security, etc.  │
│                                                     │
│  3. DRAFT the test plan                              │
│     └─ Scope & Objectives                            │
│     └─ Gaps & Questions for the author               │
│     └─ Test Scenarios (P0 / P1 / P2)                 │
│     └─ Test Data & Environment                       │
│     └─ Risks & Assumptions                           │
│     └─ Entry / Exit Criteria                         │
│                                                     │
│  4. STOP FOR HUMAN REVIEW  ←── MANDATORY GATE       │
│     └─ List assumptions made                         │
│     └─ List open questions                           │
│     └─ Ask: "Approve or edit before I continue"      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Guardrails

| Rule | Why |
|------|-----|
| Never mark the plan **final** | A human owns sign-off |
| Never fabricate acceptance criteria | A missing AC is a **finding**, not a blank to fill |
| Keep scenarios traceable | Each scenario maps to an AC or a gap |
| Stop for human review | Mandatory before writing test cases or automation |

---

## 📋 Gap-Analysis Checklist

The `references/requirement-checklist.md` covers 5 dimensions:

| Category | Checks |
|----------|--------|
| **Functional** | User story, testable ACs, happy path, negative paths, boundary states, state transitions |
| **Data & environment** | Test data, feature flags, dependencies, preconditions |
| **Non-functional** | Performance, security/roles, accessibility, i18n, audit/logging |
| **Cross-cutting** | Regression surface, backward compatibility, mobile/responsive, rollback |
| **Clarity** | Ambiguous wording, consistent terms, mockups/designs linked |

---

## 📝 Test Plan Template

The `template/test-plan-template.md` produces plans with 6 sections:

1. **Scope & Objectives** — What's in scope, out of scope, and the testing goal
2. **Gaps & Questions for the Author** — Table surfaced from gap analysis (⚠️ / ❌)
3. **Test Scenarios** — Prioritized (P0/P1/P2) with type, scenario, and AC mapping
4. **Test Data & Environment** — Data, flags, roles, permissions
5. **Risks & Assumptions** — What was assumed and what could go wrong
6. **Entry / Exit Criteria** — Gates for starting and completing testing

---

## 📄 Sample Output

See [`output/test-plan-VWO-49.md`](output/test-plan-VWO-49.md) for a real generated test plan covering:

- **Ticket:** VWO-49 — Add Passkey and SSO Login Options
- **14 gap findings** surfaced with questions for the author
- **20 test scenarios** (7 P0, 8 P1, 5 P2)
- Full HUMAN REVIEW GATE with assumptions and open questions

---

## 🔧 fetch_jira.sh — Script Reference

```bash
./scripts/fetch_jira.sh <ISSUE-KEY>
```

**Environment variables:**

| Variable | Description |
|----------|-------------|
| `JIRA_BASE_URL` | Your Jira instance URL (e.g. `https://yourco.atlassian.net`) |
| `JIRA_EMAIL` | Your Jira account email |
| `JIRA_TOKEN` | Your Jira API token |

**Required tools:** `curl`, `jq`

The script fetches the issue and returns a curated JSON object with:
`key`, `summary`, `type`, `priority`, `components`, `labels`, `fixVersions`, `description`, `links`, `attachments`

---

## 🤖 Using as an Agent Skill

### Claude Code

Place `testplan-creater-via-jira/` in your project. The `SKILL.md` frontmatter registers it. Ask:

> "Create a test plan for VWO-49"

### Cline / Roo Code / Other Agent Coders

Point the agent to the `SKILL.md` file or reference it in your CLAUDE.md. The agent will read the workflow, guardrails, and references to execute the plan generation.

### GitHub Copilot

Copy `copilot/test-plan.prompt.md` to `.github/prompts/test-plan.prompt.md` in your repo. Then use:

> `/test-plan VWO-49`

---

## 🛡️ Security

- API tokens are read from environment variables only — never hardcoded
- The `fetch_jira.sh` script never stores or logs credentials
- All plans are **DRAFT** until a human approves — no automated sign-off

---

## 📄 License

MIT — See [SKILL.md](testplan-creater-via-jira/SKILL.md) for details.

---

## ✍️ Author

**Pramod Dutta** — [The Testing Academy](https://thetestingacademy.com)
