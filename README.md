# Clinic Demo Chatbot

## 📒 Descrição

This repository contains a demo website for a medical clinic. It includes a React SPA frontend, an Azure Functions backend, an Azure SQL database, and an AI chat agent powered by Azure OpenAI. Users can ask about services and book exam appointments through the chat widget.

The stack prioritizes simplicity and uses free-tier Azure services; rate limits and API key checks guard against abuse.

## 🚀 Local Development

1. **Database**: run `infra/schema.sql` against an Azure SQL instance or local Docker container. Create environment variables `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_NAME`.
2. **Seed data**: configure same env vars and run `node infra/seed.js`.
3. **Functions**: open `functions` folder and run `npm install`, then `func start` (or use VS Code Azure Functions extension). Provide env vars `OPENAI_API_KEY`, `FUNCTION_BASE_URL=http://localhost:7071` and optionally `LOCAL_MODE=true` for local auth bypass.
4. **Frontend**: open `frontend` folder, run `npm install` and `npm start`. No client-side API secret is required.

## ☁️ Deployment

A Bicep template (`infra/main.bicep`) is provided for Azure. Use GitHub Actions to build and deploy the static web app and functions, and run the seed script as a post-deploy step.

## 🤖 Tecnologias Utilizadas

Liste as IAs Generativas e outras ferramentas usadas

## 🧐 Processo de Criação

Descreva como você criou o conteúdo

## 🚀 Resultados

Apresente os resultados do seu projeto

## 💭 Reflexão (Opcional)

Comente sobre o desafio de criar algo 'natty' com IA.

## Links Interessantes

[Base10: If You’re Not First, You’re Last: How AI Becomes Mission Critical](https://base10.vc/post/generative-ai-mission-critical/)

![Base10's Trend Map Generative AI](https://github.com/digitalinnovationone/lab-natty-or-not/assets/730492/f4df26e8-f8f7-4419-8252-c69d73ea930c)
