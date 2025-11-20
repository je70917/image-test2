# Cloudflare Workers Setup with API Token

## Step 1: Create API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Click **"Use template"** next to **"Edit Cloudflare Workers"**
4. Review the permissions (should include):
   - Account > Workers Scripts > Edit
   - Account > Workers KV Storage > Edit
   - Zone > Workers Routes > Edit (if using custom domains)
5. Click **"Continue to summary"**
6. Click **"Create Token"**
7. **Copy the token** (you won't be able to see it again!)

## Step 2: Set the Token

### Option A: Environment Variable (Temporary - for this session only)

In your terminal, run:

```bash
export CLOUDFLARE_API_TOKEN="your-token-here"
```

Then deploy:

```bash
npm run deploy
```

### Option B: .env File (Persistent - recommended)

1. Create a `.env` file in the project root:

```bash
echo "CLOUDFLARE_API_TOKEN=your-token-here" > .env
```

2. The `.env` file is already in `.gitignore` so it won't be committed

3. Deploy:

```bash
npm run deploy
```

### Option C: Wrangler Config (Account-wide)

Store your token in Wrangler's config:

```bash
echo "your-token-here" | npx wrangler config set CLOUDFLARE_API_TOKEN
```

## Step 3: Deploy

Once the token is set, run:

```bash
npm run deploy
```

This will:

1. Build your Vite project
2. Deploy to Cloudflare Workers
3. Output your live URL

## Verify Token is Working

Test your authentication:

```bash
npx wrangler whoami
```

You should see your account information.

## Troubleshooting

### "Authentication error"

- Double-check your token is correct
- Make sure the token has Workers edit permissions
- Try creating a new token

### "Account ID required"

If you get an account ID error, add it to `wrangler.toml`:

```toml
account_id = "your-account-id-here"
```

Find your account ID at: https://dash.cloudflare.com/ (in the URL or sidebar)

## Security Notes

- ✅ `.env` is in `.gitignore` - safe from git commits
- ✅ Never share your API token
- ✅ Tokens can be revoked at any time from the Cloudflare dashboard
- ✅ Use environment variables, not hardcoded tokens
