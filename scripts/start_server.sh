#!/bin/bash

set -e

# Change to deployment directory
cd /home/ec2-user/my-app

# Download .env from S3
echo "Downloading environment variables from S3..."
aws s3 cp s3://unite-backend-deployments-tushar/.env .env

# Stop existing PM2 process
echo "Stopping existing PM2 process..."
pm2 delete unite-backend || true
pm2 kill || true

# Start application with PM2 (use dist folder)
echo "Starting application with PM2..."
pm2 start dist/server.js --name unite-backend --env production

# Save PM2 process list
pm2 save

# Show status
pm2 list
