# MongoDB Atlas Data API Setup Guide

This project uses MongoDB Atlas Data API to connect from Cloudflare Workers.

## Prerequisites

1. MongoDB Atlas account (free tier available)
2. A MongoDB cluster created in Atlas
3. Cloudflare Workers account

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Wait for cluster to be created (2-3 minutes)

## Step 2: Enable Data API

1. In MongoDB Atlas, go to **Data API** (left sidebar)
2. Click **Create** to enable Data API
3. Note your **Data API URL** (e.g., `https://data.mongodb-api.com/app/xxxxx/endpoint/data/v1`)
4. Create an **API Key**:
   - Click **Create API Key**
   - Give it a name (e.g., "Creator Platform API Key")
   - Set permissions: **Read and Write**
   - Copy the API key (you won't see it again!)

## Step 3: Get Your Cluster Name

1. In MongoDB Atlas, go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Note your **Cluster Name** (usually `Cluster0` or similar)
4. Create a database named `creator-platform` (or use existing)

## Step 4: Configure Cloudflare Workers Secrets

Set the following secrets in your Cloudflare Workers project:

```bash
# Navigate to backend directory
cd backend

# Set MongoDB secrets
wrangler secret put MONGODB_DATA_API_URL
# Paste your Data API URL when prompted

wrangler secret put MONGODB_API_KEY
# Paste your API key when prompted

wrangler secret put MONGODB_DATA_SOURCE
# Enter your cluster name (e.g., Cluster0)

wrangler secret put MONGODB_DB_NAME
# Enter your database name (e.g., creator-platform)

wrangler secret put JWT_SECRET
# Generate a random secret: openssl rand -base64 32

# For Google OAuth (optional for now)
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

## Step 5: Update wrangler.toml

The `wrangler.toml` file already has the structure. You can optionally set default values:

```toml
[vars]
MONGODB_DB_NAME = "creator-platform"
MONGODB_DATA_SOURCE = "Cluster0"
```

**Note:** Never commit API keys or secrets to git! Use `wrangler secret put` for sensitive data.

## Step 6: Test Connection

1. Deploy your worker:
   ```bash
   wrangler deploy
   ```

2. Test the health endpoint:
   ```bash
   curl https://your-worker.your-subdomain.workers.dev/api/health
   ```

3. Test registration:
   ```bash
   curl -X POST https://your-worker.your-subdomain.workers.dev/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"test123","displayName":"Test User"}'
   ```

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_DATA_API_URL` | Your Atlas Data API endpoint URL | `https://data.mongodb-api.com/app/xxxxx/endpoint/data/v1` |
| `MONGODB_API_KEY` | Your Data API key | `xxxxxxxxxxxxxxxxxxxx` |
| `MONGODB_DATA_SOURCE` | Your cluster name | `Cluster0` |
| `MONGODB_DB_NAME` | Database name | `creator-platform` |
| `JWT_SECRET` | Secret for JWT tokens | Random 32+ character string |
| `CORS_ORIGIN` | Allowed origin for CORS | `https://yourdomain.com` |

## Troubleshooting

### Error: "MongoDB API error: Unauthorized"
- Check that your API key is correct
- Verify API key has Read and Write permissions

### Error: "Database not found"
- Make sure the database name matches
- Create the database in Atlas if it doesn't exist

### Error: "Collection not found"
- Collections are created automatically on first insert
- This is normal - MongoDB creates collections when you first insert data

### Error: "Invalid cluster name"
- Check your cluster name in Atlas
- It's usually shown in the connection string or cluster settings

## Next Steps

Once MongoDB is connected:
1. Test user registration
2. Test collection creation
3. Test status card creation
4. Verify data appears in MongoDB Atlas UI

## Security Notes

- Never commit secrets to version control
- Use different API keys for development and production
- Rotate API keys periodically
- Use environment-specific secrets in Cloudflare Workers

