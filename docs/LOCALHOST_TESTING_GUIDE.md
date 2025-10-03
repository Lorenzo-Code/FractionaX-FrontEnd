# 🧪 Localhost Testing Guide for Static Files

## ❌ Common Mistake
You're trying: `http://localhost:5173/https://fractionax.io/og-image1.png`

## ✅ Correct URLs for Localhost Testing

### **1. Test Your OG Images:**
- http://localhost:5173/og-image.png
- http://localhost:5173/og-image1.png  
- http://localhost:5173/og-social-card.png

### **2. Test Your Sitemap:**
- http://localhost:5173/sitemap.xml

### **3. Test Your Main Page:**
- http://localhost:5173/

## 🎯 How Vite Static Files Work

**In Development (localhost:5173):**
- Files in `public/` folder are served from root
- `public/og-image1.png` → `http://localhost:5173/og-image1.png`

**In Production (fractionax.io):**
- Same files are served from root
- `public/og-image1.png` → `https://fractionax.io/og-image1.png`

## 🧪 Test Your Social Media Cards Locally

### **Step 1: Test Image Loading**
```bash
# Start dev server
npm run dev

# In browser, test these URLs:
http://localhost:5173/og-social-card.png
http://localhost:5173/sitemap.xml
```

### **Step 2: Test Meta Tags**
```bash
# Visit main page
http://localhost:5173/

# Right-click → View Source
# Look for these meta tags:
<meta property="og:image" content="https://fractionax.io/og-social-card.png" />
<meta name="twitter:image" content="https://fractionax.io/og-social-card.png" />
```

### **Step 3: Test Social Cards**
**Note:** Social media platforms only crawl LIVE URLs (https://fractionax.io), not localhost.

To test social cards:
1. Deploy your changes
2. Test: https://fractionax.io/og-social-card.png
3. Use Facebook Debugger with: https://fractionax.io

## 🚀 Expected Results

### **Localhost (Development):**
- ✅ `http://localhost:5173/og-social-card.png` → Shows image
- ✅ `http://localhost:5173/` → Shows updated meta tags

### **Production (After Deployment):**
- ✅ `https://fractionax.io/og-social-card.png` → Shows image
- ✅ Facebook Debugger → Shows rich card preview

## 🔧 If Images Still Don't Load on Localhost

### **Vite Configuration Issue:**
```javascript
// vite.config.js - ensure this is set:
export default defineConfig({
  publicDir: 'public', // This should be default
  // ... rest of config
});
```

### **Clear Vite Cache:**
```bash
# Delete cache and restart
rm -rf node_modules/.vite
npm run dev
```

### **Check File Permissions:**
```bash
# Ensure files are readable
ls -la public/og-*.png
```

## 💡 Key Points

1. **Localhost testing** is for development verification only
2. **Social media cards** only work with live HTTPS URLs
3. **Meta tag testing** can be done locally by viewing source
4. **Final testing** must be done on deployed site (fractionax.io)