# 🔍 Social Media Card Troubleshooting Guide

## Issue: Links show as plain text instead of rich cards

### Step 1: Test What Social Media Crawlers See

**Test with Facebook Debugger:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://fractionax.io`
3. Click "Debug"

**Expected Results:**
- ✅ Should show your OG image, title, and description
- ❌ If shows error or Cloudflare challenge = Rule not working

### Step 2: Verify Cloudflare Rule Status

**Check your Cloudflare rule:**
1. Cloudflare Dashboard → Security → WAF → Custom Rules
2. Find "Allow Social Media Crawlers" rule
3. Verify status is **Enabled**
4. Check "Last 24 hours" for matches

### Step 3: Test Different Social Platforms

**Manual Testing:**
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- OpenGraph Preview: https://www.opengraph.xyz/

### Step 4: Advanced Cloudflare Configuration

If still not working, try this enhanced rule:

**Rule Expression (Enhanced):**
```
(http.user_agent contains "facebookexternalhit") or 
(http.user_agent contains "Twitterbot") or 
(http.user_agent contains "LinkedInBot") or 
(http.user_agent contains "WhatsApp") or 
(http.user_agent contains "DiscordBot") or 
(http.user_agent contains "SlackBot") or 
(http.user_agent contains "TelegramBot") or 
(http.user_agent contains "GoogleBot") or
(http.user_agent contains "bingbot") or
(http.user_agent contains "Applebot") or
(http.user_agent contains "Microsoft-Preview") or
(cf.bot_management.score le 30)
```

**Action:** Skip all security features

### Step 5: Alternative - IP Whitelist Method

**Whitelist Social Media IPs:**
1. Security → WAF → Tools
2. Add IP Access Rules:
   - Facebook: `173.252.0.0/16`, `31.13.0.0/16`
   - Twitter: `199.16.156.0/22`, `199.59.148.0/22`
   - LinkedIn: `108.174.0.0/16`
   - Action: Allow

### Step 6: Test Locally

**Create test HTML file:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta property="og:title" content="Test - FractionaX" />
    <meta property="og:description" content="Testing social media cards" />
    <meta property="og:image" content="https://fractionax.io/og-image1.png" />
    <meta property="og:url" content="https://fractionax.io/test.html" />
</head>
<body><h1>Social Media Test</h1></body>
</html>
```

Upload to `/public/test.html` and test this URL

### Step 7: Cache Clearing

**Clear Social Media Caches:**
1. Facebook: Use "Fetch new scrape information" in debugger
2. Twitter: Cards are cached for ~7 days
3. LinkedIn: Use "Post Inspector" to refresh
4. Discord: No manual refresh, wait ~24 hours

### Common Issues & Solutions

**Issue 1: Cloudflare Still Challenging**
- Rule order might be wrong (should be #1)
- Expression syntax might be incorrect
- Try disabling "Browser Integrity Check" globally

**Issue 2: Wrong Meta Tags Served**
- Check if your React app is properly updating `<head>`
- Verify `useDocumentHead` hook is working
- Test with view-source to see actual HTML

**Issue 3: Image Not Loading**
- Verify `https://fractionax.io/og-image1.png` loads directly
- Check image is exactly 1200x630 pixels
- Ensure image is under 8MB

**Issue 4: Platform-Specific Problems**
- Facebook: Requires `og:image`, `og:title`, `og:description`
- Twitter: Needs `twitter:card`, `twitter:image`
- LinkedIn: Uses OpenGraph tags
- Discord: Very strict about image formats

### Emergency Workaround

If nothing works, add static meta tags to your `index.html`:

```html
<!-- Add these to your index.html <head> -->
<meta property="og:title" content="FractionaX - Tokenized Real Estate Investing" />
<meta property="og:description" content="Trade fractional real estate like stocks. Invest with $100, earn dividends. AI-powered property discovery on Base blockchain." />
<meta property="og:image" content="https://fractionax.io/og-image1.png" />
<meta property="og:url" content="https://fractionax.io" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="FractionaX" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="FractionaX - Tokenized Real Estate Investing" />
<meta name="twitter:description" content="Trade fractional real estate like stocks. Invest with $100, earn dividends." />
<meta name="twitter:image" content="https://fractionax.io/og-image1.png" />
<meta name="twitter:site" content="@FractionaX" />
```