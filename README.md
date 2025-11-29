# Unite Backend Assignment - Lead Management System

A production-ready Node.js backend system with TypeScript, Express, AWS services integration, and comprehensive CI/CD pipeline.

## 🏗️ Architecture Overview

### Tech Stack
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Databases**: 
  - MySQL (RDS) - Primary data storage
  - MongoDB - Logs and analytics
  - Redis - Caching and session management
- **Cloud Services**:
  - AWS S3 - File storage (CSV, images)
  - AWS SNS - Notifications
  - AWS SQS - Async message queue
  - AWS RDS - MySQL hosting
- **External APIs**:
  - Twilio - SMS notifications
- **DevOps**:
  - Docker & Docker Compose
  - GitHub Actions
  - AWS CodePipeline + CodeBuild

### System Components

Client
  │
  ▼
Express API Server (Authentication, RBAC, CRUD)
  │
  ├── MySQL (RDS)
  │
  ├── MongoDB (Logs)
  │
  ├── S3 (CSV uploads, images)
  │
  ├── Redis (Caching)
  │
  ├── SQS (Async queue)
  │     └── Worker (CSV Processor)
  │
  └── SNS ──> Twilio (SMS)



## 🚀 Features Implemented

### ✅ Core Features
- [x] JWT Authentication with refresh tokens
- [x] Role-Based Access Control (admin, manager, agent)
- [x] Lead Management (CRUD with validation)
- [x] Duplicate prevention (email/phone)
- [x] S3 image upload via pre-signed URLs
- [x] Call Task Management with idempotency
- [x] SNS + Twilio notifications
- [x] CSV bulk upload with async processing
- [x] Error reporting for failed CSV rows
- [x] Daily reports and analytics
- [x] MongoDB aggregation for insights

### ✅ Infrastructure
- [x] Docker containerization
- [x] Docker Compose for local development
- [x] AWS RDS MySQL setup
- [x] MongoDB Atlas integration
- [x] Redis caching
- [x] S3 bucket configuration
- [x] SQS queue for async tasks

### ✅ DevOps & Testing
- [x] GitHub Actions CI/CD pipeline
- [x] AWS CodePipeline + CodeBuild
- [x] Unit tests (≥75% coverage)
- [x] Integration tests
- [x] Mocked external services (SNS, Twilio, S3)

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- AWS Account with configured credentials
- Twilio Account (for SMS)
- MySQL (or use Docker)
- MongoDB (or use Docker)
- Redis (or use Docker)

## 🔧 Environment Variables

Create a `.env` file in the root directory:

Server
NODE_ENV=development
PORT=3003

JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

MySQL Database (AWS RDS)
DB_HOST=your-db.us-east-1.rds.amazonaws.com
DB_USER=admin
DB_PASS=your_password
DB_NAME=unite-db
DB_PORT=3306

MongoDB
MONGODB_URI=mongodb://localhost:27017/unite

Redis
REDIS_HOST=localhost
REDIS_PORT=6379

AWS Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=your-bucket-name
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789:your-topic
SQS_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789/your-queue

Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890


## 📦 Installation

### Local Development with Docker

1. **Clone the repository**
git clone https://github.com/Pethkar-Tushar-Narendra/unite-backend-assignment
cd unite-backend-assignment


2. **Install dependencies**
npm install


3. **Start services with Docker Compose**
docker-compose up -d


4. **Run database migrations** (if needed)
npm run migrate


5. **Start the development server**
npm run dev


6. **Start the CSV worker (in another terminal)**
npm run worker


The API will be available at `http://localhost:3003`

### Without Docker (Local MySQL/MongoDB/Redis)

1. Install and start MySQL, MongoDB, and Redis locally
2. Update `.env` with local connection strings
3. Run `npm install`
4. Run `npm run dev`

## 🧪 Testing

### Run All Tests
npm test

### Run with Coverage Report
npm run test:coverage
Coverage report will be generated in `coverage/index.html`

### Watch Mode (Development)
npm run test:watch

## 📡 API Documentation

### Base URL
http://localhost:3003/api

### Authentication Endpoints

#### Register User
POST /api/auth/register
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "SecurePass@123",
"role": "agent"
}


#### Login
POST /api/auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "SecurePass@123"
}
**Response:**
{
"accessToken": "eyJhbGciOiJIUzI1...",
"refreshToken": "eyJhbGciOiJIUzI1...",
"user": {
"id": 1,
"name": "John Doe",
"email": "john@example.com",
"role": "agent"
}
}
### Lead Management

#### Create Lead
POST /api/leads
Authorization: Bearer {accessToken}
Content-Type: application/json

