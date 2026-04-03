#!/bin/bash

echo "🚀 Solana Volume Bot - Starting..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    echo ""
fi

echo "🔧 Starting servers..."
echo ""
echo "📊 Dashboard will be available at: http://localhost:3000"
echo "🔌 API will be available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
npm run dev
