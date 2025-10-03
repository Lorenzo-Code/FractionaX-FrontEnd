# 🔧 Cloudflare Social Media Crawler Configuration

## Issue
Social media platforms (Facebook, Twitter, LinkedIn, Discord) can't read your site's meta tags because Cloudflare's JavaScript challenge blocks their crawlers.

## Solution: Whitelist Social Media Crawlers

### Step 1: Access Cloudflare Dashboard
1. Login to your Cloudflare dashboard
2. Select your `fractionax.io` domain
3. Go to **Security** → **WAF** → **Custom Rules**

### Step 2: Create Social Media Bot Bypass Rule

**Rule Name:** `Allow Social Media Crawlers`

**Rule Expression:**
```
(http.user_agent contains "facebookexternalhit") or 
(http.user_agent contains "Twitterbot") or 
(http.user_agent contains "LinkedInBot") or 
(http.user_agent contains "WhatsApp") or 
(http.user_agent contains "SkypeBot") or 
(http.user_agent contains "TelegramBot") or 
(http.user_agent contains "DiscordBot") or 
(http.user_agent contains "SlackBot") or 
(http.user_agent contains "Microsoft-Preview") or 
(http.user_agent contains "GoogleBot") or
(http.user_agent contains "bingbot")
```

**Action:** `Skip` - Security checks for all

### Step 3: Alternative - Disable JS Challenge for Bots
1. Go to **Security** → **Settings**
2. Under **Challenge Passage**, set to **30 minutes** 
3. Under **Browser Integrity Check**, toggle **Off** for known bots

### Step 4: Test the Fix
Use online tools to test:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Expected Result
After implementation, your social media cards should show:
- ✅ Large image preview (1200x630)
- ✅ Site title and description
- ✅ FractionaX branding
- ✅ Professional appearance across all platforms