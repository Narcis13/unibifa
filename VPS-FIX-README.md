# VPS Deployment Fix - Quick Guide

## The Problem

When you build on your Mac and copy `.output` to your Linux VPS, the build includes these macOS-specific files:

```
.output/server/node_modules/argon2/prebuilds/darwin-arm64/argon2.armv8.glibc.node
.output/server/node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node
```

These are **macOS binaries** that Linux cannot execute. When your Nuxt server tries to use argon2 (password hashing) or Prisma (database), it crashes with 500 errors.

## The Solution

After copying `.output` to your VPS, you must rebuild the native modules for Linux.

### Option A: Use the Fix Script (Easiest)

```bash
# 1. Copy .output folder to VPS as usual
scp -r .output your-user@109.99.176.211:/path/to/alop2/

# 2. Copy the fix script
scp fix-vps-deployment.sh your-user@109.99.176.211:/path/to/alop2/

# 3. SSH to VPS and run the fix
ssh your-user@109.99.176.211
cd /path/to/alop2
chmod +x fix-vps-deployment.sh
./fix-vps-deployment.sh

# 4. Start the server
pm2 restart alop2-frontend  # or node .output/server/index.mjs
```

### Option B: Manual Fix

SSH to your VPS and run:

```bash
cd /path/to/alop2/.output/server

# Remove macOS binaries
rm -rf node_modules/argon2/prebuilds/darwin-arm64
rm -rf node_modules/.prisma/client/libquery_engine-darwin*.node

# Rebuild for Linux
npm install argon2@0.41.1 --force
npx prisma generate

# Start the server
cd ../..
pm2 restart alop2-frontend
```

## Why This Happens

- **Argon2**: Native C++ module for password hashing, must be compiled for each platform
- **Prisma**: Uses native query engine binaries specific to each OS

When Nuxt builds, it copies these dependencies into `.output/server/node_modules/` with the binaries from your current platform (macOS).

## Better Alternative: Build on VPS

To avoid this issue in the future, build directly on the VPS:

```bash
# Copy only source code (not .output)
rsync -avz --exclude='.output' --exclude='node_modules' --exclude='.nuxt' \
  ./ your-user@109.99.176.211:/path/to/alop2/

# SSH to VPS and build there
ssh your-user@109.99.176.211
cd /path/to/alop2
npm install
npm run build
pm2 restart alop2-frontend
```

This way, all native modules are compiled for Linux from the start.

## Verification

After applying the fix, verify it works:

```bash
# Check if server is running
pm2 status

# Check logs
pm2 logs alop2-frontend

# Test in browser
curl http://localhost:3000/autentificare
# Should return HTML, not 500 error
```

## Quick Reference

```bash
# Complete workflow after copying .output to VPS:
cd /path/to/alop2/.output/server
rm -rf node_modules/argon2/prebuilds/darwin-arm64 node_modules/.prisma/client/libquery_engine-darwin*.node
npm install argon2@0.41.1 --force
npx prisma generate
cd ../..
pm2 restart alop2-frontend
```
