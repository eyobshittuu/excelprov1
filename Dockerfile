# Multi-stage build for Python + Node.js
FROM python:3.11-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy frontend and build it
COPY frontend/package*.json frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ .
RUN npm run build

# Copy backend
WORKDIR /app
COPY backend backend

# Create upload and output directories
RUN mkdir -p backend/uploads backend/outputs

# Expose port (will use PORT env var or default to 8000)
EXPOSE 8000

# Start the application
CMD uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}
