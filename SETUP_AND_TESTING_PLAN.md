# Complete Setup & Testing Plan

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Cloudflare account (free tier works)
- [ ] MongoDB Atlas account (free tier works)
- [ ] Google Cloud Console account (for OAuth)
- [ ] Card2Crypto account (for payments)
- [ ] GitHub account (for deployment)
- [ ] Node.js installed (v18+)
- [ ] Wrangler CLI installed (`npm install -g wrangler`)

---

## 🔧 PHASE 1: MongoDB Setup

### Step 1.1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **FREE (M0)** tier
5. Select a cloud provider and region (choose closest to your users)
6. Click **"Create"**
7. Wait 2-3 minutes for cluster creation

### Step 1.2: Enable Data API
1. In MongoDB Atlas, click **"Data API"** in left sidebar
2. Click **"Create"** to enable Data API
3. Copy your **Data API URL** (looks like: `https://data.mongodb-api.com/app/xxxxx/endpoint/data/v1`)
4. Click **"Create API Key"**
5. Name it: `Creator Platform API Key`
6. Set permissions: **Read and Write**
7. **COPY THE API KEY** (you won't see it again!)
8. Note your **Cluster Name** (usually `Cluster0`)

### Step 1.3: Create Database
1. Click **"Database"** in left sidebar
2. Click **"Browse Collections"**
3. Click **"Create Database"**
4. Database name: `creator-platform`
5. Collection name: `users` (will be created automatically)
6. Click **"Create"**

### Step 1.4: Configure Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add Cloudflare IPs)
4. Click **"Confirm"**

### Step 1.5: Set MongoDB Secrets in Cloudflare
```bash
cd C:\Users\User\Desktop\creator-platform\backend

# Set MongoDB connection secrets
wrangler secret put MONGODB_DATA_API_URL
# Paste: https://data.mongodb-api.com/app/xxxxx/endpoint/data/v1

wrangler secret put MONGODB_API_KEY
# Paste: your API key from Step 1.2

wrangler secret put MONGODB_DATA_SOURCE
# Enter: Cluster0 (or your cluster name)

wrangler secret put MONGODB_DB_NAME
# Enter: creator-platform
```

**✅ Test MongoDB Connection:**
```bash
# Deploy worker
wrangler deploy

# Test health endpoint
curl https://your-worker.your-subdomain.workers.dev/api/health
```

---

## 🔐 PHASE 2: Google OAuth Setup

### Step 2.1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Project name: `Creator Platform`
4. Click **"Create"**

### Step 2.2: Enable OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. User Type: **External** → **Create**
3. Fill in required fields:
   - App name: `Creator Platform`
   - User support email: Your email
   - Developer contact: Your email
4. Click **"Save and Continue"**
5. Scopes: Click **"Add or Remove Scopes"**
   - Select: `userinfo.email`, `userinfo.profile`
6. Click **"Save and Continue"**
7. Test users: Add your email (for testing)
8. Click **"Save and Continue"**

### Step 2.3: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `Creator Platform Web Client`
5. Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)
6. Authorized redirect URIs:
   - `http://localhost:5173/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Click **"Create"**
8. **COPY Client ID and Client Secret**

### Step 2.4: Set Google OAuth Secrets
```bash
cd C:\Users\User\Desktop\creator-platform\backend

wrangler secret put GOOGLE_CLIENT_ID
# Paste: Your Client ID from Step 2.3

wrangler secret put GOOGLE_CLIENT_SECRET
# Paste: Your Client Secret from Step 2.3
```

**✅ Test Google OAuth:**
1. Visit: `https://your-worker.workers.dev/api/auth/google`
2. Should redirect to Google login
3. After login, should redirect back with token

---

## 💾 PHASE 3: Cloudflare R2 Setup (File Storage)

### Step 3.1: Create R2 Bucket
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"R2"** in left sidebar
3. Click **"Create bucket"**
4. Bucket name: `creator-platform-media`
5. Location: Choose closest to users
6. Click **"Create bucket"**

