#!/bin/bash
# Fix for deploying from macOS to Linux VPS
# This script rebuilds native modules after copying .output folder

echo "🔧 Fixing native modules for Linux..."

# Navigate to the .output/server directory
cd .output/server

# Remove macOS-specific native binaries
echo "📦 Removing macOS binaries..."
rm -rf node_modules/argon2/prebuilds/darwin-arm64
rm -rf node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node
rm -rf node_modules/.prisma/client/libquery_engine-darwin.dylib.node

# Reinstall only packages with native bindings
echo "🔨 Rebuilding native modules for Linux..."
npm install argon2@0.41.1 --force

# Regenerate Prisma client for Linux
echo "🗄️ Regenerating Prisma client..."
npx prisma generate

echo "✅ Native modules fixed for Linux!"
echo "You can now start the server with: node index.mjs"
