# NTMS Exam Platform - Clean Architecture Document

## Overview
The **NTMS Exam Platform** is engineered following **Clean Architecture** and **SOLID Principles** to ensure strict separation of concerns, high testability, and high-concurrency scalability for commercial certification testing.

## Architectural Layers

```
+-------------------------------------------------------------------+
|                        Presentation Layer                         |
|  React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query    |
+---------------------------------+---------------------------------+
                                  | REST / HTTPS / OpenAPI
+---------------------------------v---------------------------------+
|                       Controllers / REST API                      |
|                  Express Controllers & Express Routers            |
+---------------------------------+---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|                       Business / Application                      |
|      Services (ExamEngineService, AuthService, AnalyticsService)  |
+---------------------------------+---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|                         Repository Layer                          |
|         UnitOfWork Pattern & Repository Abstractions          |
+---------------------------------+---------------------------------+
                                  |
+---------------------------------v---------------------------------+
|                      Infrastructure Layer                         |
|        Prisma ORM (Azure SQL Database), Azure Storage, Insights   |
+-------------------------------------------------------------------+
```

### 1. Presentation Layer (`frontend/`)
- Built with React 18, TypeScript, Vite, Tailwind CSS, and Microsoft Fluent UI design aesthetics.
- Utilizes custom engine components for 16 distinct question types including tabbed Case Studies, interactive Azure/M365 Portal Simulations, and hands-on Lab checkers.

### 2. Controllers & Routes Layer (`backend/src/controllers/`, `backend/src/routes/`)
- Express routing controllers responsible for HTTP request validation via Zod, parameter extraction, and HTTP status code formatting.

### 3. Business / Application Layer (`backend/src/services/`)
- Implements core domain logic. The `ExamEngineService` evaluates all 16 question types, computes negative/partial marking, updates audit logs, and handles exam sessions.

### 4. Repository Layer (`backend/src/infrastructure/repositories/`)
- Implements the **Repository Pattern** and **Unit of Work Pattern**. Decouples business logic from direct ORM persistence calls.

### 5. Infrastructure Layer (`backend/src/infrastructure/`)
- Interacts with Azure SQL Database via Prisma ORM, Azure Blob Storage via `@azure/storage-blob`, and Azure Application Insights for telemetry.
