# Guerrilla Mail - Quick Start Guide

## 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Terminal 1: Start frontend
npm run dev

# 3. Terminal 2: Start API server
npm run server:dev
```

**Frontend**: http://localhost:8080  
**API**: http://localhost:3001/api/v1

## Generate Your First API Key

```bash
curl -X POST http://localhost:3001/api/v1/auth/keys \
  -H "Content-Type: application/json" \
  -d '{"name": "My First Key"}'
```

Save the `"key"` value (starts with `gm_`)

## Create Your First Temporary Email

```bash
# Replace YOUR_KEY with the key from above
API_KEY="gm_..."

curl -X POST http://localhost:3001/api/v1/accounts \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "test"}'
```

You'll get back an account with an email address!

## Check Emails

```bash
# Replace account-id with the id from above
curl -X GET http://localhost:3001/api/v1/accounts/{account-id}/emails \
  -H "Authorization: Bearer $API_KEY"
```

## Site Pages

| Page | URL | For |
|------|-----|-----|
| Home | http://localhost:8080 | Everyone |
| Email App | http://localhost:8080/dashboard | End Users |
| API Docs | http://localhost:8080/documentation | Developers |

## API Endpoints Reference

```
POST   /accounts                      Create email account
GET    /accounts/{id}                Get account details
GET    /accounts/{id}/emails         List emails
GET    /accounts/{id}/emails/{id}    Get email details
DELETE /accounts/{id}/emails/{id}    Delete email
DELETE /accounts/{id}                Delete account
POST   /auth/keys                    Generate API key
POST   /auth/verify                  Verify API key
```

## Rate Limit

- 100 requests per minute
- Check headers: `X-RateLimit-Remaining`

## What's Different?

### Before
- Simple email client only
- No API for developers
- Minimal branding

### After
- Professional landing page
- Full REST API
- API documentation page
- Multiple entry points
- Rate limiting & auth
- Production-ready

## Common Issues

**"Port already in use"?**
```bash
# Kill process on port 8080
lsof -i :8080
kill -9 <PID>
```

**"No such module"?**
```bash
npm install
```

**"Cannot find module 'express'"?**
```bash
npm install express cors
```

## Next Steps

1. ✅ Test the API with cURL
2. ✅ Build a JavaScript client
3. ✅ Deploy to production
4. ✅ Create SDKs for other languages
5. ✅ Add database integration

## Documentation

- **DEVELOPER.md** - Full developer guide
- **SETUP.md** - Deployment & configuration
- **PROJECT_SUMMARY.md** - What was built

## Support

Check the API docs page in the app at `/documentation` for complete reference.

---

**Ready to use?** Visit http://localhost:8080 to get started!
