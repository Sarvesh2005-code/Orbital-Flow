# Google Analytics Setup Guide for Orbital Flow

## Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Go to **Admin** → **Data Streams** → **Web**
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 2: Set Up Environment Variable

### Option A: Local Development (.env.local)
Create a file called `.env.local` in your project root with:
```
NEXT_PUBLIC_GA_ID=G-LXYV05YJP8
```

### Your Google Analytics Details:
- **Measurement ID**: `G-LXYV05YJP8`
- **Stream ID**: `12127023355`
- **Stream Name**: `Orbital-Flow`
- **Stream URL**: `https://orbital-flow.vercel.app`

### Option B: Vercel Deployment
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-LXYV05YJP8`
   - **Environment**: Production, Preview, Development

## Step 3: Test Your Setup

### Local Testing
1. Start your development server: `npm run dev`
2. Open browser dev tools → Network tab
3. Look for requests to `googletagmanager.com`
4. Check Console for any GA-related errors

### Production Testing
1. Deploy to Vercel
2. Visit your live site
3. Use Google Analytics Real-time reports to verify data

## Step 4: Using Analytics Tracking

The app now includes a utility file (`src/lib/analytics.ts`) with pre-built tracking functions:

```typescript
import { trackEvent } from '@/lib/analytics';

// Track user actions
trackEvent.login();
trackEvent.createTask();
trackEvent.useAI('summarize-notes');
```

## Step 5: Verify Everything Works

1. **Check Environment Variable**: Ensure `NEXT_PUBLIC_GA_ID` is set
2. **Check Network Requests**: Look for Google Analytics requests
3. **Check Real-time Reports**: Verify data appears in GA dashboard
4. **Test Custom Events**: Use the tracking functions in your app

## Troubleshooting

- **No data in GA**: Check if `NEXT_PUBLIC_GA_ID` is correctly set
- **Console errors**: Ensure the GA ID format is correct (`G-XXXXXXXXXX`)
- **Ad blockers**: Test in incognito mode or disable ad blockers
- **Development vs Production**: Make sure environment variables are set for both

## Next Steps

1. Set up your environment variable
2. Test locally and in production
3. Commit your changes
4. Merge to main branch
