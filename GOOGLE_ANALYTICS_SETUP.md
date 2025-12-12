# Google Analytics Integration Guide

This guide explains how to integrate Google Analytics with your Marketing Management Website system.

## Current Implementation

The system currently supports **two approaches** for Google Analytics integration:

### 1. Direct Link to Google Analytics Dashboard (Currently Active)
- Clicking the "Analytics" button opens Google Analytics in a new tab
- Users must be logged into Google Analytics and have access to the property
- No additional setup required beyond adding property IDs to projects

### 2. Embedded Google Analytics Reports (Advanced - Optional)
- Embed live Google Analytics reports directly on the page
- Requires Google Analytics Embed API setup
- More complex but provides seamless user experience

---

## Quick Setup: Add Google Analytics Property IDs

### Step 1: Get Your Google Analytics Property ID

1. Log into [Google Analytics](https://analytics.google.com)
2. Select your property
3. Go to **Admin** (gear icon)
4. Under **Property**, click **Property Settings**
5. Copy your **Property ID** (format: `G-XXXXXXXXXX` for GA4)

### Step 2: Add Property ID to Your Projects

Update your projects in `lib/mock-data.ts`:

```typescript
{
  id: "proj-1",
  name: "Your Project Name",
  // ... other fields
  websiteUrl: "https://yourwebsite.com",
  googleAnalyticsPropertyId: "G-XXXXXXXXXX",  // Add this
  googleAnalyticsViewId: "123456789",          // Optional: For Universal Analytics
  // ... other fields
}
```

### Step 3: Test the Integration

1. Log into your admin account
2. Go to the Admin Dashboard
3. Click the "Analytics" button for any project
4. You should be redirected to Google Analytics

---

## Advanced Setup: Embedded Google Analytics (Optional)

If you want to embed Google Analytics reports directly on the page:

### Prerequisites
- Google Cloud Project
- Google Analytics account with admin access
- Service account credentials

### Step 1: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google Analytics Reporting API**

### Step 2: Create Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Give it a name (e.g., "Analytics Embed")
4. Create and download JSON key file
5. Save the key file securely (don't commit to git!)

### Step 3: Grant Access in Google Analytics

1. Copy the service account email (looks like `name@project.iam.gserviceaccount.com`)
2. Go to Google Analytics Admin
3. Under **Property Access Management**, add the service account email as a **Viewer**

### Step 4: Install Required Packages

```bash
npm install @google-analytics/data
npm install google-auth-library
```

### Step 5: Create Environment Variables

Create `.env.local`:

```env
GOOGLE_ANALYTICS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_ANALYTICS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
```

### Step 6: Create API Route for Analytics Data

Create `app/api/analytics/[propertyId]/route.ts`:

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  const { propertyId } = params;

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'bounceRate',
        },
      ],
    });

    return Response.json({ data: response });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
```

### Step 7: Update Analytics Page

Update `app/analytics/[id]/page.tsx` to fetch and display embedded data:

```typescript
// Add this to fetch embedded analytics
useEffect(() => {
  if (project?.googleAnalyticsPropertyId) {
    fetch(`/api/analytics/${project.googleAnalyticsPropertyId}`)
      .then(res => res.json())
      .then(data => {
        // Display embedded data
        setEmbeddedAnalytics(data);
      });
  }
}, [project]);
```

---

## Using Google Analytics Embed API (Alternative)

For a full embedded dashboard with charts:

### Install Required Package

```bash
npm install react-ga4
```

### Embed Using Iframe (Simpler)

You can also embed using iframe with proper authentication:

```tsx
<iframe
  src={`https://analytics.google.com/analytics/web/#/embed/report-home/a${viewId}`}
  width="100%"
  height="600"
  frameBorder="0"
  title="Google Analytics Dashboard"
/>
```

**Note**: This requires users to be logged into Google Analytics.

---

## Security Best Practices

1. **Never commit service account keys to git**
   - Add to `.gitignore`: `*.json`, `.env.local`

2. **Use environment variables**
   - Store credentials in `.env.local`
   - Access via `process.env.VARIABLE_NAME`

3. **Restrict service account permissions**
   - Grant only "Viewer" access in Google Analytics
   - Don't give edit or admin permissions

4. **Validate property IDs**
   - Ensure users can only access analytics for their projects
   - Check permissions before displaying data

---

## Recommended Approach

For most use cases, we recommend:

1. **Start with Direct Links** (current implementation)
   - Simple and quick to set up
   - No additional infrastructure needed
   - Users get full Google Analytics experience

2. **Add Embedded Analytics Later** (if needed)
   - Better user experience
   - More control over displayed metrics
   - Requires more setup and maintenance

---

## Troubleshooting

### "Property not found" error
- Verify the Property ID is correct (format: `G-XXXXXXXXXX`)
- Ensure service account has access to the property

### "Permission denied" error
- Check that the service account email is added to Google Analytics
- Verify it has at least "Viewer" role

### Iframe not loading
- Check if user is logged into Google Analytics
- Verify the property URL is correct
- Some browsers block third-party cookies (affects iframe embedding)

---

## Resources

- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Analytics Embed API](https://developers.google.com/analytics/devguides/reporting/embed/v1)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Service Account Authentication](https://cloud.google.com/docs/authentication/getting-started)

---

## Support

For issues or questions:
1. Check the Google Analytics Admin settings
2. Verify property IDs are correct in `lib/mock-data.ts`
3. Review the analytics page at `/analytics/[project-id]`
4. Check browser console for errors
