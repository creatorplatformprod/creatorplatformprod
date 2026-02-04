# Quick Setup Checklist

## 🔧 Setup Steps (Do These First)

### 1. MongoDB Atlas
- [ ] Create free cluster
- [ ] Enable Data API
- [ ] Create API key (save it!)
- [ ] Create database: `creator-platform`
- [ ] Set secrets:
  ```bash
  wrangler secret put MONGODB_DATA_API_URL
  wrangler secret put MONGODB_API_KEY
  wrangler secret put MONGODB_DATA_SOURCE
  wrangler secret put MONGODB_DB_NAME
  ```

### 2. Google OAuth
- [ ] Create Google Cloud project
- [ ] Enable OAuth consent screen
- [ ] Create OAuth credentials
- [ ] Set redirect URI: `https://yourdomain.com/api/auth/google/callback`
- [ ] Set secrets:
  ```bash
  wrangler secret put GOOGLE_CLIENT_ID
  wrangler secret put GOOGLE_CLIENT_SECRET
  ```

### 3. Cloudflare R2 (File Storage)
- [ ] Create R2 bucket: `creator-platform-media`
- [ ] Create API token
- [ ] Edit `wrangler.toml` to add R2 binding
- [ ] Set secrets (optional):
  ```bash
  wrangler secret put R2_PUBLIC_DOMAIN
  ```

### 4. Payment System
- [ ] Get USDC wallet address from Card2Crypto
- [ ] Set secrets:
  ```bash
  wrangler secret put USDC_WALLET_ADDRESS
  wrangler secret put PAYMENT_CALLBACK_URL
  wrangler secret put PLATFORM_FEE_PERCENT
  wrangler secret put FRONTEND_URL
  ```

### 5. JWT Secret
- [ ] Generate secret: `openssl rand -base64 32`
- [ ] Set secret:
  ```bash
  wrangler secret put JWT_SECRET
  ```

### 6. Optional: Email/Telegram
- [ ] Resend API key (for emails)
- [ ] Telegram bot token (for notifications)
- [ ] Set secrets if using

---

## 💻 Code Integration (Do These Next)

### 7. Frontend API Setup
- [x] API helper file created: `src/lib/api.ts`
- [ ] Update `src/pages/Landing.tsx` - replace TODOs with API calls
- [ ] Update `src/pages/CreatorDashboard.tsx` - replace TODOs with API calls
- [ ] Update `src/pages/CreatorProfile.tsx` - replace TODO with API call
- [ ] Create `.env.local` with `VITE_API_URL`

### 8. Import API Helper
In each page component, add:
```typescript
import { api } from '@/lib/api';
```

---

## 🧪 Testing (Do These Last)

### 9. Backend Testing
- [ ] Test health endpoint: `curl https://your-worker.workers.dev/api/health`
- [ ] Test registration
- [ ] Test login
- [ ] Test Google OAuth redirect
- [ ] Test collection creation
- [ ] Test status card creation
- [ ] Test file upload

### 10. Frontend Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test Google OAuth
- [ ] Test profile updates
- [ ] Test status card creation
- [ ] Test collection creation
- [ ] Test file upload
- [ ] Test public profile (`/:username`)
- [ ] Test payment flow

---

## 🚀 Deployment

### 11. Deploy Backend
```bash
cd backend
wrangler deploy
```

### 12. Deploy Frontend
- [ ] Push to GitHub
- [ ] Connect to Cloudflare Pages
- [ ] Set environment variable: `VITE_API_URL`
- [ ] Deploy

---

## ✅ Final Checks

- [ ] All secrets configured
- [ ] MongoDB connected
- [ ] OAuth working
- [ ] File upload working
- [ ] Payment flow working
- [ ] Frontend connected to backend
- [ ] Public profiles displaying
- [ ] "Unlock Everything" bundle appears

---

## 📚 Documentation Files

- **SETUP_AND_TESTING_PLAN.md** - Detailed step-by-step guide
- **MONGODB_SETUP.md** - MongoDB specific setup
- **REQUIREMENTS_VERIFICATION.md** - What was built
- **IMPLEMENTATION_COMPLETE.md** - Feature summary
- **QUICK_SETUP_CHECKLIST.md** - This file

---

## 🆘 Common Issues

**MongoDB not connecting?**
- Check API URL format
- Verify API key permissions
- Check network access settings

**OAuth not working?**
- Verify redirect URI matches exactly
- Check OAuth consent screen is published
- Verify client ID/secret

**File upload failing?**
- Check R2 bucket name
- Verify R2 binding in wrangler.toml
- Check file size (25MB limit)

**API calls failing?**
- Check CORS headers
- Verify API_BASE_URL is correct
- Check token in localStorage
- Verify endpoint URLs match backend

---

**Need help?** Refer to `SETUP_AND_TESTING_PLAN.md` for detailed instructions.


