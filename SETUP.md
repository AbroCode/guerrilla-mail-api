# Guerrilla Mail - Professional Setup & Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn

### Installation & Development

1. **Clone and install**:
   ```bash
   git clone <repository>
   cd guerrilla-mail
   npm install
   ```

2. **Run frontend** (Terminal 1):
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:8080`

3. **Run API server** (Terminal 2):
   ```bash
   npm run server:dev
   ```
   API runs on: `http://localhost:3001`

4. **Generate API Key** (Terminal 3):
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/keys \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Key"}'
   ```

   You'll receive a response like:
   ```json
   {
     "key": "gm_...",
     "name": "Test Key",
     "createdAt": "2024-01-01T00:00:00Z"
   }
   ```

5. **Test the API**:
   ```bash
   API_KEY="gm_..." # Use the key from step 4
   
   curl -X POST http://localhost:3001/api/v1/accounts \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $API_KEY" \
     -d '{"name": "test-account"}'
   ```

## Project Pages

### 1. Landing Page (`/`)
- **Purpose**: Marketing and onboarding
- **Features**:
  - Hero section with value proposition
  - Feature showcase (6 key features)
  - Developer API CTA
  - Quick API example
  - Navigation to app and docs

### 2. Dashboard (`/dashboard`)
- **Purpose**: User email client
- **Features**:
  - Instant email generation
  - Inbox management
  - Email reading
  - Email deletion
  - Domain switching
  - Auto-refresh (every 10 seconds)

### 3. Documentation (`/documentation`)
- **Purpose**: API reference for developers
- **Features**:
  - Getting started guide
  - Authentication details
  - Complete API endpoint documentation
  - Code examples (cURL, JavaScript, Python, Go)
  - Rate limiting information
  - Error handling guide

## Architecture

### Frontend (Vite + React)
```
src/
├── pages/
│   ├── Index.tsx          → Landing page
│   ├── Landing.tsx        → Landing component
│   ├── Dashboard.tsx      → Email client
│   └── Documentation.tsx  → API docs
├── components/
│   ├── CodeBlock.tsx      → Code display
│   ├── ApiEndpointCard.tsx → API card
│   └── ... (other UI components)
├── hooks/
│   └── useGuerrillaMail.ts → Email logic
└── ... (styles, config)
```

### Backend (Express.js)
```
src/server/
├── index.ts              → Main Express app
├── dev.ts                → Dev server runner
├── middleware/
│   └── apiKeyAuth.ts     → Auth & rate limiting
├── routes/
│   ├── accounts.ts       → Account endpoints
│   └── auth.ts           → Auth endpoints
└── services/
    └── guerrillaMailService.ts → Guerrilla Mail API wrapper
```

## API Overview

### Authentication
All endpoints (except `/auth/keys` and `/auth/verify`) require:
```
Authorization: Bearer YOUR_API_KEY
```

### Core Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/accounts` | Create account |
| GET | `/accounts/{id}` | Get account info |
| GET | `/accounts/{id}/emails` | List emails |
| GET | `/accounts/{id}/emails/{id}` | Get email |
| DELETE | `/accounts/{id}/emails/{id}` | Delete email |
| DELETE | `/accounts/{id}` | Delete account |
| POST | `/auth/keys` | Generate API key |
| POST | `/auth/verify` | Verify API key |

## Rate Limiting

- **Limit**: 100 requests/minute per API key
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Production Deployment

### Environment Variables
Create a `.env` file or add to your hosting platform:
```
NODE_ENV=production
API_PORT=3001
FRONTEND_PORT=8080
FRONTEND_URL=https://youromain.com
API_URL=https://api.yourdomain.com
```

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel settings
3. **Set build command**: `npm run build`
4. **Set start command**: `npm start`
5. **Deploy**: Push to GitHub to auto-deploy

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080 3001

CMD ["npm", "run", "dev", "&", "npm", "run", "server:dev"]
```

Build and run:
```bash
docker build -t guerrilla-mail .
docker run -p 8080:8080 -p 3001:3001 guerrilla-mail
```

## Database Integration (Optional)

For production, replace in-memory storage with a database:

### PostgreSQL/Neon Example
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Store API keys
await pool.query(
  'INSERT INTO api_keys (key, name, created_at) VALUES ($1, $2, $3)',
  [apiKey, name, new Date()]
);

// Store accounts
await pool.query(
  'INSERT INTO accounts (id, email, sid, created_at) VALUES ($1, $2, $3, $4)',
  [accountId, email, sid, new Date()]
);
```

### Redis for Rate Limiting
```typescript
import Redis from 'redis';

const redis = Redis.createClient();

// Check rate limit
const count = await redis.incr(`rate:${apiKey}`);
if (count === 1) {
  await redis.expire(`rate:${apiKey}`, 60);
}
```

## Performance Optimization

### Frontend
- Code splitting with React Router
- Lazy loading components
- Image optimization
- CSS-in-JS optimization

### Backend
- API request caching
- Database query optimization
- Connection pooling
- Compression middleware

## Monitoring & Logging

### Add Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Monitor API
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration
    });
  });
  next();
});
```

## Testing

### Unit Tests
```bash
npm run test
npm run test:watch
```

### API Testing with cURL
```bash
# Create account
curl -X POST http://localhost:3001/api/v1/accounts \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "test"}'

# List emails
curl -X GET http://localhost:3001/api/v1/accounts/{id}/emails \
  -H "Authorization: Bearer $API_KEY"
```

### Postman Collection
Export the API and import into Postman for easy testing.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8080  # Frontend
lsof -i :3001  # API

# Kill process
kill -9 <PID>
```

### CORS Issues
Ensure `cors` middleware is enabled in `src/server/index.ts`:
```typescript
app.use(cors());
```

### API Key Not Working
1. Check key starts with `gm_`
2. Verify Authorization header format: `Bearer gm_...`
3. Check rate limiting hasn't been exceeded

### Build Failures
1. Clear cache: `rm -rf node_modules dist && npm install`
2. Check Node version: `node --version` (should be 18+)
3. Review build output for specific errors

## Support & Resources

- **API Docs**: `/documentation` page in app
- **Developer Guide**: See `DEVELOPER.md`
- **GitHub Issues**: Report bugs on GitHub
- **Guerrilla Mail Docs**: https://www.guerrillamail.com/

## Next Steps

1. **Test the API** with provided examples
2. **Deploy to production** using Vercel or Docker
3. **Add database** for persistent storage
4. **Implement webhooks** for email notifications
5. **Create SDKs** for popular languages
6. **Build mobile apps** using the API

## License

MIT License - See LICENSE file
