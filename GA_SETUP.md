# Google Analytics Integration Setup

This app now supports fetching real-time analytics data from Google Analytics 4 using a backend API server.

## Prerequisites

1. A Google Analytics 4 property
2. Google Cloud Project with Analytics API enabled
3. Service account with access to your GA4 property

## Setup Steps

### 1. Google Cloud Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable the Google Analytics Data API
4. Create a service account:
   - IAM & Admin > Service Accounts > Create Service Account
   - Name: "ga-api-service-account"
   - Role: Viewer (for Google Analytics Data)
   - Create key: JSON format (download the file)

### 2. Grant Access to GA4 Property
1. In Google Analytics, go to Admin > Property > Property Access Management
2. Add the service account email as a "Viewer"
3. The email is in the downloaded JSON file under "client_email"

### 3. Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your Firebase config (existing)
3. Add your GA service account key:
   ```
   GA_SERVICE_ACCOUNT_KEY={"type":"service_account",...}  # Paste entire JSON content
   PORT=3001
   ```

### 4. Running the App
To run both frontend and analytics API server:

```bash
npm run dev:full
```

This runs:
- Backend API server on http://localhost:3001
- Frontend dev server on http://localhost:5173 (default Vite port)

### 5. Testing
1. Set GA4 Property ID in a project (edit project page)
2. Visit the analytics page for that project
3. Click "Refresh Data" to fetch real analytics
4. If configured correctly, you'll see real GA4 data instead of mock data

## API Endpoints

- `GET /api/analytics/:propertyId` - Get analytics report
- `GET /api/analytics/:propertyId/realtime` - Get real-time data

## Troubleshooting

- **"Google Analytics not configured"**: Check GA_SERVICE_ACCOUNT_KEY in .env
- **API errors**: Verify service account has access to the property
- **No data**: Check property ID format (should be just the number, e.g., "123456789")

## Security Notes

- Never commit .env file to version control
- Service account keys have powerful permissions - store securely
- In production, use proper secret management (e.g., AWS Secrets Manager)