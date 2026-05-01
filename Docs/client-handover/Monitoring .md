

Open Energy DashBoard (OED)  
Monitoring Overview

Prepared by: BSU Security Team  
Andrew, Brian, Krista, Oye, Zach B., Zack S.  
Ball State University  
Mentor: Steve Huss-Lederman  
\[4/27/2026\]

## Overview

This document describes the logging and monitoring capabilities implemented within the Open Energy Dashboard (OED). These systems provide visibility into application behavior, support debugging, and help identify abnormal or potentially malicious activity. Monitoring is primarily achieved through structured logging, metric aggregation, and dashboard-based visualization.

## Log Architecture

The OED application uses a structured logging approach to capture information about requests and system events as they occur. Logging is handled directly within the application and then forwarded through a centralized pipeline for aggregation and visualization.

At the application level, logging is implemented using Winston. Logs are created at key points in the codebase, such as the start of a route, during authentication attempts, and when errors occur. Each log entry is formatted as a structured object rather than plain text, which makes it easier to work with downstream.

Once generated, logs are forwarded to Loki, which acts as the central aggregation layer. Loki stores the logs and allows them to be queried over time. Because logs are structured, fields such as event type, status code, and route can be filtered and grouped when analyzing system behavior.

Grafana is used on top of Loki to visualize this data. Dashboards are configured to display trends such as login activity, rate limiting events, and status code distribution. This makes it easier to identify patterns that would be difficult to see by looking at raw logs alone.

## Log Structure

Logs are structured as JSON objects to ensure consistency and ease of parsing.  
The system uses standard logging levels to categorize events:

* Info – general application activity  
* Warn – abnormal or potentially harmful behavior (e.g., rate limiting)  
* Error – system or application failures

Each log entry may include:

* Event type  
* Timestamp  
* Route/endpoint  
* Status code  
* Request-specific data (e.g., username, IP address where applicable)

Example:  
{  
 "event": "auth.login.failed",  
 "timestamp": "2026-03-01T12:00:00Z",  
 "route": "/login",  
 "statusCode": 401,  
 "username": "example\_user"  
}

## Metrics

In addition to raw logs, the system uses derived metrics to better understand how the application is behaving over time. These metrics are generated from log data in Loki and queried to identify trends, patterns, and potential issues.

Rather than tracking metrics separately, the approach taken was to structure logs in a way that allows them to be aggregated into meaningful metrics. This makes it possible to monitor system activity without maintaining a separate metrics service.  
Some of the key metrics tracked include:

* **Request rate**  
  Measures how frequently the application is being accessed over a given time window. This helps identify spikes in traffic or unusual usage patterns.  
    
* **Login attempts and rate limiting events**  
  Tracks how often authentication attempts occur, as well as how frequently rate limits are triggered. This is especially useful for identifying potential brute force or credential stuffing behavior.  
    
* **HTTP status code distribution**  
  Aggregates response codes (e.g., 200, 401, 500\) to provide insight into system health and error rates.


These metrics are calculated using queries over structured log fields, allowing them to be grouped and visualized over time. Because the logs include consistent fields such as event type and status code, they can be filtered to focus on specific behaviors or endpoints.

## Dashboards

Dashboards are used to visualize the metrics derived from application logs and provide a quick overview of system activity. Grafana is used to display these visualizations, with data sourced from Loki queries.

The dashboards are designed to highlight patterns over time rather than individual events. This makes it easier to identify trends that may indicate issues with the system or unusual behavior.  
Key visualizations include:

* Login activity over time  
  Shows the frequency of authentication attempts, which can be used to identify unusual patterns such as spikes during off-hours.  
    
* Rate limiting events  
  Tracks how often rate limits are triggered on sensitive routes, such as login. Sudden increases may indicate brute force or automated attack attempts.  
    
* HTTP status code distribution  
  Displays the occurrence of response codes over time, helping to identify increases in errors or unexpected responses.


These dashboards were used during development to validate that implemented controls were functioning as expected. For example, after introducing rate limiting on the login route, the corresponding dashboard was used to confirm that repeated requests were being blocked and logged correctly.

## Security Monitoring

Logging and monitoring also support security-related use cases.  
The system can be used to:

* Detect repeated failed authentication attempts  
* Identify rate limiting events indicative of brute force activity  
* Monitor unusual request patterns

