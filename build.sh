#!/bin/bash
set -e

echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "📦 Installing Node dependencies..."
cd frontend
npm install

echo "🏗️ Building React app..."
npm run build

echo "✅ Build complete!"
