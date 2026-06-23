# Docker Deployment Guide 🐳

## Run Locally with Docker

### Option 1: Using Docker Compose (Easiest)

```bash
# Build and run
docker-compose up --build

# Access at: http://localhost:8000
```

To stop:
```bash
docker-compose down
```

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t excel-regex-pro .

# Run the container
docker run -p 8000:8000 excel-regex-pro

# Access at: http://localhost:8000
```

---

## Deploy to Cloud with Docker

### 1. **Railway.app** (FREE) ⭐

1. Push your code to GitHub (already done ✅)
2. Go to [Railway.app](https://railway.app/)
3. Sign up with GitHub
4. Click "New Project" → "Deploy from GitHub repo"
5. Select `eyobshittuu/excelpro`
6. Railway auto-detects Dockerfile
7. Done! Live in 3 minutes

**Your URL:** `https://excelpro.up.railway.app`

---

### 2. **Fly.io** (FREE)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (creates fly.toml automatically)
fly launch --name excel-regex-pro

# Deploy
fly deploy
```

**Your URL:** `https://excel-regex-pro.fly.dev`

---

### 3. **DigitalOcean App Platform** ($5/month)

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect GitHub → select repo
4. Detects Dockerfile automatically
5. Choose $5/month plan (or free trial)
6. Deploy!

---

### 4. **Render.com** (FREE) - Already Configured ✅

Your `render.yaml` is already set to use Docker!

Just wait for the current deployment to complete.

---

### 5. **Google Cloud Run** (FREE tier available)

```bash
# Install gcloud CLI
# Visit: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy excel-regex-pro \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

### 6. **Azure Container Instances** (Pay as you go)

```bash
# Install Azure CLI
# Visit: https://docs.microsoft.com/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name excel-regex-pro-rg --location eastus

# Create container instance
az container create \
  --resource-group excel-regex-pro-rg \
  --name excel-regex-pro \
  --image YOUR_DOCKERHUB_IMAGE \
  --dns-name-label excel-regex-pro \
  --ports 8000
```

---

### 7. **AWS Lightsail Containers** ($7/month)

1. Go to [AWS Lightsail](https://lightsail.aws.amazon.com/)
2. Create container service
3. Upload your Docker image
4. Deploy

---

## 🆚 Comparison

| Platform | Free Tier | Setup | Best For |
|----------|-----------|-------|----------|
| **Railway** | 500hrs/mo | ⭐⭐⭐ | Quick deploy |
| **Fly.io** | 3 VMs free | ⭐⭐ | Low latency |
| **Render** | 750hrs/mo | ⭐⭐⭐ | Beginners |
| DigitalOcean | $5/mo | ⭐⭐ | Reliability |
| Google Cloud Run | Free tier | ⭐ | Scalability |

---

## 💡 Recommended: Railway.app

**Why?**
- Completely FREE (500 hours/month)
- Auto-detects Dockerfile
- Deploy in 2 clicks
- Custom domain support
- Automatic HTTPS
- Great dashboard

**Steps:**
1. Go to Railway.app
2. Sign in with GitHub
3. Deploy from repo
4. Done! 🎉

---

## 🔧 Docker Commands Reference

```bash
# Build image
docker build -t excel-regex-pro .

# Run container
docker run -p 8000:8000 excel-regex-pro

# Run with volume (persist uploads)
docker run -p 8000:8000 \
  -v $(pwd)/backend/uploads:/app/backend/uploads \
  -v $(pwd)/backend/outputs:/app/backend/outputs \
  excel-regex-pro

# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove image
docker rmi excel-regex-pro

# View logs
docker logs <container_id>

# Access container shell
docker exec -it <container_id> bash
```

---

## 📦 Docker Hub (Optional)

If you want to push to Docker Hub:

```bash
# Login
docker login

# Tag image
docker tag excel-regex-pro YOUR_USERNAME/excel-regex-pro:latest

# Push
docker push YOUR_USERNAME/excel-regex-pro:latest
```

Then you can deploy from Docker Hub on any platform!

---

## ✅ Your App is Docker-Ready!

All files configured:
- ✅ `Dockerfile` - Multi-stage build
- ✅ `docker-compose.yml` - Local development
- ✅ `.dockerignore` - Optimized builds
- ✅ `render.yaml` - Render deployment

Pick your favorite platform and deploy! 🚀
