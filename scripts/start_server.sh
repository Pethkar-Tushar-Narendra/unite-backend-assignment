#!/bin/bash
cd /home/ec2-user/my-app
# Use PM2 to keep app running in background
pm2 start server.js --name "unite-backend"
