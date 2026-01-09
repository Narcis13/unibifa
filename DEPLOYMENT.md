# ALOP2 Deployment Guide

## Problem Identified

Your `.output` folder contains **native modules** (argon2 and Prisma) compiled for macOS:
- `.output/server/node_modules/argon2/prebuilds/darwin-arm64/` - macOS ARM64 binary
- `.output/server/node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node` - macOS Prisma binary

When you copy `.output` to Ubuntu Linux, these cause 500 errors because Linux can't load macOS binaries.

## Quick Fix (Recommended for Your Workflow)

Since you copy only source files to VPS and build there, you need to **rebuild native modules after copying `.output`**:

## Solution 1: Fix After Copying .output (For Your Workflow)

After copying `.output` from Mac to VPS, run this on the VPS:

```bash
# On your VPS, navigate to the project directory
cd /path/to/alop2/.output/server

# Remove macOS binaries
rm -rf node_modules/argon2/prebuilds/darwin-arm64
rm -rf node_modules/.prisma/client/libquery_engine-darwin*.node

# Rebuild argon2 for Linux
npm install argon2@0.41.1 --force

# Regenerate Prisma client for Linux
npx prisma generate

# Go back to project root and start the server
cd ../..
node .output/server/index.mjs
```

Or use the provided script:
```bash
# Copy the fix script to VPS
scp fix-vps-deployment.sh your-user@109.99.176.211:/path/to/alop2/

# SSH to VPS and run it
ssh your-user@109.99.176.211
cd /path/to/alop2
chmod +x fix-vps-deployment.sh
./fix-vps-deployment.sh
```

## Solution 2: Build Directly on VPS (Alternative)

Build on the VPS instead of your Mac to avoid this issue entirely:

```bash
# SSH into your VPS
ssh your-username@109.99.176.211

# Navigate to app directory
cd /path/to/alop2

# Install dependencies (if not already done)
npm install

# Build the application
npm run build

# Start the server
node .output/server/index.mjs
```

### Step 3: Setup PM2 for Production
Install and configure PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start .output/server/index.mjs --name alop2-frontend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
# Follow the command it outputs

# Check status
pm2 status
pm2 logs alop2-frontend
```

## Solution 2: Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["node", ".output/server/index.mjs"]
```

Build and run:

```bash
# Build image
docker build -t alop2-frontend .

# Run container
docker run -d -p 3001:3000 --name alop2 \
  --env-file .env \
  alop2-frontend

# Check logs
docker logs -f alop2
```

## Solution 3: Automated Deployment Script

Use the provided `deploy-to-vps.sh`:

```bash
# Edit the script with your VPS details
nano deploy-to-vps.sh

# Make executable
chmod +x deploy-to-vps.sh

# Run deployment
./deploy-to-vps.sh
```

## Environment Variables on VPS

Ensure your `.env` file exists on the VPS:

```bash
# Copy .env to VPS
scp .env your-username@109.99.176.211:/path/to/alop2/
```

Required variables:
- Database connection string
- JWT secrets
- Session configuration
- Port settings (default 3000)

## Nginx Configuration (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Troubleshooting on VPS

### Check if app is running:
```bash
pm2 status
pm2 logs alop2-frontend
```

### Check port:
```bash
netstat -tlnp | grep 3000
```

### Check Node.js version:
```bash
node --version  # Should be 18+
```

### Rebuild if needed:
```bash
cd /path/to/alop2
rm -rf .output .nuxt node_modules
npm install
npm run build
pm2 restart alop2-frontend
```

### Check file permissions:
```bash
chmod -R 755 .output
```

## Backend API

Don't forget to also deploy your AdonisJS backend:

```bash
cd backend
npm install
npm run build
pm2 start build/bin/server.js --name alop2-backend
```

## Health Check

Once deployed, verify:

1. Frontend: `http://109.99.176.211:3001/autentificare`
2. Backend API: Check your API endpoints
3. Database connection: Test login functionality

## Common Issues

1. **500 errors on JS files**: Native modules not rebuilt - run `npm install` on VPS
2. **Port already in use**: Kill existing process or change port
3. **Database connection error**: Check `.env` file and database accessibility
4. **Permission denied**: Run `chmod -R 755 .output`
