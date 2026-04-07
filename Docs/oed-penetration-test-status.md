# OED Penetration Test – Status Tracking

## Purpose
This document tracks findings from the Open Energy Dashboard (OED)
penetration testing report and maps them to current GitHub issues,
pull requests, and implementation status.

The goal is to:
- Show what has already been addressed
- Identify what is currently being worked on
- Highlight what still needs attention
- Help the team choose the next tasks efficiently

## Source
Open Energy Dashboard – Penetration Test Final Report (July 25, 2024)

## Status Legend
- ✅ **Done** — fix merged and reasonably validated
- 🟡 **In Progress** — issue and/or PR exists, work ongoing
- 🔴 **Not Started** — no implementation work yet
- ⚠️ **Design / Discussion Only** — discussed but not implemented

## Summary
- Total Findings: 19  
- ✅ Done: 15
- 🟡 In Progress: 4
- 🔴 Not Started: 0
- ⚠️ Design Only: 0

Note: “Upstream OED PR Evidence” refers to pull requests in the
official OpenEnergyDashboard/OED repository when applicable.

## Penetration Test Findings

| Problem # | Title | Severity | Team-5 Issue(s) | Upstream OED PR Evidence | Current Status | Owner | Notes / Remaining Work |
|-----------|------|----------|----------------|---------------------------|---------------|------|-------------------------|
| 1 | Insufficient Access Controls | Critical | Issue #118 | — | ✅ Done | Andrew | Access control enforcement implemented and validated through automated route authentication tests |
| 2 | Insecure Default Configuration | High | Team-5 tracking | OED PR #1554 | ✅ Done | Zack | Secure configuration changes implemented and submitted upstream for review |
| 3 | Cross-Site Scripting (XSS) | Medium | #69, #98 | OED PR #1544 | ✅ Done | Zach | XSS protections implemented and validated |
| 4 | Insecure Docker Configuration | Medium | #70, #99, PR #165 | — | ✅ Done | Oye | Dockerfile updated so web container runs as non-root `node` user to reduce privilege escalation risk |
| 5 | Hard-Coded Database Credentials | Medium | #71, #101, PR #168 | — | ✅ Done | Oye | Hard-coded credentials removed and replaced with environment-variable based secret injection. Docker initialization and CI pipeline updated to securely handle credentials. |
| 6 | Missing Content Security Policy | Medium | #72, #102 | OED PR #1567 | ✅ Done | Brian | Content Security Policy headers implemented and submitted for upstream review |
| 7 | Known Vulnerabilities in Software Components | Medium | Design docs | — | ✅ Done | Oye, Andrew | Patch management workflow created to track and update vulnerable dependencies |
| 8 | Insufficient Input Validation | Medium | #74, #106 | — | ✅ Done | Brian | Server-side validation implemented across multiple routes to prevent malformed input |
| 9 | File Upload Denial of Service | Medium | #75, #88 | — | ✅ Done | Krista | improve CSV upload gzip DoS protection by clarifying decompression limit failures and adding regression test coverage.
| 10 | Insecure Password Authentication | Minimal | #76, #108 | — | 🟡 In Progress | Zach | Authentication improvements and security validation ongoing |
| 11 | Insufficient Session Expiration | Low | Design PR #144, Team-5 PR #169 | — | ✅ Done | Oye | Implemented server-side session invalidation using `token_invalid_before` timestamp and JWT `iat` comparison. Logout now invalidates all previously issued tokens, preventing replay attacks. |
| 12 | Insufficient Brute Force Protection | Low | #78, PR #143 | — | ✅ Done | Zach | Login rate limiting implemented to mitigate brute-force attacks |
| 13 | Valid User Enumeration | Minimal | #79, #111 | — | ✅ Done | Andrew | Login response timing adjusted to prevent enumeration of valid users |
| 14 | Information Disclosure | Minimal | #80, #93 | — | ✅ Done | Zack | Improvements made to prevent sensitive information leakage |
| 15 | Clickjacking (UI Redress) | Low | #81, #113 | — | ✅ Done | Oye | Clickjacking protection implemented using CSP frame-ancestors and X-Frame-Options headers. |
| 16 | Log Injection | Minimal | #82, #114 | — | ✅ Done | Zach | Log sanitization implemented to prevent log injection |
| 17 | Session Tokens Stored in Local Storage | Low | #83, #115 | — | 🟡 In Progress | Krista | Migrating authentication tokens from local storage to secure cookies |
| 18 | Incorrect HTTP Response Codes | Minimal | #84, #116 | — | 🟡 In Progress | Andrew | Standardizing HTTP status codes returned by backend routes |
| 19 | Business Logic Issues | Minimal | #85, #117 | — | ✅ Done | Brian | Business logic validation and testing ongoing |