{
"name": "Jane Smith",
"phone": "+919876543210",
"email": "jane@example.com",
"status": "new",
"source": "website"
}
#### Get All Leads
GET /api/leads?status=new&source=website
Authorization: Bearer {accessToken}
#### Update Lead
PUT /api/leads/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
"status": "contacted"
}
#### Delete Lead
DELETE /api/leads/:id
Authorization: Bearer {accessToken}
### Call Task Management

#### Create Call Task
POST /api/call-tasks
Authorization: Bearer {accessToken}
Content-Type: application/json

{
"lead_id": 1,
"assigned_to": 2,
"scheduled_at": "2025-11-30T10:00:00Z",
"idempotency_key": "unique-task-123"
}
#### Complete Call Task
PUT /api/call-tasks/:id/complete
Authorization: Bearer {accessToken}
Content-Type: application/json

{
"notes": "Customer interested in premium plan",
"outcome": "follow_up_needed",
"duration_minutes": 15
}
### CSV Upload

#### Upload CSV File
POST /api/csv/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: [CSV file]
#### Get CSV Processing Logs
GET /api/csv/logs
Authorization: Bearer {accessToken}
### Reports & Analytics

#### Daily Summary
GET /api/reports/daily-summary?date=2025-11-29
Authorization: Bearer {accessToken}
#### Agent Performance
GET /api/reports/agent-performance?start_date=2025-11-01&end_date=2025-11-29
Authorization: Bearer {accessToken}
#### Insights
GET /api/reports/insights
Authorization: Bearer {accessToken}
### S3 Image Upload

#### Get Pre-signed URL
POST /api/leads/upload-url
Authorization: Bearer {accessToken}
Content-Type: application/json

{
"leadId": 1,
"contentType": "image/jpeg"
}
**Response:**
{
"uploadUrl": "https://bucket.s3.amazonaws.com/...",
"key": "leads/1/123456.jpeg",
"fileUrl": "https://bucket.s3.amazonaws.com/leads/1/123456.jpeg",
"expiresIn": 600
}
Then upload directly to S3:
PUT {uploadUrl}
Content-Type: image/jpeg

[Binary image data]
## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Pipeline stages:
1. **Lint** - ESLint code quality check
2. **Test** - Run unit and integration tests
3. **Build** - Compile TypeScript to JavaScript
4. **Deploy** - Deploy to AWS EC2 via CodePipeline

### AWS CodePipeline

1. **Source** - GitHub repository
2. **Build** - AWS CodeBuild (using buildspec.yml)
3. **Deploy** - AWS CodeDeploy to EC2

## 🐳 Docker Deployment

### Build Docker Image
docker build -t unite-backend:latest .
### Run Container
docker run -p 3003:3003 --env-file .env unite-backend:latest
### Docker Compose Production
docker-compose -f docker-compose.prod.yml up -d

## 📊 Load Testing

### Using k6
k6 run load-tests/leads.js

Results are saved in `load-tests/results.txt`

## 🔐 Security Best Practices

- ✅ JWT tokens with expiration
- ✅ Bcrypt password hashing
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ Rate limiting (planned)
- ✅ HTTPS in production

## 📝 Project Structure
unite-backend-assignment/
├── .github/                       # GitHub configuration
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD
├── docs/
│   └── architecture.png           # System architecture diagram
├── infrastructure/
│   └── terraform/                 # IaC templates
├── load-tests/
│   ├── leads.js                   # k6 load test script
│   └── results.txt                # Load test results
├── logs/
│   └── deployment.log             # Deployment logs
├── src/
│   ├── config/                    # Database and service configs
│   ├── controllers/               # Request handlers
│   ├── middlewares/               # Auth, RBAC, error handling
│   ├── models/                    # Database models
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic (S3, SNS, SQS, Twilio)
│   ├── workers/                   # Background workers (CSV processor)
│   ├── app.ts                     # Express app configuration
│   ├── server.ts                  # Server entry point
│   └── worker.ts                  # Worker entry point
├── tests/
│   ├── auth.test.ts               # Authentication tests
│   ├── lead.test.ts               # Lead management tests
│   └── callTask.test.ts           # Call task tests
├── .dockerignore
├── .env.example
├── .gitignore
├── buildspec.yml                  # AWS CodeBuild config
├── docker-compose.yml             # Local development
├── Dockerfile
├── jest.config.js
├── package.json
├── postman_collection.json        # API collection
├── README.md
├── sample_leads.csv               # Sample CSV (100 rows)
└── tsconfig.json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of Unite Backend Developer Assignment.

## 👤 Author

**Tushar Pethkar**
- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Unite Team for the assignment guidelines
- AWS Documentation
- Node.js and TypeScript communities
