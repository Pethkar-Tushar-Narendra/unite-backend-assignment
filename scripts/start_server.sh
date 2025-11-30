#!/bin/bash
set -e

cd /home/ec2-user/unite-backend

echo "Downloading environment variables from S3..."
aws s3 cp s3://unite-backend-deployments-tushar/.env .env --region us-east-1

echo "Stopping existing PM2 process..."
pm2 stop unite-backend || true
pm2 delete unite-backend || true

echo "Starting application with PM2..."
pm2 start server.js --name "unite-backend"
pm2 save

echo "Application started successfully!"
pm2 status
