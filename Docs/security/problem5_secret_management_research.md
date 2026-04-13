# Research – Secure Handling of Database Credentials and Environment Secrets

## 1. Purpose
This research focuses specifically on secret-management architecture within containerized OED deployments and does not evaluate unrelated application-level vulnerabilities.

- Penetration Test Problem #5 – Hard-coded database credentials  
- Issue #1569 – Eliminating `.env` usage and improving secure secret handling  

### Goals of this research
- Understand how OED currently manages credentials and secrets  
- Identify security risks and architectural limitations  
- Explore secure design directions prior to formal implementation  

### 1.1 Research Methodology
This research was conducted through:

- Repository code analysis  
- Penetration-test finding review  
- Security-standards comparison (OWASP, NIST, CWE)  
- Architectural evaluation of container-based secret-management approaches  

No production system modifications were performed during this phase.

---

## 2. Background: Penetration Test Problem #5

The penetration test reported that:

- OED creates a database user `oed` with a **hard-coded password (`opened`)**  
- These credentials are visible in **public source code**  

If the database becomes reachable, an attacker could:

- Read all stored database data  
- Modify or delete records  
- Extract emails or password hashes and pivot to other systems  

Although the database is not externally exposed by default, the issue is rated **Medium severity** because:

- Credentials are publicly discoverable  
- Misconfiguration could expose the database  
- Default values may remain unchanged in real deployments  

This finding aligns with **CWE-259: Use of Hard-coded Password**.

---

## 3. Current Secret and Configuration Handling in OED

### 3.1 `.env` File Support
OED currently supports a root `.env` configuration file:

- `src/server/config.js` loads `.env` using **dotenv**  
- `src/scripts/installOED.sh` sources `.env` if present  

This creates multiple secret locations, increasing:

- Configuration complexity  
- Risk of accidental exposure  
- Difficulty transitioning to secure storage  

---

### 3.2 Secrets Stored in Environment Variables

Sensitive values defined in `docker-compose.yml` and accessed via `process.env` include:

- `OED_DB_PASSWORD`  
- `POSTGRES_PASSWORD`  
- `OED_TOKEN_SECRET`  
- `OED_MAIL_CREDENTIAL`  

These values are often:

- Stored in plaintext  
- Included in configuration examples  
- Potentially reused in production deployments  

---

### 3.3 Hard-Coded Database Credentials

Database initialization script:
containers/database/init.sql
CREATE USER oed WITH SUPERUSER PASSWORD ‘opened’;
---

### 3.4 JWT Secret Usage

OED uses `OED_TOKEN_SECRET` to sign JSON Web Tokens (JWTs).

**Security implication:**  
Exposure would allow attackers to **forge authentication tokens and impersonate users**.

---

### 3.5 Database Credential Usage

OED relies on:

- `OED_DB_PASSWORD`  
- `POSTGRES_PASSWORD`  

Security implication:  
Default or exposed credentials could enable **complete database compromise**.

---

### 3.6 Mail Credential Usage

`OED_MAIL_CREDENTIAL` stores SMTP authentication secrets.

If exposed, attackers could:

- Send unauthorized emails  
- Impersonate the organization  
- Conduct phishing or spam attacks  

---

## 4. Confidential Secret Inventory

| Secret | Purpose | Risk |
|--------|---------|------|
| OED_DB_PASSWORD | Database authentication | High |
| POSTGRES_PASSWORD | PostgreSQL superuser | High |
| Hard-coded `opened` | DB initialization | **Critical** |
| OED_TOKEN_SECRET | JWT signing | **Critical** |
| OED_MAIL_CREDENTIAL | SMTP authentication | High |

### Key Observations
- Secrets are **distributed**, not centralized  
- Hard-coded defaults exist  
- Environment variables are **not encrypted**  
- High-impact secrets lack stronger protection  

---

## 5. Research of Secure Secret-Storage Options

### Option A — Remove `.env` and Use Docker Overrides
**Pros**
- Reduces duplicate secret locations  

**Cons**
- Secrets remain plaintext  
- Does not fully resolve Problem #5  

---

### Option B — Docker Secrets / File-Based Secrets
**Pros**
- Removes secrets from source control  
- Aligns with container security best practices  

**Cons**
- Requires code updates  
- Adds deployment complexity  

---

### Option C — External Secret Manager (“Vault”)

Examples:

- HashiCorp Vault  
- AWS Secrets Manager  
- Azure Key Vault  
- Google Secret Manager  

**Pros**
- Strongest security model  
- Centralized rotation and auditing  

**Cons**
- Additional infrastructure  
- Higher operational complexity  

---

## 6. Relationship Between Issue #1569 and Problem #5

- Issue #1569 removes `.env`-based secret handling  
- Problem #5 eliminates hard-coded credentials  

A **secure secret-delivery mechanism** would resolve both simultaneously.

---

## 7. Alignment with Default-Value Enforcement (PR #1554)

Recent work introduced:

- Prevention of insecure default credentials in production  
- Automatic random credential generation  

This raises architectural questions:

- Where are generated secrets stored persistently?  
- How are they retrieved after container restart?  
- Should OED generate secrets or should a vault provide them?  

Two possible models:

- **Model A — Vault as Source of Truth**  
- **Model B — OED Generates Secrets and Writes Back to Vault**  

---

## 8. Distinction Between Port Exposure and Secret Management

Security analysis must distinguish between:

- **Secret confidentiality issues** (passwords, JWT keys)  
- **Port/debug configuration risks** (Docker exposure)  

Port configuration:

- Does **not** involve secret leakage  
- Represents **production misconfiguration risk**  

Likely mitigation:

- Separate development Docker configuration  
- Production enforcement safeguards  

Vault integration is **not required** for port security.

---

## 9. Proposed Phased Security Direction (Pre-Design)

### Phase 1 — Secret Centralization
- Remove hard-coded credentials  
- Consolidate secrets into Docker configuration  
- Eliminate duplicate `.env` handling  

### Phase 2 — Secret Abstraction
- Replace plaintext defaults with injected secrets  
- Evaluate Docker Secrets for initial secure storage  

### Phase 3 — Advanced Secret Management (Optional)
- Integrate external secret manager (e.g., Vault)  
- Implement rotation, audit logging, and centralized control  

---

## 10. Conclusion

Research confirms that **OED’s current credential-handling approach presents measurable security risk** under realistic deployment misconfiguration scenarios.

Confirmed conditions include:

- Storage of sensitive credentials in plaintext  
- Presence of hard-coded database passwords  
- Absence of centralized secret-management architecture  

Recent improvements such as **randomized default credential enforcement** provide a foundation, but do not fully resolve the underlying architectural weakness.

**Next phase:**  
Transition from **research → formal security design** implementing a **centralized, auditable, deployment-appropriate secret-management strategy**.

---

## References

1. [MITRE — CWE-259: Use of Hard-coded Password](https://cwe.mitre.org/data/definitions/259.html)  
2. [OWASP Top 10 (2021)](https://owasp.org/Top10/)  
3. [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)  
4. [NIST SP 800-63 Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)  
5. [Docker Secrets Documentation](https://docs.docker.com/engine/swarm/secrets/)  
6. [HashiCorp Vault Documentation](https://developer.hashicorp.com/vault/docs)  



















