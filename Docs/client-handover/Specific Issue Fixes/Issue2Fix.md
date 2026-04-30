# Unified Remediation for Security Report Issue 2

This document explains how the following pull requests work together as one fix for Security Report Issue 2 (insecure default configuration):

- PR 1554: https://github.com/OpenEnergyDashboard/OED/pull/1554
- PR 1615: https://github.com/OpenEnergyDashboard/OED/pull/1615

Together, these changes move OED from insecure-by-default behavior toward secure-by-default behavior for production deployments while preserving a supported developer workflow.

## Security Problem Addressed

Issue 2 identifies risk from insecure defaults, especially when production environments run with development-style settings or placeholder secrets.

The key risks include:

- predictable or placeholder authentication secret values
- weak default database credentials
- accidental deployment in development mode

## Unified Fix Strategy

The remediation is intentionally split into two PRs that form one end-to-end solution:

- PR 1554 hardens secret and credential initialization and adds safer install-time behavior.
- PR 1615 separates developer overrides into a dedicated Docker compose file to reduce accidental insecure production configuration.

Combined effect:

- production paths default to secure runtime-generated credentials when placeholders are detected
- development behavior is explicitly opt-in through a second compose file
- installer logic validates environment mode and warns on dangerous combinations

## PR 1554 Contribution (Credential and Secret Hardening)

Main changes:

- updates docker compose env handling so values can be externally supplied and checked during install
- adds install-time generation of strong random values in production for:
  - OED_TOKEN_SECRET (if missing or placeholder)
  - PostgreSQL and OED DB user passwords (if default placeholders are detected)
- introduces password-rotation utility at src/server/util/changePostgresPass.js
- adds npm script entry for password changes in package.json
- improves environment loading behavior in src/server/config.js so newest .env values are used
- tightens production/development mode detection in src/scripts/installOED.sh

Security outcome from PR 1554:

- prevents production from continuing with known placeholder secrets
- reduces risk of token forgery or unauthorized database access caused by weak defaults

## PR 1615 Contribution (Configuration Separation)

Main changes:

- introduces docker-compose-dev.yml for developer-only overrides
- keeps base docker-compose.yml focused on site/default deployment behavior
- requires developers to explicitly opt into development mode by composing both files
- adds installer warnings for unsafe or inconsistent combinations of:
  - OED_PRODUCTION
  - OED_DOCKER_CONFIG_DEV

New development startup pattern:

- docker compose -f docker-compose.yml -f docker-compose-dev.yml up

Security outcome from PR 1615:

- reduces risk that a production deployment runs with development configuration by accident
- creates a clearer boundary between production-safe defaults and developer convenience settings

## Why These Two PRs Should Be Treated as One Fix

Either PR alone leaves a gap:

- without PR 1554, configuration separation still leaves risk from weak/default secret values
- without PR 1615, secret hardening still leaves higher risk of accidental insecure mode selection

Together they provide defense in depth:

- secure value generation and credential hardening
- explicit mode separation and safer operator workflow
- warnings and checks to catch misconfiguration earlier

## Operational Notes

- Existing deployments should review .env values after upgrade and confirm secure non-placeholder credentials.
- Teams should update runbooks and local developer onboarding docs to include the two-file compose command for development.
- Any automation that starts development mode should be updated to use docker-compose-dev.yml.

## Validation Checklist

After applying both PRs, verify:

- production install does not keep placeholder OED_TOKEN_SECRET
- production install does not keep placeholder POSTGRES_PASSWORD/OED_DB_PASSWORD
- development mode is started via docker-compose-dev.yml override
- installer warnings appear when production/development flags conflict
- application starts successfully in both production and development workflows

## Scope and Limitation

This unified fix addresses the insecure default configuration pathway identified in Security Report Issue 2. It does not replace broader hardening practices (for example, secret management policy, runtime network policy, or external credential vaulting), which remain recommended as additional defense layers.
