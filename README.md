# Wedding Invitation - Anandkumar & Manimozhi

A beautiful bilingual (English/Tamil) wedding invitation website.

## Features
- Bilingual support (English & Tamil) with URL parameter switching
- Add to Calendar (.ics file, works on all platforms)
- Download invitation card as PNG
- Google Maps integration
- Fully responsive design

## URL Language Parameters
- English: `?lang=en` (default)
- Tamil: `?lang=ta`

## Deploy on GitHub Pages (Free Hosting)

### Step 1: Create GitHub Repository
```bash
cd /Users/anand-8991/Documents/invitation
git init
git add .
git commit -m "Wedding invitation website"
```

### Step 2: Push to GitHub
```bash
# Create a repo on GitHub (https://github.com/new) named "invitation"
git remote add origin https://github.com/<your-username>/invitation.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**

Your site will be live at: `https://<your-username>.github.io/invitation/`

### Custom Domain (GoDaddy)
The site is configured with the custom domain `anandhayazh.in`. See the CNAME file in the repo root.

After setting up DNS records on GoDaddy (4 A records pointing to GitHub Pages IPs + a www CNAME), enable the custom domain in **Settings → Pages → Custom domain**.

### Sharing Links
- Default: `https://anandhayazh.in`
- English: `https://anandhayazh.in?lang=en`
- Tamil: `https://anandhayazh.in?lang=ta`
