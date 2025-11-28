#!/bin/bash
set -e

cd /home/ec2-user/my-app

echo "Fetching environment variables from AWS Parameter Store..."

# Create .env file from Parameter Store
cat > .env << EOF
PORT=3000
NODE_ENV=production

DB_HOST=$(aws ssm get-parameter --name "/unite-backend/DB_HOST" --query "Parameter.Value" --output text --region us-east-1)
DB_USER=admin
DB_PASS=$(aws ssm get-parameter --name "/unite-backend/DB_PASS" --with-decryption --query "Parameter.Value" --output text --region us-east-1)
DB_NAME=unite-db
S3_BUCKET=$(aws ssm get-parameter --name "/unite-backend/S3_BUCKET" --query "Parameter.Value" --output text --region us-east-1)

MONGO_URI=mongodb://localhost:27017/unite_mongo
REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=$(aws ssm get-parameter --name "/unite-backend/JWT_SECRET" --with-decryption --query "Parameter.Value" --output text --region us-east-1)
JWT_REFRESH_SECRET=$(aws ssm get-parameter --name "/unite-backend/JWT_REFRESH_SECRET" --with-decryption --query "Parameter.Value" --output text --region us-east-1)

AWS_REGION=us-east-1
EOF

echo "Starting application with PM2..."
pm2 start server.js --name "unite-backend"
pm2 save

echo "Application started!"
pm2 status
