# Architecture Diagram

Use draw.io, Lucidchart, or any diagramming tool to create:

## Components to Include:

1. **Client/Frontend** (top)
2. **API Gateway/Load Balancer** (AWS ALB)
3. **Express API Server** (EC2/ECS)
4. **Databases**:
   - MySQL (RDS)
   - MongoDB
   - Redis
5. **Storage**: S3 (CSV uploads, images)
6. **Messaging**:
   - SQS (async queue)
   - SNS (notifications)
7. **External Services**: Twilio SMS
8. **Worker Process**: CSV Processor

## Flow Arrows:

- Client → API Server (HTTPS)
- API → MySQL (Read/Write)
- API → MongoDB (Logs)
- API → Redis (Cache)
- API → S3 (Upload/Download)
- API → SQS (Enqueue)
- Worker → SQS (Dequeue)
- API → SNS → Twilio

Save as `docs/architecture.png`
