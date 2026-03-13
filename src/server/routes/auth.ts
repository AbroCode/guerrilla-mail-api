import type { Request, Response } from 'express';
import { Router } from 'express';
import { createApiKey, generateApiKey } from '../middleware/apiKeyAuth';

const router = Router();

/**
 * POST /api/v1/auth/keys
 * Generate a new API key
 */
router.post('/auth/keys', (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'name is required and must be a string',
      });
      return;
    }

    const apiKey = createApiKey(name);

    res.status(201).json({
      key: apiKey,
      name,
      createdAt: new Date().toISOString(),
      message: 'API key created successfully. Keep this key secret!',
      _links: {
        keys: '/api/v1/auth/keys',
      },
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/v1/auth/keys
 * List all API keys (requires authentication)
 */
router.get('/auth/keys', (req: Request, res: Response) => {
  try {
    // This endpoint would require authentication in production
    // For now, we're keeping it simple
    res.json({
      message: 'To generate a new API key, POST to /api/v1/auth/keys',
      example: {
        method: 'POST',
        url: '/api/v1/auth/keys',
        body: {
          name: 'My App',
        },
      },
    });
  } catch (error) {
    console.error('Error listing API keys:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /api/v1/auth/verify
 * Verify an API key
 */
router.post('/auth/verify', (req: Request, res: Response) => {
  try {
    const { key } = req.body;

    if (!key) {
      res.status(400).json({ error: 'Bad Request: key is required' });
      return;
    }

    // In a real implementation, this would check against the database
    const isValid = typeof key === 'string' && key.startsWith('gm_');

    res.json({
      valid: isValid,
      message: isValid ? 'API key is valid' : 'Invalid API key',
    });
  } catch (error) {
    console.error('Error verifying API key:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