### Step 3.2: Configure R2 Public Access (Optional)
1. Click on your bucket
2. Go to **"Settings"** tab
3. Enable **"Public Access"** (if you want direct URLs)
4. Set **"Custom Domain"** (optional, for CDN)
   - Example: `cdn.yourdomain.com`
5. Save settings

### Step 3.3: Create R2 API Token
1. Go to **"Manage R2 API Tokens"**
2. Click **"Create API Token"**
3. Token name: `Creator Platform Upload`
4. Permissions: **Object Read & Write**
5. Bucket: Select `creator-platform-media`
6. Click **"Create API Token"**
7. **COPY Access Key ID and Secret Access Key**

### Step 3.4: Configure R2 in Wrangler
Edit `backend/wrangler.toml`:
```toml
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "creator-platform-media"
```

Or set via secrets:
```bash
wrangler secret put R2_ACCESS_KEY_ID
# Paste: Your Access Key ID

wrangler secret put R2_SECRET_ACCESS_KEY
# Paste: Your Secret Access Key

wrangler secret put R2_PUBLIC_DOMAIN
# Enter: cdn.yourdomain.com (or leave empty if using R2 URLs)
```

**✅ Test R2 Upload:**
```bash
# Test upload endpoint (after frontend is connected)
curl -X POST https://your-worker.workers.dev/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg"
```

---

## 💳 PHASE 4: Payment System Setup

