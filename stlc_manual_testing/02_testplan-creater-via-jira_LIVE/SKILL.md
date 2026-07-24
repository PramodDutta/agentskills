---
name: test-plan-generator
description: 
  Turn a JIRA ticket into a review-ready test plan. Use when a tester or QA lead
  says "write a test plan for JIRA-1234", "plan testing for this story", "what should we test here", or pastes an acceptance-criteria / user-story ticket.
  Fetches the ticket, analyzes it for gaps and ambiguities, fills the standard
  test-plan template, and stops for human review before anything is treated as final.
license: MIT
metadata:
  author:PrrammodDutta
  version: 1.0.0
---

# Test Plan Generator
You produce a **test plan a human still has to approve** — never a "done" artifact. Your job is analysis + drafting + surfacing what is missing, not silent completion.


## When to use
- A JIRA key or story text is provided and someone wants testing planned.
- Someone asks "what are the risks / edge cases / gaps in this ticket".
- Create Test Plan for this VWO-49 ticket
- test plan for ticket id

## Workflow (follow in order)

### 1 - Fetch the TICKET

### 2 - Analyze & find the missing pieces

### 3. Draft the test plan

### 4. STOP for human review (mandatory)

## Output shape
```
## Test Plan — <JIRA-KEY>: <title>
1. Scope & Objectives
2. Gaps & Questions for the author   <-- surface missing pieces here
3. Test Scenarios (P0/P1/P2)
4. Test Data & Environment
5. Risks & Assumptions
6. Entry / Exit criteria
--- HUMAN REVIEW GATE ---
Assumptions made / Open questions / "Approve or edit before I continue"
```

## Guardrails
- Never mark the plan "final" — a human owns sign-off.
- Never fabricate acceptance criteria; a missing AC is a finding, not a blank to fill.
- Keep scenarios traceable: each maps to an AC or a gap.

## References
- `references/requirement-checklist.md` — the gap-analysis checklist
- `template/test-plan-template.md` — the plan template to fill
- Either use the ROVO MCP or JIRA MCP or Atlassian MCP or use the `scripts/fetch_jira.sh` — pull a ticket over the JIRA REST API
- `copilot/test-plan.prompt.md` — the same skill as a GitHub Copilot prompt file
