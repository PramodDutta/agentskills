---
name: pw-locator-fixer
description: >-
  Scans a Playwright spec or Page Object for brittle locators and rewrites them
  to resilient ones. Use when an SDET says "fix these locators", "my selectors
  are flaky", "replace XPath with getByRole", "make these locators resilient",
  or pastes code full of nth-child/CSS-class/text selectors. Produces a before/
  after rewrite map plus patched code - the engineer verifies each swap.
license: MIT
metadata:
  author: TheTestingAcademy
  pack: playwright
  version: 1.0.0
---

# PW Locator Fixer
You audit locators and **propose resilient replacements the engineer must verify** against the live DOM - a swap that reads well can still target the wrong node.

## When to use
- A spec/POM uses XPath, `nth-child`, CSS-class, or raw-text selectors.
- Tests fail intermittently on element lookups.
- Someone says "fix/harden/de-flake these locators".
- If the user is asking, "Fix my locator for this page" 
- Fix my locator for this page. Fix it, please. Fix this test case. 
- Fix this error, fix this XPath, fix the CSS selector, fix the CSS selector of this element. 
- fix is the locator of a testcase. 


## Workflow

1. **Scan** the provided code and flag every brittle locator:
   - XPath (`//div[...]`), `page.locator('.some-class')`, `:nth-child`, deep CSS descendant chains, index-based `.nth(3)`, and unanchored text matches.

2. **Classify severity** of each flagged locator so the engineer can prioritize:
   - `HIGH` - index-based or position-based (`nth-child`, `.nth()`, `>` chains): breaks on any DOM reorder.
   - `MEDIUM` - styling-class or auto-generated class selectors (`.btn-primary`, `.css-1x2y3z`): breaks on redesign or CSS-in-JS rebuild.
   - `LOW` - raw text without role anchor (`page.locator('text=Submit')`): breaks on copy change or i18n.

3. **Inspect the live DOM before proposing a replacement.** Never rewrite blind:
   - If a URL is available, open the page (Playwright MCP browser tools or `npx playwright codegen <url>`) and snapshot the target element's accessible role, name, label, and `data-testid`.
   - If no URL, ask the user to paste the element's outer HTML. Mark any locator rewritten without DOM evidence as `UNVERIFIED` in the output.

4. **Rewrite each locator using this priority order** (stop at the first that uniquely matches):

   1. `getByRole(role, { name })` - resilient and accessibility-aligned.
   2. `getByLabel()` / `getByPlaceholder()` - for form fields.
   3. `getByText()` with exact match - only for non-interactive elements.
   4. `getByTestId()` - when no accessible handle exists; propose adding `data-testid` to the app code if missing.
   5. Scoped CSS via a stable parent (`page.locator('#checkout').getByRole(...)`) - last resort, never bare classes.

5. **Verify uniqueness** of every replacement: each new locator must resolve to exactly one element. Check with `locator.count() === 1` on the live page, or state clearly that the check was not run.

6. **Patch the code** - apply the swaps in place, keeping formatting and surrounding logic untouched. One locator change per line; no drive-by refactors.

7. **Report** the before/after rewrite map (see Output shape) and list any locator you could NOT confidently fix, with the reason (dynamic id, canvas element, shadow DOM, iframe) and a suggested next step.

8. **Re-run the affected tests** if the repo and command are available (`npx playwright test <file>`). Paste the pass/fail result. If tests cannot be run, say so explicitly - never imply the swaps were validated.

## Output shape

Return two blocks:

1. **Rewrite map** - a table:

   | # | Old locator | New locator | Severity | Verified? | Why safer |
   |---|-------------|-------------|----------|-----------|-----------|
   | 1 | `page.locator('.btn-primary')` | `page.getByRole('button', { name: 'Checkout' })` | MEDIUM | ✅ live DOM | Role+name survives class/CSS changes |

2. **Patched code** - the full updated spec/POM in a code block, ready to paste.

If anything is `UNVERIFIED`, list it under a **Needs manual check** heading with the exact step the engineer should run.

## Guardrails

- Never invent an accessible name, label, or `data-testid` - only use values observed in the DOM or provided by the user.
- Do not change test logic, assertions, waits, or timeouts - locators only.
- Do not "fix" a locator by broadening it (`.first()`, regex-anything) - that hides flakiness instead of removing it.
- If two elements share the same role+name, scope through a stable ancestor rather than falling back to index.
- Shadow DOM and iframes need `frameLocator()` / piercing awareness - flag them, do not silently guess.
- The engineer owns final verification. Always end with the list of swaps that still need a human check.