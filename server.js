import express from 'express';
import cors from 'cors';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize GA client with service account
let analyticsDataClient = null;

if (process.env.GA_SERVICE_ACCOUNT_KEY) {
  try {
    const credentials = JSON.parse(process.env.GA_SERVICE_ACCOUNT_KEY);
    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials,
    });
  } catch (error) {
    console.error('Failed to initialize GA client:', error.message);
  }
}

// Analytics endpoint
app.get('/api/analytics/:propertyId', async (req, res) => {
  let { propertyId } = req.params;
  const { startDate = '7daysAgo', endDate = 'today' } = req.query;

  if (!analyticsDataClient) {
    return res.status(500).json({ error: 'Google Analytics not configured. Please set GA_SERVICE_ACCOUNT_KEY environment variable.' });
  }

  // Handle GA4 Measurement ID (G-...) by extracting the numeric property ID
  if (propertyId.startsWith('G-')) {
    propertyId = propertyId.substring(2);
  }

  try {
    // Run report for website analytics
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'date' },
        { name: 'pagePath' }
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'sessions' }
      ],
    });

    // Format the data
    const analyticsData = response.rows.map(row => {
      const dateStr = row.dimensionValues[0].value;
      const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
      return {
        date: formattedDate,
        pagePath: row.dimensionValues[1].value,
        activeUsers: parseInt(row.metricValues[0].value),
        pageViews: parseInt(row.metricValues[1].value),
        bounceRate: parseFloat(row.metricValues[2].value) * 100, // GA4 returns as decimal 0-1
        sessions: parseInt(row.metricValues[3].value),
      };
    });

    // Aggregate by date for summary
    const aggregated = analyticsData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          pageViews: 0,
          uniqueVisitors: 0,
          bounceRate: 0,
          sessions: 0,
          count: 0
        };
      }
      acc[item.date].pageViews += item.pageViews;
      acc[item.date].uniqueVisitors += item.activeUsers;
      acc[item.date].bounceRate += item.bounceRate;
      acc[item.date].sessions += item.sessions;
      acc[item.date].count += 1;
      return acc;
    }, {});

    // Calculate averages
    const websiteAnalytics = Object.values(aggregated).map(item => ({
      ...item,
      bounceRate: item.bounceRate / item.count,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      website: websiteAnalytics,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('GA API Error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics data',
      details: error.message
    });
  }
});

// Real-time analytics (if available)
app.get('/api/analytics/:propertyId/realtime', async (req, res) => {
  let { propertyId } = req.params;

  if (!analyticsDataClient) {
    return res.status(500).json({ error: 'Google Analytics not configured' });
  }

  // Handle GA4 Measurement ID (G-...) by extracting the numeric property ID
  if (propertyId.startsWith('G-')) {
    propertyId = propertyId.substring(2);
  }

  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'city' }],
      metrics: [{ name: 'activeUsers' }],
    });

    const realtimeData = response.rows.map(row => ({
      city: row.dimensionValues[0].value,
      activeUsers: parseInt(row.metricValues[0].value),
    }));

    res.json({
      realtime: realtimeData,
      totalActiveUsers: realtimeData.reduce((sum, item) => sum + item.activeUsers, 0)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch real-time data',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Analytics API server running on http://localhost:${PORT}`);
});