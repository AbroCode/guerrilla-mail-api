import type { Request, Response } from 'express';
import { Router } from 'express';
import { apiKeyMiddleware } from '../middleware/apiKeyAuth';
import { GuerrillaMailService } from '../services/guerrillaMailService';

const router = Router();

// In-memory account storage (in production, use a database)
const accounts: Map<string, { id: string; email: string; sid: string; createdAt: Date }> = new Map();

/**
 * POST /api/v1/accounts
 * Create a new temporary email account
 */
router.post('/accounts', apiKeyMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, domain } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Bad Request: name is required' });
      return;
    }

    const guerrillaAccount = await GuerrillaMailService.createAccount(name);
    
    const accountId = `acc_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    accounts.set(accountId, {
      id: accountId,
      email: guerrillaAccount.email,
      sid: guerrillaAccount.sid,
      createdAt: new Date(),
    });

    res.status(201).json({
      id: accountId,
      email: guerrillaAccount.email,
      alias: guerrillaAccount.alias,
      createdAt: new Date().toISOString(),
      _links: {
        self: `/api/v1/accounts/${accountId}`,
        emails: `/api/v1/accounts/${accountId}/emails`,
      },
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/v1/accounts/{id}
 * Get account information
 */
router.get('/accounts/:id', apiKeyMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = accounts.get(id);

    if (!account) {
      res.status(404).json({ error: 'Not Found: Account not found' });
      return;
    }

    res.json({
      id: account.id,
      email: account.email,
      createdAt: account.createdAt.toISOString(),
      _links: {
        self: `/api/v1/accounts/${id}`,
        emails: `/api/v1/accounts/${id}/emails`,
        delete: `/api/v1/accounts/${id}`,
      },
    });
  } catch (error) {
    console.error('Error getting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/v1/accounts/{id}/emails
 * List all emails in an account
 */
router.get('/accounts/:id/emails', apiKeyMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = accounts.get(id);

    if (!account) {
      res.status(404).json({ error: 'Not Found: Account not found' });
      return;
    }

    const emails = await GuerrillaMailService.getEmails(account.sid, account.email);

    res.json({
      accountId: id,
      count: emails.length,
      emails: emails.map(email => ({
        id: email.id,
        from: email.from,
        subject: email.subject,
        date: new Date(email.date * 1000).toISOString(),
        preview: email.preview,
        read: email.read,
        _links: {
          self: `/api/v1/accounts/${id}/emails/${email.id}`,
        },
      })),
    });
  } catch (error) {
    console.error('Error getting emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/v1/accounts/{id}/emails/{emailId}
 * Get detailed email information
 */
router.get('/accounts/:id/emails/:emailId', apiKeyMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, emailId } = req.params;
    const account = accounts.get(id);

    if (!account) {
      res.status(404).json({ error: 'Not Found: Account not found' });
      return;
    }

    const email = await GuerrillaMailService.getEmail(account.sid, emailId);

    res.json({
      id: email.id,
      from: email.from,
      subject: email.subject,
      date: new Date(email.date * 1000).toISOString(),
      body: email.body,
      html: email.html,
      _links: {
        delete: `/api/v1/accounts/${id}/emails/${emailId}`,
        inbox: `/api/v1/accounts/${id}/emails`,
      },
    });
  } catch (error) {
    console.error('Error getting email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /api/v1/accounts/{id}/emails/{emailId}
 * Delete a specific email
 */
router.delete('/accounts/:id/emails/:emailId', apiKeyMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, emailId } = req.params;
    const account = accounts.get(id);

    if (!account) {
      res.status(404).json({ error: 'Not Found: Account not found' });
      return;
    }

    const success = await GuerrillaMailService.deleteEmail(account.sid, emailId);

    if (!success) {
      res.status(500).json({ error: 'Failed to delete email' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * DELETE /api/v1/accounts/{id}
 * Delete account and forget all data
 */
router.delete('/accounts/:id', apiKeyMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = accounts.get(id);

    if (!account) {
      res.status(404).json({ error: 'Not Found: Account not found' });
      return;
    }

    await GuerrillaMailService.forgetMe(account.sid);
    accounts.delete(id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
