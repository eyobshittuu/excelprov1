#!/bin/bash
set -e

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Building React app..."
npm run build

echo "Build complete!"
