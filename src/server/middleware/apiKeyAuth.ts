import type { Request, Response, NextFunction } from 'express';

// In-memory API key storage (in production, use a database)
const apiKeys: Map<string, { name: string; createdAt: Date; rateLimit: number; requests: number; resetTime: number }> = new Map();

export function generateApiKey(): string {
  return `gm_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

export function createApiKey(name: string): string {
  const key = generateApiKey();
  apiKeys.set(key, {
    name,
    createdAt: new Date(),
    rateLimit: 100, // 100 requests per minute
    requests: 0,
    resetTime: Date.now() + 60000,
  });
  return key;
}

export function verifyApiKey(key: string): boolean {
  return apiKeys.has(key);
}

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const apiKey = authHeader?.replace('Bearer ', '');

  if (!apiKey || !verifyApiKey(apiKey)) {
    res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    return;
  }

  const keyData = apiKeys.get(apiKey);
  if (!keyData) {
    res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    return;
  }

  // Check rate limiting
  const now = Date.now();
  if (now > keyData.resetTime) {
    keyData.requests = 0;
    keyData.resetTime = now + 60000;
  }

  if (keyData.requests >= keyData.rateLimit) {
    res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded' });
    return;
  }

  keyData.requests++;

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', keyData.rateLimit);
  res.setHeader('X-RateLimit-Remaining', keyData.rateLimit - keyData.requests);
  res.setHeader('X-RateLimit-Reset', keyData.resetTime);

  req.apiKey = apiKey;
  next();
}

declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
    }
  }
}
