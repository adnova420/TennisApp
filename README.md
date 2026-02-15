# GATL — Greater Amherstburg Tennis League

Player portal for Essex County's premier outdoor public tennis league.

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to GitHub Pages

### One-time setup:

1. Create a new repo on GitHub (e.g. `gatl-app`)
2. Update `base` in `vite.config.js` to match your repo name:
   ```js
   base: '/gatl-app/',  // ← your repo name
   ```
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/gatl-app.git
   git push -u origin main
   ```
4. In your GitHub repo, go to **Settings → Pages → Source** and select **GitHub Actions**

The included GitHub Action will automatically build and deploy on every push to `main`.

Your site will be live at: `https://YOUR_USERNAME.github.io/gatl-app/`

### Manual deploy (alternative):
```bash
npm run deploy
```

## Accounts

| Role   | Email            | Password |
|--------|------------------|----------|
| Admin  | admin@gatl.ca    | admin    |
| Player | (any email)      | (any)    |

## Tech Stack

- React 18 + Vite
- CSS-in-JS (inline styles)
- localStorage for persistence (polyfill for Claude's storage API)
- Oswald + Barlow fonts via Google Fonts
- Zero external UI libraries
