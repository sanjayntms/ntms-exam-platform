# NTMS Exam Platform

An enterprise-grade, high-concurrency online examination platform built for commercial certification testing.

![NTMS Exam Platform](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200)

## Features

- **NTMS Certified Exam Engine**: Question palette, timer, calculator, notes scratchpad, mark for review, strikeout text, and full auto-save.
- **16 Supported Question Formats**:
  1. Single Choice
  2. Multiple Choice
  3. True / False
  4. Dropdown
  5. Fill in the Blank
  6. Matching
  7. Drag and Drop
  8. Reorder / Sequence
  9. Build List
  10. Hotspot
  11. Case Study Engine (Multi-tabbed environment)
  12. Simulation Engine (Interactive Azure Portal / M365 UI)
  13. Lab Engine (Hands-on task checklists & validation)
  14. Code Editor (Monaco / syntax-highlighted code runner)
  15. Essay Engine (Long-form answer with word count)
- **Microsoft Entra ID Authentication**: MSAL OAuth2 / OpenID Connect with PKCE & RBAC roles (`ADMINISTRATOR`, `EXAM_CREATOR`, `CANDIDATE`, `GUEST`).
- **Clean Architecture & SOLID Principles**: Clean layer separation across Presentation, Business Services, Repositories, Unit of Work, and Infrastructure.
- **Azure Native Infrastructure**: Prepared for Azure SQL Database, Azure App Service, Azure Blob Storage, Application Insights, and GitHub Actions CI/CD.

---

## Technical Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Axios, React Hook Form, Zod, Chart.js, `@azure/msal-react`.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, `@azure/msal-node`, Helmet, CORS, Express Rate Limit, Swagger OpenAPI 3.0.
- **Database**: Azure SQL Database / SQLite via Prisma ORM.

---

## Quick Start Guide

### 1. Install & Seed Database
```bash
# Setup backend dependencies & seed database
cd backend
npm install
npx prisma db push
npm run seed

# Setup frontend dependencies
cd ../frontend
npm install
```

### 2. Launch Development Servers
```bash
# Start backend server (port 5000)
cd backend
npm run dev

# Start frontend Vite dev server (port 3000)
cd frontend
npm run dev
```

Visit `http://localhost:3000` to launch the platform.

---

## Documentation
- [Clean Architecture Specs](docs/ARCHITECTURE.md)
- [Database Schema & ERD](docs/DATABASE.md)
- [REST API Documentation](docs/API_DOCUMENTATION.md)
- [Azure Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Administrator Guide](docs/ADMINISTRATOR_GUIDE.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)

---

## License
PROPRIETARY - NTMS Enterprise Certification Systems.
