# VWO — Test Plan — VWO-49: Add Passkey and SSO Login Options to VWO Login Page

> **Status:** DRAFT — pending human review. Not approved until a QA owner signs off.
>
> **Ticket:** [VWO-49](https://bugzz.atlassian.net/browse/VWO-49) (Story, Priority: Medium, Status: To Do)
> **Author:** Pramod
> **Created:** 2026-04-19

---

## 1. Scope & Objectives

- **In scope:**
  - UI visibility of the two new login buttons on the VWO login page
  - SSO login flow — successful auth + error handling
  - Passkey login flow — successful auth + fallback when no passkey registered
  - Error handling for failed SSO, failed passkey, unsupported browser/device
  - Compatibility across supported browsers, devices, and SSO identity providers
  - Security compliance of all authentication flows

- **Out of scope:**
  - Existing login methods (email/password, Google) — regression only, no feature-level testing
  - Backend identity provider configuration or IdP setup
  - Performance/load testing (unless explicitly required later)
  - User registration/enrollment flows for passkeys

- **Objective:** Verify that both SSO and Passkey login options render correctly, authenticate successfully on happy paths, degrade gracefully on failures, and meet security standards.

---

## 2. Gaps & Questions for the Author

| # | Area | Finding | Question to Author |
|---|------|---------|-------------------|
| 1 | Negative paths | ⚠️ Partial | Which specific invalid SSO credential scenarios should be tested (expired token, revoked access, wrong IdP, malformed SAML response)? |
| 2 | Boundary / empty states | ❌ Missing | What happens when a user has zero registered passkeys? Is the Passkey button hidden, disabled, or shown with a fallback flow? |
| 3 | State transitions | ⚠️ Ambiguous | After a failed SSO attempt, is the user returned to the login page with an error inline, or redirected elsewhere? |
| 4 | Test data | ❌ Missing | Which test SSO providers/IdPs will be available in the test environment? Do we need mock IdP endpoints? |
| 5 | Environment / flags | ❌ Missing | Is this behind a feature flag? Which environments (dev/staging/prod) will support passkey and SSO initially? |
| 6 | Security | ⚠️ Vague | AC #6 says "must follow security standards" — which specific standards? OWASP? Internal policy? Any specific auth tokens, session handling, or MFA requirements? |
| 7 | Accessibility | ❌ Missing | Are there any a11y requirements for the new buttons (keyboard navigation, screen reader labels, focus order)? |
| 8 | Internationalization | ❌ Missing | Do SSO/Passkey button labels need to support localization? |
| 9 | Audit/Logging | ❌ Missing | Should successful and failed SSO/Passkey logins be logged differently from email/password logins? Any specific audit trail requirements? |
| 10 | Regression surface | ❌ Missing | Is there any expected impact on the existing "Sign in with Google" flow or the email/password form? |
| 11 | Mobile/responsive | ⚠️ Ambiguous | Passkey mention "supported browsers/devices" — what is the minimum OS/browser matrix? Is mobile Safari (iOS) with iCloud Keychain passkey in scope? |
| 12 | Rollback | ❌ Missing | If a critical issue is found mid-release, what is the rollback plan for the feature-flag or code? |
| 13 | Mockups/designs | ❌ Missing | Are there Figma/design specs showing exact button placement, sizing, colors, and responsive behavior? |
| 14 | Ambiguous wording | ⚠️ | AC says "appropriate error messages" — can we get the exact error message copy for each failure scenario? |

---

## 3. Test Scenarios

### P0 — Core Functionality (blocking)

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-01 | P0 | Positive — UI | Verify "Sign in using SSO" and "Sign in with Passkey" buttons are visible on the login page below "Sign in with Google" | AC-1 |
| TS-02 | P0 | Positive — SSO | Click "Sign in using SSO", provide valid SSO credentials -> user authenticated and redirected to dashboard | AC-2 |
| TS-03 | P0 | Positive — Passkey | Click "Sign in with Passkey", verify registered passkey -> user logged in and redirected to dashboard | AC-3 |
| TS-04 | P0 | Negative — SSO | Click "Sign in using SSO", provide invalid SSO credentials -> appropriate error message displayed, not authenticated | AC-2, AC-4 |
| TS-05 | P0 | Negative — Passkey | Click "Sign in with Passkey" when no passkey registered -> fallback/guidance message displayed | AC-3 |
| TS-06 | P0 | Negative — Unsupported | Attempt passkey login on an unsupported browser/device -> appropriate error or graceful degradation | AC-4, AC-5 |
| TS-07 | P0 | Negative — Passkey fail | Registered passkey exists but verification fails (cancel, wrong biometric) -> error message, user stays on login page | AC-3, AC-4 |

### P1 — Compatibility & Edge Cases

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-08 | P1 | Positive — SSO | SSO login across at least 2 identity providers (if multiple configured) | AC-5 |
| TS-09 | P1 | Compatibility | Passkey login on Chrome (macOS/Windows), Safari (macOS/iOS), Edge (Windows) | AC-5 |
| TS-10 | P1 | Boundary | User has multiple passkeys registered -> should be able to select which to use | Gap-2 |
| TS-11 | P1 | Negative — SSO | SSO provider returns a SAML/OIDC error -> user sees a clear error, can retry | AC-4 |
| TS-12 | P1 | Regression | Existing "Sign in with Google" and email/password flows still work after new buttons added | Gap-10 |
| TS-13 | P1 | Security | All auth requests go over HTTPS; tokens/sessions handled securely | AC-6 |
| TS-14 | P1 | UI | Buttons render correctly at common viewport sizes (375px, 768px, 1440px) | Gap-11 |
| TS-15 | P1 | Negative — Network | Initiate SSO/Passkey login then simulate network loss -> graceful timeout and error message | AC-4 |

### P2 — Secondary

| ID | Priority | Type | Scenario | Maps to |
|----|----------|------|----------|---------|
| TS-16 | P2 | Negative — SSO | Rapid repeated clicks on "Sign in using SSO" -> no duplicate auth requests or crashes | AC-2 |
| TS-17 | P2 | Negative — Passkey | Close passkey dialog mid-verification -> login page remains, no partial state | AC-3 |
| TS-18 | P2 | UI | Keyboard navigation: Tab through all login buttons in correct order | Gap-7 |
| TS-19 | P2 | UI | Screen reader announces "Sign in using SSO" and "Sign in with Passkey" correctly | Gap-7 |
| TS-20 | P2 | Security | Auth tokens from SSO/Passkey do not persist beyond session expiry | AC-6 |

---

## 4. Test Data & Environment

- **Data needed:**
  - Valid SSO credentials for each configured IdP (test accounts)
  - Invalid/expired SSO credentials
  - Device(s) with at least one registered passkey
  - Device(s) with zero registered passkeys
  - Unsupported browser/device for passkey verification

- **Environment / flags:**
  - Feature flag name: **TBD** (ask author — Gap-5)
  - Initial rollout targets: **TBD** (ask author — Gap-5)
  - At minimum: one staging environment with SSO IdP mock or real test IdP

- **Roles / permissions:**
  - Standard user account (non-admin) should be sufficient
  - Admin/SSO-config access should NOT be needed on the app side

---

## 5. Risks & Assumptions

- **Assumptions made:**
  - SSO IdP(s) are already configured and available in the test environment
  - Passkey support relies on browser/platform WebAuthn APIs (already available in modern browsers)
  - The feature is feature-flagged and can be toggled independently
  - Design mockups exist but were not linked in the ticket

- **Risks:**
  - **Passkey browser fragmentation** — WebAuthn support varies; older browsers/safari private mode may behave unexpectedly
  - **SSO IdP availability** — test environment may not have all production IdPs configured, limiting SSO compat coverage
  - **Security review scope** — AC #6 is vague; a late security audit could add unplanned work
  - **Regression on existing login** — new UI elements could shift/resize existing buttons; need visual regression checks

---

## 6. Entry / Exit Criteria

- **Entry:**
  - Feature branch deployed to test environment
  - Feature flag enabled for test accounts
  - Test SSO IdP credentials available
  - Devices with passkey support provisioned
  - All open questions from Section 2 answered

- **Exit:**
  - All P0 scenarios pass
  - P1 scenarios pass or have documented, accepted workarounds
  - No critical/high security defects open
  - QA owner signs off on the test run

---

## HUMAN REVIEW GATE

- **I assumed:**
  - SSO IdPs are pre-configured in the test environment
  - Feature is behind a feature flag
  - Design mockups exist but were not linked in the ticket

- **I could not confirm:**
  - Exact error message copy for each failure scenario
  - The list of supported browsers/devices for passkeys
  - Which SSO identity providers will be available for testing
  - Whether accessibility (a11y) is in scope

- **Open questions blocking sign-off:**
  - Are mock IdP endpoints available, or do we test against real providers?
  - Should automated visual regression tests cover the new buttons?
  - Is there a specific accessibility (WCAG) target level?

- ▶ **Approve, or edit, before I write detailed test cases / automation.**
