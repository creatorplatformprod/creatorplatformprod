# Creator Platform Backend

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/creator-platform

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Storage (Cloudflare/S3)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# Email (for notifications)
RESEND_API_KEY=your-resend-api-key
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/:username` - Get user profile

### Collections
- `GET /api/collections/creator/:username` - Get creator's collections
- `GET /api/collections/:id` - Get specific collection

### Upload
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

### Health Check
- `GET /api/health` - Server health check

## Database Models

### User
- Authentication (email/password or Google OAuth)
- Profile information (username, display name, bio, avatar)
- Creator settings (wallet address, telegram, domain email)
- Subscription tier

### Collection
- Creator reference
- Title, description, media files
- Pricing and currency
- Tags and metadata
- Publication status

## File Upload Limits
- Maximum file size: 25MB
- Supported formats: Images (JPEG, PNG, GIF, WebP) and Videos (MP4, MOV, AVI, WebM)

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation


