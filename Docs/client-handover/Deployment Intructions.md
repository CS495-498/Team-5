

Open Energy DashBoard (OED)  
Deployment Instructions

Prepared by: BSU Security Team  
Andrew, Brian, Krista, Oye, Zach B., Zack S.  
Ball State University  
Mentor: Steve Huss-Lederman  
\[4/27/2026\]

This document provides a comprehensive overview of the onboarding, setup, and contribution process for developers working on the class repository, which is based on the OED project. Contributors are encouraged to stay in contact with the OED team through official channels, such as the Discord server or contact form, to gain additional insight, guidance, and context when needed. While development occurs within the class repository, referencing OED resources can help ensure alignment with the original project’s structure and practices. Before submitting any contributions, developers should ensure all required agreements and guidelines outlined by the course or project have been completed.

### Prerequisites

Before setting up the development environment, developers should ensure the following tools and accounts are installed and configured:

* A GitHub account for accessing and contributing to the repository  
* Git for version control and repository management  
* Docker and Docker Compose for containerized application setup  
* Windows Subsystem for Linux (WSL2) for Windows users  
* A Linux distribution (preferably Ubuntu LTS) installed within WSL  
* Visual Studio Code (or another IDE) with recommended extensions such as ESLint  
* A modern web browser for accessing the application locally

The development environment setup is a critical component of successful participation. For users operating on Windows 10 or later, the use of Windows Subsystem for Linux (WSL) is required to enable proper compatibility with Docker and the project’s tooling. Developers should ensure that WSL is fully installed and configured, avoiding WSL-1 in favor of WSL-2. Ubuntu is the recommended Linux distribution due to its stability and compatibility with the project environment. Proper configuration of WSL prior to installing Docker is highly recommended to streamline the setup process.  
The repository is hosted on GitHub and follows a fork-based development workflow. Contributors should fork the repository to their personal account, clone that fork locally, and submit changes through pull requests. It is important to clone the forked repository rather than the original repository to ensure proper permissions for pushing changes. When using WSL, the repository must be cloned within the Linux file system (such as the Ubuntu partition) to prevent file compatibility issues that can interfere with Docker and development workflows.  
Docker is used to containerize the application, providing a consistent and isolated development environment across systems. Developers must install Docker and Docker Compose, and ensure Docker is running before attempting to start the project. The recommended method for launching the application is with the command docker compose up, which handles dependency installation, database initialization, and application startup. Initial setup may take several minutes, and developers should monitor terminal output to confirm successful compilation and readiness.  
While any IDE may be used, Visual Studio Code (VSC) is commonly recommended due to its compatibility with WSL and available extensions. Developers should ensure the project is opened within the WSL environment and follow coding standards such as using tabs instead of spaces for indentation. Tools like ESLint can assist in maintaining consistency. Proper WSL integration within the IDE is important to avoid environment-related issues.

Once the application is running, it can be accessed through a web browser at http://localhost:3000. The monitoring dashboard would be accessed at http://localhost:4000 and Loki can be accessed at http://localhost:3100. Loki may not need to be accessed, however, it would display helpful text on its status if necessary. Developers should wait until the build process completes successfully before accessing the application to avoid errors or incomplete rendering. The terminal used to start the application should remain open during development, as it provides important logs and debugging information.

To stop the application, developers can use a single interrupt command (Ctrl \+ C) in the terminal or run docker compose down if necessary. Proper shutdown ensures that containers are cleaned up correctly and helps prevent issues in future sessions.

Overall, following these setup steps ensures a stable and efficient workflow when contributing to the class repository. For additional guidance, developers may refer to the OED developer documentation as a supplementary resource for understanding the underlying architecture and best practices.  
