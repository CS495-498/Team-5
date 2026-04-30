# Secure Logging Design Document

## Scope of Impact

The following application areas were identified as vulnerable to log injection and unsafe log rendering:

* /api/obvius (any request method)  
* POST /api/meter/addMeter  
* POST /api/logs/\*  
* POST /api/csv/readings  
* Error email generation script  
  (/src/server/services/sendLogEmail.js)

These vulnerabilities require significant skill in logging structures, however, are easy to discover and reproduce. 

## Root Cause Analysis

Across all affected areas, the vulnerabilities stem from the same underlying design flaws:

1. User-controlled data is logged without sanitization  
2. Newline and control characters are not removed  
3. Logs are constructed via string concatenation  
4. Logs are rendered as HTML without escaping

## Known Issues Discovered

These code snippets appear multiple times and allow characters like newline to be added. It also allows HTML/script tags.

const ip \= req.headers\['x-forwarded-for'\] || req.connection.remoteAddress;  
log.error(\`Obvius protocol request from ${ip} failed due to ${reason}\`);

This specific code snippet allows user-controlled parameters allowing logs to be injected and forged. 

s \+= \`\\tGot ${paramName}: ${req.param(paramName)}\\n\`;  
log.info(s);

Escaping is applied before rendering which is good but it also needs to be applied before logging

reason \= escapeHtml(reason);

In log entries like these:

* log.error(\`Obvius protocol request from ${ip} failed due to ${reason}\`);  
* log.info(\`Received ${fx.fieldname}: ${fx.originalname}\`);  
* log.warn(\`Logfile Upload had issues from ip: ${ip}\`, err);

User input can be embedded directly into the log message without sanitization and parameterization. 

Somewhere logs are stored and then rendered as HTML, which allows any potential malicious log entries to run as a script. 

## Manual Validation Strategy

After remediation:

- [ ] Attempt newline injection in meter names  
- [ ] Inject HTML into headers and parameters  
- [ ] Confirm logs remain single-line entries  
- [ ] Verify HTML emails render escaped content  
- [ ] Validate no script execution occurs

 