# NTMS Exam Platform - Azure Deployment Guide

## Prerequisites
1. Azure Subscription
2. Azure App Service Plan (B1 minimum, P1v3 recommended for enterprise concurrency)
3. Azure SQL Database
4. Microsoft Entra ID App Registration
5. Azure Blob Storage Account

## Step 1: Microsoft Entra ID Configuration
1. Go to Azure Portal -> Microsoft Entra ID -> App Registrations.
2. Register New Application: `NTMS Exam Platform`.
3. Add Redirect URIs for Single-Page Application (SPA): `http://localhost:3000` and `https://<your-app>.azurewebsites.net`.
4. Copy Client ID and Tenant ID to `.env`.

## Step 2: Azure SQL Database Setup
1. Provision Azure SQL Database (Serverless / Provisioned vCore).
2. Obtain connection string:
   `DATABASE_URL="sqlserver://<server>.database.windows.net:1433;database=ntms_db;user=<user>;password=<pass>;encrypt=true;"`
3. Run Prisma migration:
   `npx prisma db push`

## Step 3: Deployment to Azure App Service
Use the provided GitHub Actions CI/CD workflow `.github/workflows/azure-deploy.yml` or Azure CLI:
```bash
az webapp up --name ntms-exam-platform --resource-group rg-ntms-prod --plan asp-ntms-prod
```
