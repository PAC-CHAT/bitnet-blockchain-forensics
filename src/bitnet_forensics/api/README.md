# Vercel Web Analytics Integration

This directory contains the FastAPI application with integrated Vercel Web Analytics.

## Overview

The application now includes:
- A landing page at the root (`/`) with Vercel Web Analytics tracking
- Static file serving capability via `/static/`
- The existing API endpoints (e.g., `/health`, `/docs`)

## Vercel Web Analytics

The Vercel Web Analytics script is integrated into the main landing page (`templates/index.html`) using the HTML implementation method:

```html
<!-- Vercel Web Analytics -->
<script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

## Deployment

### Prerequisites

1. Enable Web Analytics in your Vercel project:
   - Go to your [Vercel dashboard](https://vercel.com/dashboard)
   - Select your project
   - Click the **Analytics** tab
   - Click **Enable**

2. Deploy your application to Vercel:
   ```bash
   vercel deploy
   ```

### Verifying Analytics

After deployment:

1. Visit your deployed application's homepage
2. Open your browser's Developer Tools (Network tab)
3. Look for a request to `/_vercel/insights/view`
4. If you see this request, analytics is working correctly

## Viewing Analytics Data

Once deployed and receiving traffic:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab
4. View your visitor data, page views, and metrics

## Structure

```
api/
├── __init__.py
├── app.py              # Main FastAPI application with analytics
├── static/             # Static files (CSS, JS, images)
├── templates/          # HTML templates
│   └── index.html     # Landing page with Vercel Analytics
└── README.md          # This file
```

## Custom Events (Optional)

For advanced analytics tracking (requires Pro or Enterprise plan), you can add custom events to track user interactions like button clicks or form submissions. See the [Vercel Analytics documentation](https://vercel.com/docs/analytics/custom-events) for more information.

## Privacy & Compliance

Vercel Web Analytics is privacy-friendly and doesn't require cookie consent banners in most jurisdictions. Learn more about [Vercel's privacy and compliance standards](https://vercel.com/docs/analytics/privacy-policy).
