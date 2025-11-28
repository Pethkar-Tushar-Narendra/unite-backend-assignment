#!/bin/bash

echo "Stopping existing application..."
pm2 stop unite-backend || true
pm2 delete unite-backend || true
echo "Application stopped"
