# NTMS Exam Platform - Developer Guide

## Quick Setup

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Setup backend & database
cd backend
npm install
npx prisma db push
npm run seed

# Setup frontend
cd ../frontend
npm install
```

### 2. Running Local Development Environment
```bash
# Start backend server (port 5000)
cd backend
npm run dev

# In another terminal, start Vite frontend dev server (port 3000)
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser.
