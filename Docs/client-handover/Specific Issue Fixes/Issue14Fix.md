# Remediation for Security Report Issue 14 (Information Disclosure)

This document explains how the following pull request addresses Security Report Issue 14 (undue information disclosure):

- PR 1604: https://github.com/OpenEnergyDashboard/OED/pull/1604

The purpose of this remediation is to prevent internal backend error details from being exposed to clients while preserving useful diagnostics for site administrators through server-side logging.

## Security Problem Addressed

Issue 14 identifies risk from returning sensitive internal error data in API responses.

The key risks include:

- disclosure of stack traces or internal exception content
- leakage of database/internal implementation details
- increased attacker insight into backend behavior and failure modes

## Fix Strategy

PR 1604 applies a centralized error-handling approach so that clients receive generic, safe error responses while detailed technical information remains in server logs.

High-level behavior:

- internal errors are logged on the backend
- $500$-class responses are sanitized before being sent to clients
- malformed JSON still returns a correct $400$ response for request validation behavior

## PR 1604 Contribution (Undue Information Disclosure Mitigation)

Main changes:

- adds centralized global error handling in src/server/app.js
- updates shared failure response behavior in src/server/routes/response.js to return generic messages for server-side failures
- removes direct error-object disclosure in selected user route failures in src/server/routes/users.js
- sanitizes duplicate-group create failure output in src/server/routes/groups.js
- improves process-level error logging in src/server/log.js for unhandled rejections and uncaught exceptions
- updates tests in src/server/test/routes/responseParamsTest.js to verify generic $500$ responses

Representative response hardening:

- client-facing responses for internal failures now return a generic message such as:
  - Internal Server Error. Details are in the OED logs that are available to your site admin(s).
- detailed error objects remain available in backend logs for investigation

## Security Outcome

This PR reduces information disclosure risk by ensuring that:

- clients are not given raw internal error content
- diagnostic depth is retained for trusted operators through logs
- server behavior is more consistent across routes during unexpected failures

## Validation Checklist

After applying PR 1604, verify:

- API responses for unhandled internal exceptions do not include raw error objects or stack traces
- malformed JSON requests continue to return $400$ Bad Request
- duplicate-name group creation does not expose raw database constraint detail to clients
- user create/edit error responses remain generic and do not include embedded error payloads
- server logs still contain sufficient details for debugging operational failures
- updated route response tests pass

## Scope and Limitation

This fix addresses the direct response-level disclosure path identified in Security Report Issue 14. It does not by itself cover all possible information leakage channels (for example, verbose proxy errors, third-party middleware defaults, or external infrastructure logs), which should be reviewed as additional hardening work.
