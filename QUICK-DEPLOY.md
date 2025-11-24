# ⚡ Quick Deploy Guide - BeatForge Studio

Get your BeatForge Studio online in 5 minutes!

## 🎯 Before You Start

1. **Update Your Domain** in these files:
   - `sitemap.xml` - Replace `https://r3habb99.github.io/`
   - `robots.txt` - Update Sitemap URL
   - `index.html` - Update meta tags (lines 20, 24, 28, 32, 63)

2. **Test Locally:**

   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000/
   ```

---

## 🚀 Deploy to Netlify (Easiest)

### Option 1: Drag & Drop (No Git Required)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire project folder
3. Done! Your site is live

### Option 2: Git Deploy (Recommended)

```bash
# 1. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 2. Push to GitHub
git remote add origin https://github.com/yourusername/beatforge-studio.git
git push -u origin main

# 3. Deploy on Netlify
# - Go to netlify.com
# - Click "New site from Git"
# - Select your repository
# - Click "Deploy site"
```

**Custom Domain:**

- Site Settings → Domain management → Add custom domain

---

## 🔷 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (one command!)
vercel

# Follow prompts, done!
```

**Or use Git:**

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Click Deploy

---

## 📄 Deploy to GitHub Pages

```bash
# 1. File is already named index.html - ready to go!
# All references have been updated

# 2. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/beatforge-studio.git
git push -u origin main

# 3. Enable GitHub Pages
# Go to: Settings → Pages → Source: main branch → Save
```

Your site: `https://yourusername.github.io/repository-name/`

---

## 🌐 Deploy to Your Own Server

### Apache Server

```bash
# 1. Upload files
scp -r * user@yourserver.com:/var/www/html/

# 2. Enable modules
sudo a2enmod rewrite deflate expires headers
sudo systemctl restart apache2

# 3. Done! Visit your domain
```

### Nginx Server

```bash
# 1. Upload files
scp -r * user@yourserver.com:/var/www/beatforge/

# 2. Create config (see DEPLOYMENT.md for full config)
sudo nano /etc/nginx/sites-available/beatforge

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/beatforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Install SSL
sudo certbot --nginx -d r3habb99.github.io
```

---

## ✅ Post-Deployment Checklist

- [ ] Test site on live URL
- [ ] Test audio initialization
- [ ] Test PWA installation (Chrome: install icon in address bar)
- [ ] Submit sitemap to Google Search Console
- [ ] Test on mobile device
- [ ] Check Lighthouse score (aim for 90+)

---

## 🔧 Quick Fixes

### PWA Not Installing?

1. Ensure HTTPS is enabled
2. Check manifest.json is accessible: `r3habb99.github.io/manifest.json`
3. Clear browser cache and try again

### Service Worker Errors?

1. Update cache version in `service-worker.js` (line 6)
2. Clear browser cache
3. Hard reload (Ctrl+Shift+R)

### Slow Performance?

1. Enable Cloudflare (free CDN)
2. Compress images
3. Enable gzip/brotli compression

---

## 📊 Monitor Your Site

**Free Tools:**

- [Google Search Console](https://search.google.com/search-console) - SEO
- [PageSpeed Insights](https://pagespeed.web.dev/) - Performance
- [Uptime Robot](https://uptimerobot.com/) - Monitoring

---

## 🎉 You're Live

Share your creation:

- Tweet with #BeatForgeStudio
- Share on Reddit (r/WebAudio, r/MusicProduction)
- Post on Product Hunt
- Share in music production communities

---

**Need detailed instructions?** See [DEPLOYMENT.md](DEPLOYMENT.md)

**Having issues?** Check the troubleshooting section in DEPLOYMENT.md
