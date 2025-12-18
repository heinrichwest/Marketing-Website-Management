# Deployment Guide - GitHub Actions

## Overview

This project uses **GitHub Actions** for automatic deployment. Push to `main` branch to trigger deployment.

## Pre-Deployment Setup


### 1. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** for each:

| Secret Name | Value |
|-------------|-------|
| `VITE_FIREBASE_API_KEY` | Your API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `marketing-website-management.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `marketing-website-management` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `marketing-website-management.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |


## Deploying

Push to `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Actions will automatically:
1. Build the application with environment variables
2. Deploy to Firebase Hosting

## Verify Deployment

After deployment:

1. Visit your deployed site
2. Try logging in
3. Check browser console for errors

## Troubleshooting

### Build Fails
- Verify all GitHub Secrets are set correctly
- Check environment variable names match exactly

### Login Doesn't Work
- Verify Email/Password auth is enabled in Firebase Console
- Check user exists in both Firebase Auth and Firestore
- Check browser console for specific errors

