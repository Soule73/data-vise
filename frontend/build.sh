#!/bin/bash
echo "Starting Vercel build for frontend..."

# Set environment variables
export VITE_API_URL="https://data-vise.vercel.app/api"
export VITE_APP_NAME="Data Vise"
export VITE_APP_VERSION="1.0.0"
export VITE_NODE_ENV="production"

# Build the frontend
npm run build

echo "Frontend build completed!"
echo "Build directory contents:"
ls -la dist/

echo "Vercel build finished successfully!"
