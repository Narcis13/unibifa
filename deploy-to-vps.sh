#!/bin/bash

# Deploy ALOP2 to VPS
# Usage: ./deploy-to-vps.sh

VPS_HOST="109.99.176.211"
VPS_USER="your-username"  # Change this
VPS_PATH="/path/to/your/app"  # Change this
VPS_PORT="3001"

echo "🚀 Deploying ALOP2 to VPS..."

# 1. Sync source code (excluding build artifacts and node_modules)
echo "📦 Syncing source code..."
rsync -avz --delete \
  --exclude='.output' \
  --exclude='node_modules' \
  --exclude='.nuxt' \
  --exclude='backend/node_modules' \
  --exclude='backend/build' \
  --exclude='.git' \
  --exclude='.env' \
  ./ ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

# 2. Build and start on VPS
echo "🔨 Building on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd ${VPS_PATH}

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building application..."
npm run build

# Setup PM2 if not already done
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Stop existing process
pm2 stop alop2-frontend || true
pm2 delete alop2-frontend || true

# Start with PM2
pm2 start .output/server/index.mjs --name alop2-frontend
pm2 save

echo "✅ Deployment complete!"
pm2 status
ENDSSH

echo "✅ Done! App should be running at http://${VPS_HOST}:${VPS_PORT}"
