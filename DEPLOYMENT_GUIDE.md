# Deployment Guide

## Option 1: Vercel (Frontend) + Railway (Backend) - FREE

### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add these environment variables:
   - `PORT` = 8000 (auto-set)
6. Railway will auto-detect Python and deploy
7. Copy your Railway URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://your-app.railway.app` (from Step 1)
7. Click "Deploy"

### Step 3: Update Backend CORS

In `backend/main.py`, update the allowed origins with your Vercel URL:
```python
allow_origins=[
    "https://your-app.vercel.app",
    "http://localhost:3005"
]
```

Push changes and Railway will auto-redeploy!

---

## Option 2: All-in-One on Render - FREE

1. Go to [Render.com](https://render.com/)
2. Create **two** services:

### Backend (Web Service):
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Root Directory: `backend`

### Frontend (Static Site):
- Build Command: `npm install && npm run build`
- Publish Directory: `frontend/build`
- Root Directory: `frontend`

---

## Option 3: Single Server Deployment (Cheapest)

Deploy both on Railway or Render as a monorepo:
- Serve React build from FastAPI
- Single URL for everything
- ~$5/month or free tier

---

## Recommended: Railway + Vercel (Best Free Option)

**Pros:**
- Both have generous free tiers
- Automatic deploys from GitHub
- SSL certificates included
- Custom domains supported
- Easy to scale

**Limits:**
- Railway: 500 hours/month, 512MB RAM (free)
- Vercel: Unlimited bandwidth, 100GB/month

---

## Quick Deploy Commands

### Railway (Backend):
```bash
cd backend
# Install Railway CLI
npm i -g @railway/cli
# Login and deploy
railway login
railway init
railway up
```

### Vercel (Frontend):
```bash
cd frontend
# Install Vercel CLI
npm i -g vercel
# Login and deploy
vercel login
vercel --prod
```

---

## Cost Comparison

| Option | Monthly Cost | Best For |
|--------|-------------|----------|
| Vercel + Railway | FREE | Development & Small Apps |
| Render | FREE (both) | All-in-one simplicity |
| Vercel + Render | FREE | More reliability |
| Heroku | $7-13 | Legacy apps |
| AWS/GCP | $10-50 | Enterprise |

---

## Post-Deployment Checklist

- [ ] Test file upload (check file size limits)
- [ ] Verify CORS is working
- [ ] Test VLOOKUP with real data
- [ ] Check download functionality
- [ ] Monitor error logs
- [ ] Set up custom domain (optional)

Your app is now ready for the world! 🚀
