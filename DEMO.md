# Clinic Demo - Demo Scenario Script

## Overview

This document provides a step-by-step guide for demonstrating the Clinic Demo chatbot to clients.

## Prerequisites

- Deployed web application URL
- API key (if required)
- Demo data pre-seeded in database

---

## Demo Scenario

### Scenario 1: Browsing Services (2 minutes)

**Objective**: Show the clinic's service offerings

1. Open the demo website
2. Point out the "Available Services" section
3. Highlight:
   - Service names and descriptions
   - Pricing information
   - Duration estimates
4. **Script**: "Our clinic offers a range of services from general checkups to specialized diagnostics. All pricing is transparent."

### Scenario 2: AI Chat Introduction (3 minutes)

**Objective**: Demonstrate the AI-powered chat assistant

1. Scroll down to the chat section
2. Type: "Hello, what services do you offer?"
3. Show the AI's response about available services
4. **Script**: "Our AI assistant can answer questions about our services, pricing, and help with appointments."

### Scenario 3: Booking an Appointment (4 minutes)

**Objective**: Show how to book through the chat

1. Type: "I'd like to book an appointment"
2. Show the booking confirmation response
3. Explain the automated booking flow
4. **Script**: "The AI understands booking requests and can automatically schedule appointments in our system."

### Scenario 4: Rate Limiting Demonstration (2 minutes)

**Objective**: Show abuse protection

1. Explain the rate limit (100 messages/day per IP)
2. Mention API key protection for production
3. **Script**: "We've implemented rate limiting and API key protection to prevent abuse and control costs."

---

## Technical Highlights to Mention

### Architecture

- **Frontend**: React with responsive design
- **Backend**: Azure Functions (serverless)
- **Database**: Azure SQL (Basic tier)
- **AI**: Azure OpenAI (GPT-3.5)

### Cost Controls

- Free tier resources (F0 for OpenAI, Basic for SQL)
- Per-IP rate limiting (100/day)
- API key enforcement
- Consumption-based pricing for Functions

### Security

- Parameterized SQL queries (no SQL injection)
- Secure password storage
- HTTPS enforced
- Input validation on all endpoints

---

## Resetting Demo Data

To reset the demo to a clean state:

```bash
# Deploy infrastructure
cd infra
az deployment group create --resource-group clinic-demo-rg --template-file main.bicep --parameters sqlAdminPassword='YourPassword'

# Run seed script
cd infra
npm run seed
```

Or via GitHub Actions:

1. Go to Actions tab
2. Run "Deploy Clinic Demo" workflow
3. Provide SQL password as input

---

## Troubleshooting

| Issue               | Solution                             |
| ------------------- | ------------------------------------ |
| Chat not responding | Check API key is set in frontend env |
| No services showing | Verify database is seeded            |
| Booking not working | Check Functions are deployed         |
| Rate limit exceeded | Wait 24 hours or reset demo          |

---

## Contact Information

For technical questions or support, refer to the main README.md file.
