# Guerrilla Mail API - Developer Guide

## Overview

Guerrilla Mail is now a professional platform offering both a user-friendly web application and a comprehensive REST API for developers.

### What's New

- **Professional Landing Page**: Marketing-focused homepage with hero section and feature showcase
- **REST API**: Full-featured API for programmatic access to temporary email functionality
- **API Authentication**: Secure API key-based authentication with rate limiting
- **Developer Documentation**: Interactive API documentation with code examples in multiple languages
- **Dashboard**: Refactored email client for web users

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Landing.tsx        # Landing page component
│   ├── Dashboard.tsx      # Email client dashboard
│   └── Documentation.tsx  # API documentation
├── components/
│   ├── CodeBlock.tsx      # Code display component
│   ├── ApiEndpointCard.tsx # API endpoint display
│   └── ... (existing components)
├── server/
│   ├── index.ts           # Main API server
│   ├── dev.ts             # Development server runner
│   ├── middleware/
│   │   └── apiKeyAuth.ts  # API key authentication & rate limiting
│   ├── routes/
│   │   ├── accounts.ts    # Account management endpoints
│   │   └── auth.ts        # Authentication endpoints
│   └── services/
│       └── guerrillaMailService.ts # Guerrilla Mail API wrapper
```

## Getting Started

### Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   This starts the frontend on `http://localhost:8080`

3. **Start the API server** (in another terminal):
   ```bash
   npm run server:dev
   ```
   This starts the backend API on `http://localhost:3001`

### Building for Production

```bash
npm run build
```

## API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication
All API requests require an API key. Include it in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### 1. Create Account
- **Endpoint**: `POST /accounts`
- **Auth**: Required
- **Request Body**:
  ```json
  {
    "name": "test-account"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "id": "acc_...",
    "email": "user@guerrillamail.com",
    "alias": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "_links": {
      "self": "/api/v1/accounts/{id}",
      "emails": "/api/v1/accounts/{id}/emails"
    }
  }
  ```

#### 2. Get Account
- **Endpoint**: `GET /accounts/{id}`
- **Auth**: Required
- **Response**: 200 OK

#### 3. List Emails
- **Endpoint**: `GET /accounts/{id}/emails`
- **Auth**: Required
- **Response**: 200 OK
  ```json
  {
    "accountId": "acc_...",
    "count": 5,
    "emails": [
      {
        "id": "mail_id",
        "from": "sender@example.com",
        "subject": "Hello",
        "date": "2024-01-01T00:00:00Z",
        "preview": "Hello, this is a test...",
        "read": false,
        "_links": {
          "self": "/api/v1/accounts/{id}/emails/{emailId}"
        }
      }
    ]
  }
  ```

#### 4. Get Email Details
- **Endpoint**: `GET /accounts/{id}/emails/{emailId}`
- **Auth**: Required
- **Response**: 200 OK
  ```json
  {
    "id": "mail_id",
    "from": "sender@example.com",
    "subject": "Hello",
    "date": "2024-01-01T00:00:00Z",
    "body": "Plain text content",
    "html": "<html>...</html>",
    "_links": {
      "delete": "/api/v1/accounts/{id}/emails/{emailId}",
      "inbox": "/api/v1/accounts/{id}/emails"
    }
  }
  ```

#### 5. Delete Email
- **Endpoint**: `DELETE /accounts/{id}/emails/{emailId}`
- **Auth**: Required
- **Response**: 204 No Content

#### 6. Delete Account
- **Endpoint**: `DELETE /accounts/{id}`
- **Auth**: Required
- **Response**: 204 No Content

#### 7. Generate API Key
- **Endpoint**: `POST /auth/keys`
- **Auth**: Not required (public endpoint)
- **Request Body**:
  ```json
  {
    "name": "My Application"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "key": "gm_...",
    "name": "My Application",
    "createdAt": "2024-01-01T00:00:00Z",
    "message": "API key created successfully. Keep this key secret!"
  }
  ```

## Code Examples

### JavaScript/Node.js
```javascript
const apiKey = 'YOUR_API_KEY';
const baseUrl = 'http://localhost:3001/api/v1';

// Create account
const createAccount = async () => {
  const response = await fetch(`${baseUrl}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      name: 'test-account'
    })
  });
  return response.json();
};

// List emails
const listEmails = async (accountId) => {
  const response = await fetch(`${baseUrl}/accounts/${accountId}/emails`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  return response.json();
};
```

### Python
```python
import requests

api_key = 'YOUR_API_KEY'
base_url = 'http://localhost:3001/api/v1'

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

# Create account
def create_account():
    response = requests.post(
        f'{base_url}/accounts',
        headers=headers,
        json={'name': 'test-account'}
    )
    return response.json()

# List emails
def list_emails(account_id):
    response = requests.get(
        f'{base_url}/accounts/{account_id}/emails',
        headers=headers
    )
    return response.json()
```

### cURL
```bash
API_KEY="YOUR_API_KEY"
BASE_URL="http://localhost:3001/api/v1"

# Create account
curl -X POST ${BASE_URL}/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{"name": "test-account"}'

# List emails
curl -X GET ${BASE_URL}/accounts/{account_id}/emails \
  -H "Authorization: Bearer ${API_KEY}"
```

## Rate Limiting

- **Limit**: 100 requests per minute per API key
- **Headers**: The response includes rate limit information:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Unix timestamp when the limit resets

## Error Handling

All errors return a JSON response with status codes:

- **400 Bad Request**: Invalid parameters or malformed request
- **401 Unauthorized**: Missing or invalid API key
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

Example error response:
```json
{
  "error": "Unauthorized: Invalid API key",
  "message": "The provided API key is not valid"
}
```

## Feature Pages

### Landing Page (`/`)
- Hero section with value proposition
- Feature showcase (6 key features)
- Developer CTA section
- Navigation to Dashboard and Documentation

### Dashboard (`/dashboard`)
- Temporary email generation
- Inbox management
- Email reading and deletion
- Domain switching
- Auto-refresh functionality

### Documentation (`/documentation`)
- Interactive API documentation
- Getting started guide
- Authentication details
- All API endpoints with examples
- Rate limiting information
- Error handling guide

## Development Tips

1. **API Key Testing**: Generate a test API key using the `/api/v1/auth/keys` endpoint
2. **In-Memory Storage**: Currently uses in-memory storage. For production, integrate a database
3. **Rate Limiting**: Currently uses in-memory tracking. For distributed systems, use Redis
4. **Environment Variables**: Add `.env.local` for environment-specific configuration
5. **Testing**: Run `npm run test` to execute test suite

## Future Enhancements

- Database integration for persistent storage
- Redis-based distributed rate limiting
- Webhook support for email notifications
- SDK generation (JavaScript, Python, Go)
- Custom domain support
- Advanced analytics and usage tracking
- Team/organization management
- Batch operations support

## Troubleshooting

### API Server Won't Start
- Ensure port 3001 is available
- Check that Express and CORS are installed: `npm install express cors`
- Review console for specific error messages

### CORS Issues
- Ensure CORS middleware is enabled in `src/server/index.ts`
- Check that API proxy is configured in `vite.config.ts`

### Missing Dependencies
Run `npm install` to ensure all dependencies are installed, particularly:
- `express`
- `cors`
- `@types/express` (dev dependency)

## Support

For issues or questions:
1. Check the API documentation page in the app
2. Review error messages for specific guidance
3. Check the console logs for detailed error information
4. Refer to the Guerrilla Mail API documentation

## License

This project is open source and available under the MIT License.
