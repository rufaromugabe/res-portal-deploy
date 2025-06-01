# HIT Student Accommodation Portal

This is a comprehensive student accommodation management system built with [Next.js](https://nextjs.org/) for the Harare Institute of Technology (HIT). The system manages student accommodation applications, room allocations, payments, and administrative functions.

## Features

### Student Features
- 🏠 **Application Management**: Submit and track accommodation applications
- 🏨 **Room Selection**: Browse and select available hostel rooms
- 💰 **Payment Management**: Submit payment proofs and track payment status
- 👤 **Profile Management**: Manage student profile information
- 📱 **Real-time Updates**: Get instant notifications about application status

### Admin Features
- 👥 **Account Management**: Manage user accounts and roles
- 📋 **Application Review**: Review and approve/reject applications
- 🏗️ **Hostel Management**: Manage hostels, floors, and rooms
- 💳 **Payment Processing**: Review and approve payment submissions
- 📊 **Analytics & Reports**: Generate comprehensive reports and analytics
- ⚙️ **System Settings**: Configure application limits, deadlines, and system parameters
- 📈 **Activity Logs**: Track all administrative actions

### System Features
- 🔒 **Firebase Authentication**: Secure login system
- 🗄️ **Cloud Firestore**: Real-time database
- 🐳 **Docker Support**: Containerized deployment
- ⏰ **Automated Payment Checks**: Scheduled payment deadline monitoring
- 📱 **Responsive Design**: Mobile-friendly interface
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Docker + Docker Compose
- **Language**: TypeScript

## Quick Start (Development)

```bash
# Clone the repository
git clone https://github.com/your-repo/res-portal-deploy.git
cd res-portal-deploy

# Install dependencies
npm install

# Configure environment variables (see Configuration section)
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- Domain name (for production)
- Firebase project configured
- SSL certificate (recommended for production)

### Step 1: Environment Configuration

Create and configure your `.env.local` file:

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Application Base URL - IMPORTANT: Update this to your domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Security tokens for automated payment deadline checks
PAYMENT_CHECK_TOKEN=your_super_secure_random_token_here
NEXT_PUBLIC_PAYMENT_CHECK_TOKEN=your_secure_random_token_here
```

### Step 2: Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore

2. **Configure Authentication**:
   - Enable Email/Password authentication
   - Configure authorized domains

3. **Set up Firestore Security Rules**:
   ```javascript
   // Copy rules from firebaserules.txt in the project
   // Apply these rules in Firebase Console > Firestore > Rules
   ```

4. **Create Admin User**:
   - Register a user through the app
   - In Firestore, create a document in `users` collection:
     ```json
     {
       "email": "admin@hit.ac.zw",
       "role": "admin",
       "name": "System Administrator"
     }
     ```

### Step 3: Deploy with Docker

1. **Update docker-compose.yaml** (if needed):
   ```yaml
   services:
     nextjs:
       ports:
         - "3001:3000"  # Change port if needed
   ```

2. **Deploy the application**:
   ```bash
   # Build and start containers
   docker-compose up -d
   
   # Check logs
   docker-compose logs -f
   ```

3. **Verify deployment**:
   - Visit your domain or `http://localhost:3001`
   - Check that payment checker is running: `docker-compose logs payment-checker`


## System Configuration

### Admin Settings

Access the admin panel to configure:

1. **Application Limits**:
   - Maximum applications per gender
   - Auto-acceptance limits
   - Application start/end dates

2. **Hostel Settings**:
   - Payment grace periods
   - Room capacity limits
   - Auto-revoke unpaid allocations

3. **Payment Settings**:
   - Payment deadlines
   - Grace periods
   - Automated checks

### Initial Data Setup

1. **Create Hostels**:
   - Use Admin > Hostels to add hostel buildings
   - Add floors and rooms to each hostel
   - Set pricing and capacity

2. **Configure Settings**:
   - Go to Admin > Settings
   - Set application periods
   - Configure student limits

## System Administration

### Daily Operations

1. **Monitor Applications**: Review new applications in Admin > Applications
2. **Process Payments**: Check and approve payments in Admin > Payments
3. **Check System Logs**: Review activity in Admin > Activity Logs

### Maintenance Tasks

1. **Payment Deadline Checks**: Automated via cron job (payment-checker service)


### Troubleshooting

**Common Issues**:

1. **Firebase Connection Issues**:
   - Verify environment variables
   - Check Firebase project configuration
   - Ensure authorized domains are set

2. **Payment Checker Not Working**:
   - Check Docker logs: `docker-compose logs payment-checker`
   - Verify PAYMENT_CHECK_TOKEN matches
   - Ensure API endpoint is accessible

3. **Authentication Problems**:
   - Verify Firebase Auth configuration
   - Check user roles in Firestore
   - Confirm email domain settings

## API Endpoints

### Internal APIs

- `POST /api/check-payment-deadlines`: Automated payment deadline checks
- `POST /api/savePublishedLists`: Save published acceptance lists

### Security

All API endpoints are protected with:
- Firebase Authentication
- Role-based access control
- Request validation
- Rate limiting (recommended for production)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start


# Docker commands
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose logs -f        # View logs
docker-compose restart       # Restart services
```

## File Structure

```
├── app/                      # Next.js app router
│   ├── (dashboard)/         # Dashboard layouts
│   ├── api/                 # API routes
│   └── login/               # Login page
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   └── [feature]/           # Feature-specific components
├── data/                    # Firebase data functions
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
├── public/                  # Static assets
├── docker-compose.yaml      # Docker configuration
└── .env.local               # Environment variables
```



## Support

For technical support or questions:
- Check the troubleshooting section above
- Review Firebase documentation
- Contact the development team