### Step 4.1: Card2Crypto Setup
1. Go to [Card2Crypto](https://card2crypto.org/)
2. Sign up or log in
3. Get your **USDC Wallet Address**
4. Configure callback URL: `https://your-worker.workers.dev/api/payment/callback`

### Step 4.2: Set Payment Secrets
```bash
cd C:\Users\User\Desktop\creator-platform\backend

wrangler secret put USDC_WALLET_ADDRESS
# Paste: Your USDC wallet address from Card2Crypto

wrangler secret put PAYMENT_CALLBACK_URL
# Enter: https://your-worker.workers.dev/api/payment/callback

wrangler secret put PLATFORM_FEE_PERCENT
# Enter: 5 (or your desired percentage)
```

### Step 4.3: Configure Frontend URL
```bash
wrangler secret put FRONTEND_URL
# Enter: https://yourdomain.com (or http://localhost:5173 for dev)
```

**✅ Test Payment Flow:**
1. Create a test collection
2. Initiate payment
3. Complete test payment
4. Verify callback works
5. Check access token generation

---

## 🔑 PHASE 5: JWT Secret Setup

### Step 5.1: Generate JWT Secret
```bash
# Generate secure random secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 5.2: Set JWT Secret
```bash
wrangler secret put JWT_SECRET
# Paste: Your generated secret
```

---

## 📧 PHASE 6: Email Notifications (Optional)

### Step 6.1: Resend Setup
1. Go to [Resend](https://resend.com/)
2. Sign up for free account
3. Verify your domain (or use test domain)
4. Get your **API Key**

### Step 6.2: Set Email Secret
```bash
wrangler secret put RESEND_API_KEY
# Paste: Your Resend API key
```

### Step 6.3: Telegram Notifications (Optional)
```bash
wrangler secret put TELEGRAM_BOT_TOKEN
# Get from @BotFather on Telegram

wrangler secret put TELEGRAM_CHAT_ID
# Your Telegram chat ID
```

---

## 🎨 PHASE 7: Frontend API Integration

### Step 7.1: Create API Configuration File
Create `src/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-worker.workers.dev';

export const api = {
  // Auth
  register: async (data: { username: string; email: string; password: string; displayName: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getCurrentUser: async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Profile
  updateProfile: async (token: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Status Cards
  getStatusCards: async (username: string) => {
    const res = await fetch(`${API_BASE_URL}/api/status-cards/creator/${username}`);
    return res.json();
  },

  createStatusCard: async (token: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/api/status-cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Collections
  getCollections: async (username: string) => {
    const res = await fetch(`${API_BASE_URL}/api/collections/creator/${username}`);
    return res.json();
  },

  createCollection: async (token: string, data: any) => {
    const res = await fetch(`${API_BASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Upload
  uploadFile: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  // Public Profile
  getCreatorProfile: async (username: string) => {
    const res = await fetch(`${API_BASE_URL}/${username}`);
    return res.json();
  }
};
```

### Step 7.2: Update Landing Page
Replace TODOs in `src/pages/Landing.tsx`:
```typescript
import { api } from '@/lib/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (isLogin) {
      const result = await api.login(formData.email, formData.password);
      if (result.success) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
      }
    } else {
      const result = await api.register(formData);
      if (result.success) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
};
```

### Step 7.3: Update Creator Dashboard
Replace TODOs in `src/pages/CreatorDashboard.tsx`:
```typescript
import { api } from '@/lib/api';

const loadUserData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/');
    return;
  }
  
  const userResult = await api.getCurrentUser(token);
  if (userResult.success) {
    setUser(userResult.user);
    setProfileData({
      displayName: userResult.user.displayName || '',
      bio: userResult.user.bio || '',
      walletAddress: userResult.user.walletAddress || '',
      telegramUsername: userResult.user.telegramUsername || '',
      domainEmail: userResult.user.domainEmail || ''
    });
  }

  const statusCardsResult = await api.getStatusCards(userResult.user.username);
  if (statusCardsResult.success) {
    setStatusCards(statusCardsResult.statusCards);
  }

  const collectionsResult = await api.getCollections(userResult.user.username);
  if (collectionsResult.success) {
    setCollections(collectionsResult.collections);
  }
};

const handleSaveProfile = async () => {
  const token = localStorage.getItem('token');
  const result = await api.updateProfile(token, profileData);
  if (result.success) {
    alert('Profile saved!');
  }
};

const handleAddStatusCard = async () => {
  const token = localStorage.getItem('token');
  const result = await api.createStatusCard(token, statusCardForm);
  if (result.success) {
    alert('Status card added!');
    setStatusCardForm({ text: '', imageUrl: '', isLocked: false, order: 0 });
    loadUserData();
  }
};

const handleAddCollection = async () => {
  const token = localStorage.getItem('token');
  const result = await api.createCollection(token, {
    ...collectionForm,
    tags: collectionForm.tags.split(',').map(t => t.trim())
  });
  if (result.success) {
    alert('Collection created!');
    setCollectionForm({ title: '', description: '', price: 0, currency: 'USD', tags: '' });
    loadUserData();
  }
};
```

### Step 7.4: Update Creator Profile
Replace TODO in `src/pages/CreatorProfile.tsx`:
```typescript
import { api } from '@/lib/api';

const loadCreatorProfile = async () => {
  try {
    setLoading(true);
    const data = await api.getCreatorProfile(username);
    if (data.success) {
      setCreatorData(data.user);
      setCollections(data.collections || []);
      setStatusCards(data.statusCards || []);
    }
  } catch (error) {
    console.error('Error loading creator profile:', error);
  } finally {
    setLoading(false);
  }
};
```

### Step 7.5: Create Environment File
Create `.env.local`:
```env
VITE_API_URL=https://your-worker.workers.dev
```

---

## 🧪 PHASE 8: Testing Checklist

### Step 8.1: Backend API Testing

**Test Authentication:**
```bash
# Test registration
curl -X POST https://your-worker.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123","displayName":"Test User"}'

# Test login
curl -X POST https://your-worker.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test get current user (replace TOKEN)
curl https://your-worker.workers.dev/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test Collections:**
```bash
# Get collections for creator
curl https://your-worker.workers.dev/api/collections/creator/testuser

# Create collection (replace TOKEN)
curl -X POST https://your-worker.workers.dev/api/collections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Collection","description":"Test","price":4.99,"currency":"USD"}'
```

**Test Status Cards:**
```bash
# Get status cards
curl https://your-worker.workers.dev/api/status-cards/creator/testuser

# Create status card (replace TOKEN)
curl -X POST https://your-worker.workers.dev/api/status-cards \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test status","imageUrl":"","isLocked":false}'
```

**Test Public Profile:**
```bash
curl https://your-worker.workers.dev/testuser
```

### Step 8.2: Frontend Testing

1. **Test Registration:**
   - [ ] Visit landing page
   - [ ] Fill registration form
   - [ ] Submit
   - [ ] Should redirect to dashboard
   - [ ] Token saved in localStorage

2. **Test Login:**
   - [ ] Log out
   - [ ] Fill login form
   - [ ] Submit
   - [ ] Should redirect to dashboard

3. **Test Google OAuth:**
   - [ ] Click "Continue with Google"
   - [ ] Complete Google login
   - [ ] Should redirect to dashboard with token

4. **Test Profile Management:**
   - [ ] Go to dashboard
   - [ ] Update wallet address
   - [ ] Update telegram username
   - [ ] Update domain email
   - [ ] Save profile
   - [ ] Verify changes saved

5. **Test Status Cards:**
   - [ ] Create status card without image
   - [ ] Create status card with image (unlocked)
   - [ ] Create status card with image (locked)
   - [ ] Verify cards appear in list

6. **Test Collections:**
   - [ ] Create collection
   - [ ] Add media to collection
   - [ ] Set price
   - [ ] Verify "Unlock Everything" bundle appears
   - [ ] Verify bundle has 20% discount

7. **Test File Upload:**
   - [ ] Upload image (< 25MB)
   - [ ] Upload video (< 25MB)
   - [ ] Verify URLs returned
   - [ ] Test file > 25MB (should fail)

8. **Test Public Profile:**
   - [ ] Visit `/:username`
   - [ ] Verify status cards display
   - [ ] Verify collections display
   - [ ] Verify "Unlock Everything" bundle

9. **Test Payment Flow:**
   - [ ] Click "Unlock" on collection
   - [ ] Select payment provider
   - [ ] Complete test payment
   - [ ] Verify access token generated
   - [ ] Verify redirect to content

---

## 🚀 PHASE 9: Deployment

### Step 9.1: Deploy Backend
```bash
cd C:\Users\User\Desktop\creator-platform\backend
wrangler deploy
```

### Step 9.2: Deploy Frontend to Cloudflare Pages
1. Push code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Click "Create a project"
4. Connect GitHub repository
5. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Environment variables:
   - `VITE_API_URL`: Your worker URL
7. Deploy

### Step 9.3: Configure Custom Domain
1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain
4. Update DNS records as instructed

---

## ✅ Final Verification Checklist

- [ ] MongoDB connected and working
- [ ] Google OAuth working
- [ ] R2 bucket created and accessible
- [ ] Payment system configured
- [ ] All secrets set in Cloudflare
- [ ] Frontend API calls working
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Profile updates work
- [ ] Status cards create/display
- [ ] Collections create/display
- [ ] File upload works
- [ ] Public profiles display correctly
- [ ] "Unlock Everything" bundle appears
- [ ] Payment flow works end-to-end
- [ ] Access tokens generated correctly
- [ ] Platform fees calculated correctly

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Verify API URL is correct
- Check API key permissions
- Verify network access allows Cloudflare IPs
- Check database name matches

### Google OAuth Issues
- Verify redirect URIs match exactly
- Check OAuth consent screen is published
- Verify client ID and secret are correct
- Check CORS settings

### R2 Upload Issues
- Verify bucket name matches
- Check R2 API token permissions
- Verify binding in wrangler.toml
- Test R2 access directly

### Payment Issues
- Verify wallet address is correct
- Check callback URL matches Card2Crypto settings
- Verify payment providers are configured
- Test with small amounts first

### Frontend API Issues
- Check API_BASE_URL is correct
- Verify CORS headers in backend
- Check token is being sent in headers
- Verify endpoints match backend routes

---

## 📞 Next Steps After Setup

1. Test all features thoroughly
2. Create test user accounts
3. Test payment flow with real transactions
4. Monitor error logs in Cloudflare
5. Set up monitoring/alerts
6. Create backup strategy for MongoDB
7. Document any custom configurations
8. Prepare for production launch

---

**🎉 Once all steps are complete, your Creator Platform will be fully operational!**

