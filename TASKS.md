# Project Tasks — Clinic Chatbot Demo

This file tracks the work required to build a demo website for a medical clinic with an AI chat agent that can schedule exam appointments. The stack is React (Create React App) frontend, Azure Static Web App, Azure Functions backend (JavaScript), Azure SQL database, and Azure OpenAI (free tier). Abuse and cost controls are included.

## 1. Setup & Structure

- [x] 1. Initialize Git repository (already done).
- [x] 2. Create folder structure:
  - `/frontend`
  - `/functions`
  - `/infra`
- [x] 3. Edit base `README.md` and update with project description. **MUST respect the same content structure already in place.**

## 2. Infrastructure

- [x] 1. Author Bicep template (or CLI script) to provision:
  - Azure Static Web App (free tier)
  - Azure Functions (Consumption plan)
  - Azure SQL (free/dev tier)
  - Azure OpenAI resource
- [x] 2. Add parameters for rate limits, API key, and resource names.
- [x] 3. Configure GitHub Actions workflow for deployment.
- [x] 4. Include DB seeding step in deployment.

## 3. Database

- [x] 1. Design schema: `Services`, `Patients`, `Appointments`.
- [x] 2. Create SQL script to create tables and indexes.
- [x] 3. Write Node.js seed script using Faker to populate sample data.
- [x] 4. Ensure seed runs locally and via deployment pipeline.

## 4. Backend Functions

- [x] 1. Scaffold Azure Functions project in `/functions`.
- [x] 2. Implement HTTP functions:
  - `get-services` (GET /api/services)
  - `create-appointment` (POST /api/appointments)
  - `chat` (POST /api/chat) — proxies to OpenAI and handles state.
- [x] 3. Add middleware to enforce an API key on protected endpoints.
- [x] 4. Implement simple per-IP/day rate limiting for `chat` and `appointments`.
- [x] 5. Use parameterized queries when interacting with SQL.
- [x] 6. Add basic validation to all inputs.

## 5. AI Chat Logic

- [x] 1. Define prompt templates for listing services and booking flow.
- [x] 2. Implement logic in `chat` function to:
  - Parse user intent via the model.
  - When booking is detected, call `create-appointment` internally.
  - Track and enforce message quota (e.g. 100/day).
- [x] 3. Test chat interaction locally with mock AI calls.

## 6. Frontend

- [x] 1. Scaffold Create React App project in `/frontend`.
- [x] 2. Create homepage that fetches and displays `/api/services`.
- [x] 3. Implement a chat component that sends messages to `/api/chat`.
- [x] 4. Show messages and booking confirmations.
- [x] 5. Store API key in environment (Static Web App settings).
- [x] 6. Ensure mobile responsiveness and basic styling.

## 7. Deployment & CI/CD

- [x] 1. Configure GitHub Actions to build frontend and deploy to SWA.
- [x] 2. Deploy functions with `func azure functionapp publish` or via ARM.
- [x] 3. Run database migration and seed as post-deploy step.
- [x] 4. Add health check endpoint and monitor with Application Insights.

## 8. Testing & Demo Preparation

- [x] 1. Test full flow locally against local Azure SQL (Docker) and Functions.
- [x] 2. Verify rate limits and API key enforcement.
- [ ] 3. Deploy to Azure and validate bookings appear in SQL.
- [x] 4. Document demo scenario script for clients.

## 9. Documentation

- [x] 1. Update `README.md` with setup instructions, stack, and architecture diagram. **MUST respect the content structure already in place**.
- [x] 2. Document how to reset the database and regenerate seed data.
- [x] 3. Note cost-saving tips and restrictions.

## 10. Optional Enhancements

1. Patient login/authentication stub.
2. Dashboard displaying usage counts.
3. SMS/email confirmations via Azure Communication Services.
4. Simple admin page to clear appointments or reset quotas.

---

_Tasks are ordered roughly by dependency and priority. Mark items done as you progress._
