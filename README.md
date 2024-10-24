# Marketing & CRM Data Integration API

A TypeScript-based REST API that integrates with CRM and Marketing platforms, processes data, and generates reports. Built with Node.js, Express, and Prisma with PostgreSQL.

## Features

- 🔄 CRM and Marketing platform integration simulation
- 📊 Data ETL processing
- 📝 Report generation (PDF/CSV)
- 📧 Email alert system
- 🗄️ PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MohdMusaiyab/EzyMetrics
cd EzyMetrics
```

2. Install dependencies:
```bash
npm install
```

3. Environment Setup:
   - Create a `.env` file in the root directory
   - Copy contents from `.env.sample`
   - Update the variables with your configurations:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
EMAIL_RECIPIENT=email@example.com
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_SERVICE=gmail
```

4. Database Setup:
```bash
npx prisma generate
npx prisma migrate dev
```

## API Routes

### 1. CRM Integration 
```http
GET /leads/geta-all-leads
```

### 2. Marketing Data
```http
GET /campaigns/get-all-campaigns
```

### 3. Reports
```http
GET /reports/leads
GET /reports/campaigns
GET /reports/metrics
```
### 4. Metrics
```http
GET /metrics/get-metrics
```
### 5. Alerts
```http
POST /campaigns/budget-alert
```

## Technologies Used

- TypeScript
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- csv-writer
- jsPDF
- nodemailer

## Project Structure

```
├── src/
│   ├── controllers/
│   ├── data/
│   ├── lib/
│   ├── routes/
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .env.sample
└── package.json
```

## Running the Application

Development mode:
```bash
npm run dev
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error
