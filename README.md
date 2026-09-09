# Nexora — Digital Wallet & Fraud Detection Platform

Nexora is a full-stack academic project that simulates a secure digital wallet with transaction monitoring and fraud detection capabilities.

The platform allows users to manage their wallets and perform transactions while providing separate interfaces for administrators and analysts to monitor activity and investigate potentially fraudulent transactions.

> **Project Status:** This repository contains the frontend and backend available in my working copy. The separate Python machine-learning service developed by the ML team member is not included in this repository snapshot. ML integration is part of the broader Nexora architecture.

---

## Features

### User

* User registration and login
* Authentication and protected routes
* Wallet dashboard
* Deposit money
* Withdraw money
* Send money
* Transaction history
* Notifications
* User profile

### Admin

* Admin dashboard
* User management
* Wallet management
* Fraud case management
* Blacklist management
* Transaction monitoring
* Analytics

### Analyst

* Analyst dashboard
* Fraud case investigation
* Transaction analysis
* Fraud-related analytics
* Case review workflows

### Fraud Detection

The backend includes rule-based fraud detection mechanisms such as:

* High-value transaction detection
* Wallet-drain detection
* Transaction velocity checks
* Odd-hour transaction checks
* New-account transaction checks
* Blacklist-based checks

The broader project architecture also includes a separate machine-learning service for fraud prediction and explainability.

---

# My Contribution

## Ayush — Frontend Developer

I was primarily responsible for the **frontend development of Nexora** using React.

My work included designing and implementing the application's user interfaces, frontend architecture, authentication flows, API integration, and role-based interfaces.

### Frontend Development

I developed and integrated:

* Login and registration interfaces
* Authentication flows
* Protected routes
* User dashboard
* Wallet interface
* Deposit, withdrawal, and money-transfer interfaces
* Transaction history
* Notifications
* User profile
* Admin dashboard
* Admin navigation and management interfaces
* Analyst dashboard
* Analyst navigation
* Fraud case interfaces
* Blacklist management interface
* User management interface
* Analytics interfaces

### API Integration

I integrated the frontend with the backend REST APIs for:

* Authentication
* Users
* Wallets
* Transactions
* Notifications
* Admin operations
* Fraud cases
* Blacklists
* Dashboard and analytics data

I also organized the frontend API/service layer and data-fetching logic to keep communication between the UI and backend structured and maintainable.

### Frontend Architecture

I worked on organizing the application into reusable:

* Components
* Pages
* Layouts
* Routes
* Services
* API modules
* Validation schemas
* Context providers

I also implemented role-based frontend navigation and protected application routes for **Users, Analysts, and Administrators**.

---

# System Architecture

The broader Nexora architecture consists of multiple services communicating through REST APIs.

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         REST / JSON
                               │
                    ┌──────────▼───────────┐
                    │     Spring Boot      │
                    │       Backend        │
                    └──────┬───────┬───────┘
                           │       │
                 ┌─────────▼─┐   ┌─▼──────────────┐
                 │ PostgreSQL │   │ ML Service     │
                 │  Database  │   │ Python/FastAPI │
                 └────────────┘   └────────────────┘
```

### Repository Structure

```text
NEXORA-PRJ
├── nexora-frontend/
│   └── nexora/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.js
│
├── nexora-backend/
│   ├── src/
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   └── gradlew
│
├── .gitignore
└── README.md
```

> The separate Python ML service is not included in the current repository snapshot.

---

# Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Axios
* TanStack Query
* React Hook Form
* Zod

### Backend

* Java
* Spring Boot
* Spring Security
* REST APIs
* JWT
* PostgreSQL
* Liquibase
* Gradle

### Machine Learning

The broader project includes a separate Python-based ML service using technologies including:

* Python
* FastAPI
* XGBoost
* Isolation Forest
* SHAP

---

# Authentication & Authorization

The application uses authentication and protected frontend routes to control access to different areas of the system.

The frontend provides dedicated experiences based on user roles:

```text
USER
 └── User Dashboard

ANALYST
 └── Analyst Dashboard

ADMIN
 └── Admin Dashboard
```

Role-based navigation and protected routes prevent users from accessing interfaces intended for other roles.

---

# Running the Project

## Frontend

Navigate to the frontend application:

```bash
cd nexora-frontend/nexora
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend requires the Spring Boot backend to be running for authentication, wallet operations, transactions, and other API functionality.

## Backend

Navigate to the backend:

```bash
cd nexora-backend
```

Configure the required database and application settings locally.

Then run:

```bash
./gradlew bootRun
```

On Windows:

```powershell
.\gradlew bootRun
```

> Sensitive configuration such as database credentials, JWT secrets, and API keys is intentionally excluded from this repository.

---

# Configuration

Sensitive values should never be committed to GitHub.

Local configuration may include:

```text
Database URL
Database username
Database password
JWT secret
ML service URL
ML service API key
```

Configure these values locally according to your development environment.

---

# What I Learned

Working on Nexora gave me practical experience developing a frontend for a multi-role financial application and integrating it with a Spring Boot backend.

Key areas I worked with include:

* React application architecture
* Component-based development
* REST API integration
* Authentication flows
* Protected routes
* Role-based UI
* Form validation
* Server-state management
* Dashboard development
* Admin and analyst interfaces
* Transaction workflows
* Reusable UI components
* Git and GitHub collaboration

---

# Future Improvements

* Complete integration of the separate ML service
* Deploy the complete application
* Improve automated testing
* Add more detailed fraud analytics
* Improve ML explainability
* Add production-grade monitoring
* Improve responsive design
* Containerize the complete system using Docker

---

# Team Project

Nexora was developed as a final-year team project with responsibilities divided across different areas.

| Team Member | Primary Responsibility             |
| ----------- | ---------------------------------- |
| **Ayush**   | Frontend Development               |
| Team Member | Spring Boot Backend                |
| Team Member | Machine Learning / Fraud Detection |

My primary responsibility was **frontend development and frontend-backend integration**.

---

## Disclaimer

Nexora was developed as an academic/capstone project to explore digital wallet systems, fraud detection, and full-stack software development.

It is not intended to be used as a production financial system.
