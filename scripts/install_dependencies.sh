#!/bin/bash
set -e

echo "Installing production dependencies..."
cd /home/ec2-user/my-app
npm ci --production

echo "Installing PM2 globally if not present..."
sudo npm list -g pm2 || sudo npm install -g pm2

echo "Dependencies installed successfully!"
