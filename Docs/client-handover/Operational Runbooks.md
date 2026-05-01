

Open Energy DashBoard (OED)  
Operational Runbooks

Prepared by: BSU Security Team  
Andrew, Brian, Krista, Oye, Zach B., Zack S.  
Ball State University  
Mentor: Steve Huss-Lederman  
\[4/27/2026\]

This runbook outlines common operational procedures for maintaining, troubleshooting, and recovering the application in a development or deployment environment.

### Restarting the Application

If the application becomes unresponsive or requires a refresh, follow these steps:

1. Stop all running containers:  
   docker compose down  
2. Restart the application services:  
   docker compose up  
3. Monitor the terminal output to ensure all services start successfully  
4. Verify the application is accessible at http://localhost:3000  
5. Check logs for any startup errors or warnings

### Investigating Errors

When an error occurs in the application:

1. Review application logs in the terminal where the services are running  
2. Identify the specific request, endpoint, or user action associated with the issue  
3. Trace the error through the relevant route or service logic in the codebase  
4. Look for common issues such as:  
   * Invalid inputs or missing parameters  
   * Failed API calls  
   * Server-side exceptions  
5. Apply fixes and restart the application if necessary

### Handling High Traffic or Abuse

In cases of unusually high traffic or suspected abuse:

1. Monitor request patterns and rate-limiting metrics  
2. Check logs for:  
   * Repeated failed requests  
   * Rapid or automated traffic patterns  
3. Identify potential sources (IP addresses or endpoints)  
4. Adjust rate-limiting configurations if needed  
5. Restart services to apply configuration changes if applicable

### Database Issues

If database-related errors occur:

1. Confirm the database container is running:  
   docker ps  
2. Verify database connection settings (host, port, credentials)  
3. Check logs for database-specific errors  
4. Restart the database service if needed:  
   docker compose restart  
5. If issues persist, rebuild containers:  
   docker compose down \-v  
   docker compose up

