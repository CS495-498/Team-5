# Research & Design Proposal

**Issue 11 – Insufficient Session Expiration (CWE-613)**

## 1. Introduction

This document proposes a technical design to improve **session expiration handling** in the Open Energy Dashboard (OED) authentication system.

The issue arises from how session tokens (JWTs) are handled during logout and expiration, allowing previously issued tokens to remain valid server-side even after a user logs out.

Although the severity is classified as *Low*, the impact on confidentiality and integrity is *Medium*, and the weakness aligns with **OWASP Top 10 2021 – A07: Identification and Authentication Failures**.


## 2. Current Behavior

OED currently uses **stateless JSON Web Tokens (JWTs)** as session tokens:

- Tokens are stored client-side (browser storage).
- Tokens expire after ~24 hours (`exp` claim).
- On logout:
  - The client deletes the token locally.
  - The server **does not invalidate the token**.

### Resulting Risk

If an attacker obtains a valid JWT:

- The token can still be used after logout.
- Access continues until natural expiration.
- The attacker gains the same privileges as the user.


## 3. Security Goal

Ensure that **logging out invalidates session tokens server-side**, not only client-side.

After logout:

- Previously issued tokens must be rejected.
- Stolen tokens must become unusable immediately.


## 4. Design Options Considered

### Option A – Token Revocation List (jti blacklist)

- Add a `jti` (token ID) to JWTs.
- Store revoked token IDs in a database or Redis.
- Check the blacklist on each request.

**Drawbacks**

- Requires storing many revoked tokens.
- Cleanup required after expiration.
- Increased operational complexity.


### Option B – “Not-Valid-Before” Timestamp per User (Recommended)

Each user record stores a timestamp indicating when tokens become valid.

Tokens issued **before** this timestamp are rejected.

**Advantages**

- Only **one database field per user**
- No token storage required
- Instantly invalidates prior sessions
- Simple to implement
- Scales efficiently


## 5. Proposed Design

### Core Idea

Add a timestamp field to each user:


```
   token_invalid_before TIMESTAMP NOT NULL DEFAULT NOW();
```


* Any JWT issued **before** this time is rejected.

## **6\. Technical Design**

### **6.1 Database Change**

Add a new column to the users table:

```
ALTER TABLE users
ADD COLUMN token_invalid_before TIMESTAMP NOT NULL DEFAULT NOW();
```

**Upgrade behavior:**  

During deployment, a database migration will sets:

    ```
    UPDATE users
    SET token_invalid_before = NOW();
    ```
    
for all existing users, forcing a one-time re-login. 
New users are unaffected since their tokens are issued after account creation.


### **6.2 JWT Validation Logic (Server Middleware)**

For each authenticated request:

1. Verify JWT signature

2. Verify expiration (exp)

3. Extract:

   * user ID

   * issued at time (iat)

4. Load user from Database

5. Compare:  
     
       `if token.iat < user.token_invalid_before` → reject (401 Unauthorized)
   

### **6.3 Logout Endpoint Behavior**

Current logout:

* Removes token from browser only

Proposed logout:

1. Client removes token

2. Client calls:

    `POST /api/logout`

3. Server updates:  
   ```
   UPDATE users
   SET token_invalid_before = NOW()
   WHERE id = :user_id;
   ```
Result:

* All previous tokens become invalid immediately.

## **7\. Security Benefits**

| Threat |   Before | After |
| :---- | :---- | :---- |
| Token theft |   Works until expiry | Immediately invalid |
| Replay attacks |   Succeeds |  Fails |
| Account takeover |   Possible | Greatly reduced  |

## **8\. Testing Plan**

### **Reproduce original vulnerability**

1. Login

2. Capture /api/verification request

3. Replay using curl → success

4. Logout

5. Replay again

### **Expected result**

Step 5 should return:

          401 Unauthorized

### **Additional tests**

* New login token works

* Expired token fails

* Multiple devices → all sessions invalidated after logout


### **Future work**
* Automated tests should be added to the OED test suite to verify:
	*   Tokens issued before logout are rejected
	*	New tokens remain valid
	*	Session invalidation behaves correctly across deployments
  

## **9\. Acceptance Criteria**

* JWTs issued before logout are rejected server-side

* Replay attack no longer succeeds

* Logout endpoint updates server state

* Session invalidation verified by tests
  

## **10\. Conclusion**

The proposed **Not-Valid-Before timestamp approach** provides a clean, scalable, and secure solution to OED’s insufficient session expiration vulnerability.

It directly mitigates CWE-613, aligns with OWASP recommendations, and significantly improves session security with minimal architectural change.

## **11\. References**

\[1\] MITRE, “CWE-613: Insufficient Session Expiration.” [https://cwe.mitre.org/data/definitions/613.html](https://cwe.mitre.org/data/definitions/613.html)

\[2\] OWASP Foundation, “OWASP Top 10 – A07: Identification and Authentication Failures [(2021).” https://owasp.org/Top10/A07\_2021-Identification\_and\_Authentication\_Failures/](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)

\[3\] OWASP Foundation, “Session Management Cheat Sheet.” [https://cheatsheetseries.owasp.org/cheatsheets/Session\_Management\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

\[4\] OWASP Foundation, “JSON Web Token (JWT) Cheat Sheet.” [https://cheatsheetseries.owasp.org/cheatsheets/JSON\_Web\_Token\_for\_Java\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

\[5\] Jones, M., Bradley, J., & Sakimura, N., “JSON Web Token (JWT), RFC 7519,” IETF, 2015\. [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519)

\[6\] NIST, “Digital Identity Guidelines – Authentication and Lifecycle Management (SP 800-63B).” [https://pages.nist.gov/800-63-3/sp800-63b.html](https://pages.nist.gov/800-63-3/sp800-63b.html)

