#!/bin/bash
set -e

# Working directory is the CodeDeploy deployment folder
cd /home/ec2-user/my-app

echo "Downloading environment variables from S3..."
aws s3 cp s3://unite-backend-deployments-tushar/.env .env

echo "Stopping existing PM2 process..."
pm2 delete unite-backend || true

echo "Starting application with PM2..."
pm2 start dist/server.js --name unite-backend --env production

echo "Saving PM2 process list..."
pm2 save

echo "Application started successfully!"
pm2 list
