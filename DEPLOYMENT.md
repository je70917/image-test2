# Cloudflare Workers Deployment Guide

This project is configured to deploy to Cloudflare Workers (not Pages).

## Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/sign-up
2. **Wrangler CLI**: Already installed as a dev dependency

## Setup

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### 2. Configure Your Worker (Optional)

Edit `wrangler.toml` to customize:

- `name`: Your worker name (currently "image-gallery")
- `compatibility_date`: Keep this updated
- Custom routes/domains if needed

## Deployment Commands

### Build and Deploy (Production)

```bash
npm run deploy
```

This will:

1. Build your Vite project (`npm run build`)
2. Deploy to Cloudflare Workers (`wrangler deploy`)

### Deploy Only (if already built)

```bash
npm run cf:deploy
```

### Test Locally with Wrangler

```bash
npm run cf:dev
```

This builds and runs your worker locally using Wrangler's dev server.

## What Gets Deployed

- All static assets from the `dist` folder (HTML, CSS, JS, images)
- Assets are served via Cloudflare's KV storage
- The worker script (`worker.js`) handles routing and serves files

## After Deployment

After running `npm run deploy`, Wrangler will output:

- Your worker URL (e.g., `https://image-gallery.your-subdomain.workers.dev`)
- Deployment status and details

## Custom Domain (Optional)

To use a custom domain:

1. Add your domain to Cloudflare
2. Uncomment and configure the `routes` section in `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "yourdomain.com/*", zone_name = "yourdomain.com" }
   ]
   ```
3. Deploy again with `npm run deploy`

## Troubleshooting

### Authentication Issues

```bash
npx wrangler logout
npx wrangler login
```

### Build Errors

Make sure the build completes successfully first:

```bash
npm run build
```

### Check Worker Logs

```bash
npx wrangler tail
```

## Project Structure

```
ImageGallery/
├── worker.js          # Cloudflare Worker script
├── wrangler.toml      # Wrangler configuration
├── dist/              # Built assets (created by npm run build)
└── src/               # Source code
```

## Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [KV Asset Handler](https://github.com/cloudflare/kv-asset-handler)
