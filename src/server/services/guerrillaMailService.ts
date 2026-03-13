// Guerrilla Mail API Service Wrapper
// This service interacts with the Guerrilla Mail API

const GUERRILLA_API_BASE = 'https://api.guerrillamail.com/ajax.php';

interface GuerrillaAccount {
  email: string;
  alias: string;
  timestamp: number;
  sid: string;
}

interface GuerrillaEmail {
  id: string;
  from: string;
  subject: string;
  date: number;
  read: boolean;
  preview: string;
}

export class GuerrillaMailService {
  static async createAccount(username?: string): Promise<GuerrillaAccount> {
    const params = new URLSearchParams({
      action: 'get_email_address',
    });

    if (username) {
      params.append('email_user', username);
    }

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to create account');
    }

    const data = await response.json();
    return {
      email: data.email_addr,
      alias: data.email_user,
      timestamp: data.email_timestamp,
      sid: data.sid,
    };
  }

  static async getEmails(sid: string, emailAddr: string): Promise<GuerrillaEmail[]> {
    const params = new URLSearchParams({
      action: 'get_email_list',
      sid_token: sid,
      offset: '0',
    });

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }

    const data = await response.json();
    
    if (!data.list || !Array.isArray(data.list)) {
      return [];
    }

    return data.list.map((email: any) => ({
      id: email.mail_id,
      from: email.mail_from,
      subject: email.mail_subject,
      date: email.mail_date,
      read: email.mail_read === '1',
      preview: email.mail_excerpt,
    }));
  }

  static async getEmail(sid: string, emailId: string): Promise<any> {
    const params = new URLSearchParams({
      action: 'fetch_email',
      sid_token: sid,
      email_id: emailId,
    });

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch email');
    }

    const data = await response.json();
    return {
      id: data.mail_id,
      from: data.mail_from,
      subject: data.mail_subject,
      date: data.mail_date,
      body: data.mail_body || '',
      html: data.mail_html || '',
    };
  }

  static async deleteEmail(sid: string, emailId: string): Promise<boolean> {
    const params = new URLSearchParams({
      action: 'delete',
      sid_token: sid,
      email_ids: emailId,
    });

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    return response.ok;
  }

  static async forgetMe(sid: string): Promise<boolean> {
    const params = new URLSearchParams({
      action: 'forget_me',
      sid_token: sid,
    });

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    return response.ok;
  }

  static async getDomainList(): Promise<string[]> {
    const params = new URLSearchParams({
      action: 'get_domain_list',
    });

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch domains');
    }

    const data = await response.json();
    return data.domains || [];
  }

  static async checkEmail(sid: string, seq?: number): Promise<{ count: number; emails: GuerrillaEmail[] }> {
    const params = new URLSearchParams({
      action: 'check_email',
      sid_token: sid,
    });

    if (seq) {
      params.append('seq', seq.toString());
    }

    const response = await fetch(`${GUERRILLA_API_BASE}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to check email');
    }

    const data = await response.json();
    
    const emails = !data.list || !Array.isArray(data.list) ? [] : data.list.map((email: any) => ({
      id: email.mail_id,
      from: email.mail_from,
      subject: email.mail_subject,
      date: email.mail_date,
      read: email.mail_read === '1',
      preview: email.mail_excerpt,
    }));

    return {
      count: data.count || 0,
      emails,
    };
  }
}
