# NTMS Exam Platform Quick Setup Script
Write-Host "🚀 Setting up NTMS Examination Platform..." -ForegroundColor Cyan

Write-Host "1. Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
npx prisma db push
npm run seed

Write-Host "2. Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install

Set-Location ..
Write-Host "✅ NTMS Exam Platform setup complete!" -ForegroundColor Green
Write-Host "Run 'npm run dev:backend' in backend/ and 'npm run dev:frontend' in frontend/" -ForegroundColor Cyan
