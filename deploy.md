# HIT Student Accommodation Portal - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the HIT Student Accommodation Portal in production environments using Docker.

## Prerequisites

Before deployment, ensure you have:

- **Server Requirements**:
  - Linux server (Ubuntu 20.04+ recommended)
  - Minimum 2GB RAM, 20GB storage
  - Docker and Docker Compose installed
  - Domain name with DNS configured

- **Services Required**:
  - Firebase project with Firestore and Authentication


## Step-by-Step Deployment

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (logout/login required)
sudo usermod -aG docker $USER
```

### 2. Project Setup

```bash
# Clone the repository
git clone <repository-url>
cd res-portal-deploy

# Make deployment directories
sudo mkdir -p /opt/hit-portal
sudo chown $USER:$USER /opt/hit-portal
cp -r . /opt/hit-portal/
cd /opt/hit-portal
```

### 3. Environment Configuration

```bash
# Copy and configure environment file
cp .env.local.example .env.local
nano .env.local  # or use your preferred editor
```

**Required Environment Variables**:
```env
# Firebase Configuration (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Production Base URL (CRITICAL)
NEXT_PUBLIC_BASE_URL=https://portal.hit.ac.zw

# Security Tokens (generate secure random strings)
PAYMENT_CHECK_TOKEN=$(openssl rand -base64 32)
NEXT_PUBLIC_PAYMENT_CHECK_TOKEN=$(openssl rand -base64 32)
```

### 4. Firebase Setup

#### 4.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "hit-accommodation-portal"
3. Enable Google Analytics (optional)

#### 4.2 Configure Authentication
```bash
# In Firebase Console:
# 1. Go to Authentication > Sign-in method
# 2. Enable Email/Password
# 3. Add authorized domains:
#    - portal.hit.ac.zw
#    - localhost (for testing)
```

#### 4.3 Set up Firestore
1. Go to Firestore Database
2. Create database (start in production mode)
3. Choose location (us-central1 recommended)
4. Apply security rules from `firebaserules.txt`

#### 4.4 Security Rules
```javascript
// Copy content from firebaserules.txt and paste in Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    // ... rest of rules from firebaserules.txt
  }
}
```


### 6. Deploy Application

```bash
# Navigate to project directory
cd /opt/hit-portal

# Deploy the application
docker-compose up -d

# Check deployment
docker-compose ps
docker-compose logs -f
```


#### 7.2 Configure Application Settings
1. Login as admin
2. Go to Admin > Settings
3. Configure:
   - Application periods (start/end dates)
   - Student limits by gender
   - Auto-acceptance limits

#### 7.3 Set up Hostels
1. Go to Admin > Hostels
2. Add hostel buildings
3. Create floors and rooms
4. Set pricing and policies

### 8. Monitoring and Maintenance

#### 8.1 Log Monitoring
```bash
# Application logs
docker-compose logs -f nextjs

# Payment checker logs
docker-compose logs -f payment-checker
```




2. **Firebase Connection Issues**:
   - Verify Firebase project configuration
   - Check authorized domains in Firebase Console
   - Ensure environment variables are correct

3. **Payment Checker Not Working**:
```bash
docker-compose logs payment-checker
# Verify PAYMENT_CHECK_TOKEN matches
# Check API endpoint accessibility
```

## Post-Deployment Checklist

- [ ] Application accessible via your domain
- [ ] Admin user can login and access admin panel
- [ ] Students can register and submit applications
- [ ] Payment checker is running (check logs)
- [ ] Firebase security rules are applied
- [ ] Backups are configured and running
- [ ] Monitoring is set up
- [ ] Performance is acceptable


