

Open Energy DashBoard (OED)  
System Overview

Prepared by: BSU Security Team  
Andrew, Brian, Krista, Oye, Zach B., Zack S.  
Ball State University  
Mentor: Steve Huss-Lederman  
\[4/27/2026\]

## Overview

The Open Energy Dashboard (OED) is a web-based application used to visualize and analyze building energy usage data. The system provides tools for managing energy metrics, users, and related configurations.

This phase of development focused on addressing security findings identified in a penetration testing report and improving the overall reliability of the system.

## Purpose & Scope 

The purpose of this project phase was to improve the overall security, reliability, and maintainability of the Open Energy Dashboard (OED). This work was driven by the results of a formal penetration testing assessment, which identified a range of vulnerabilities across authentication, input handling, configuration, and application logic.

The primary focus was to remediate these vulnerabilities and reduce the system’s exposure to common web application risks. Efforts were concentrated on strengthening core areas of the application, including authentication and session management, enforcing server-side input validation, improving error handling, and securing application configuration and dependencies.

In addition to addressing specific vulnerabilities, the project aimed to introduce practices that support long-term stability and security. This included integrating automated testing into the development workflow, improving logging for better system visibility, and establishing a foundation for monitoring and future maintenance.

The scope of this work was limited to backend and infrastructure-level improvements. The existing system architecture and core functionality of OED were preserved, with changes applied directly within current components rather than through major redesigns.

## Current State

At the time of handover, OED is in a stable and functional state, with the previously identified security vulnerabilities addressed and validated through the OED testing scheme. The system maintains its original functionality while incorporating improvements to security, reliability, and maintainability. Vulnerabilities identified during the penetration testing process have been remediated, with fixes applied across authentication, input validation, configuration management, and application logic.

All changes have been submitted through pull requests and will be reviewed as part of the standard development workflow. Where applicable, contributions have been evaluated within the broader OED project to ensure compatibility with existing code and project standards.

Automated testing has been integrated into the development workflow and is enforced through the CI/CD pipeline. This ensures that changes are validated before being merged and helps prevent the introduction of regressions.

The application includes structured logging and basic monitoring capabilities that provide insight into system activity. These tools support debugging, help identify abnormal behavior such as repeated failed login attempts, and allow developers to track request patterns and error conditions during operation.

The application includes structured logging and monitoring capabilities that capture detailed request and event data. Logs include metadata such as event type, timestamps, routes, status codes, and relevant request information, enabling more precise tracing of application behavior. These logs support debugging, facilitate analysis of error conditions, and help identify patterns such as repeated failed authentication attempts or rate limiting events. Aggregated metrics and dashboards provide additional visibility into system performance and usage trends.

Overall, the system is in a condition suitable for continued development. Future contributors can build on the current implementation with confidence that core security concerns have been addressed and that supporting processes are in place to maintain system quality.

## Technology Stack

The Open Energy Dashboard (OED) is built using a combination of backend, database, testing, and infrastructure technologies

#### **Backend** 

Node.js (JavaScript): The backend is implemented using Node.js and is responsible for handling API requests, executing business logic, managing authentication, and enforcing input validation and security controls.

#### **Database**

PostgreSQL: A relational database language is used in this project to store, manage, and retrieve application data using structured queries.

#### **Testing**

Mocha/Chai: Mocha and Chai are used to implement automated tests for the application. These tests validate core functionality, security controls, and edge cases, and are executed as part of the CI/CD pipeline to ensure code quality and prevent regressions.

#### **Logging/Monitoring**

Grafana/Loki/Winston: Winston is used within the application to generate structured logs. These logs are forwarded to Loki for aggregation and are visualized through Grafana dashboards. This stack enables monitoring of system behavior, including request patterns, error rates, and security-related events such as rate limiting.

#### **Containerization**

Docker: Docker is used to containerize the application and its dependencies, providing a consistent and reproducible environment for development and deployment.  
