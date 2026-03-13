import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/CodeBlock';
import { ApiEndpointCard } from '@/components/ApiEndpointCard';

export default function Documentation() {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const apiBaseUrl = 'https://api.guerrillamail.com/v1';

  const codeExamples = {
    curl: `curl -X POST ${apiBaseUrl}/accounts \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "test-account"
  }'`,
    javascript: `const response = await fetch('${apiBaseUrl}/accounts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    name: 'test-account'
  })
});
const data = await response.json();
console.log(data);`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.post(
    '${apiBaseUrl}/accounts',
    json={'name': 'test-account'},
    headers=headers
)

print(response.json())`,
    go: `package main

import (
  "net/http"
  "io/ioutil"
)

func main() {
  req, _ := http.NewRequest("POST", "${apiBaseUrl}/accounts", nil)
  req.Header.Add("Authorization", "Bearer YOUR_API_KEY")
  
  client := &http.Client{}
  resp, _ := client.Do(req)
  
  body, _ := ioutil.ReadAll(resp.Body)
  println(string(body))
}`,
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/accounts',
      description: 'Create a new temporary email account',
      params: [
        { name: 'name', type: 'string', required: true, description: 'Account name' }
      ],
    },
    {
      method: 'GET',
      path: '/accounts/{id}',
      description: 'Get account information',
    },
    {
      method: 'GET',
      path: '/accounts/{id}/emails',
      description: 'List all emails in an account',
    },
    {
      method: 'GET',
      path: '/accounts/{id}/emails/{emailId}',
      description: 'Get detailed email information',
    },
    {
      method: 'DELETE',
      path: '/accounts/{id}/emails/{emailId}',
      description: 'Delete a specific email',
    },
    {
      method: 'POST',
      path: '/auth/keys',
      description: 'Generate a new API key',
      params: [
        { name: 'name', type: 'string', required: true, description: 'API key name' }
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              GM
            </div>
            <span className="text-lg font-bold text-foreground">Guerrilla Mail</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Open App</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-2">
              <h3 className="text-sm font-semibold text-foreground px-3 mb-4">Documentation</h3>
              <nav className="space-y-1">
                {[
                  { id: 'getting-started', label: 'Getting Started' },
                  { id: 'authentication', label: 'Authentication' },
                  { id: 'endpoints', label: 'API Endpoints' },
                  { id: 'examples', label: 'Code Examples' },
                  { id: 'rate-limiting', label: 'Rate Limiting' },
                  { id: 'errors', label: 'Error Handling' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setExpandedSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      expandedSection === item.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Getting Started */}
            <section className={expandedSection === 'getting-started' ? '' : 'hidden'}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Getting Started</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Welcome to the Guerrilla Mail API. This REST API allows you to programmatically create and manage temporary email accounts.</p>
                <p>To get started, you'll need an API key. Generate one through your account dashboard and include it in all API requests.</p>
                <div className="bg-card border border-border rounded-lg p-4 mt-6">
                  <p className="text-sm font-mono text-foreground">API Base URL</p>
                  <p className="text-sm font-mono text-primary">{apiBaseUrl}</p>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section className={expandedSection === 'authentication' ? '' : 'hidden'}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Authentication</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">All API requests require authentication using an API key. Include it in the Authorization header.</p>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-mono text-foreground">Authorization Header</p>
                    <button
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth-header')}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {copied === 'auth-header' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-primary">Authorization: Bearer YOUR_API_KEY</p>
                </div>
              </div>
            </section>

            {/* Endpoints */}
            <section className={expandedSection === 'endpoints' ? '' : 'hidden'}>
              <h2 className="text-3xl font-bold text-foreground mb-4">API Endpoints</h2>
              <div className="space-y-4">
                {endpoints.map((endpoint, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4 hover:border-primary/50 transition">
                    <div className="flex items-start gap-4 mb-2">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm text-primary flex-1">{endpoint.path}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    {endpoint.params && (
                      <div className="text-xs">
                        <p className="text-foreground font-semibold mb-1">Parameters:</p>
                        <div className="space-y-1">
                          {endpoint.params.map((param, pidx) => (
                            <p key={pidx} className="text-muted-foreground">
                              <span className="text-foreground">{param.name}</span>
                              <span className="text-primary"> {param.type}</span>
                              {param.required && <span className="text-destructive"> *required</span>}
                              {' — '}{param.description}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Code Examples */}
            <section className={expandedSection === 'examples' ? '' : 'hidden'}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Code Examples</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">Here are examples of how to use the API in different languages.</p>
                
                {Object.entries(codeExamples).map(([lang, code]) => (
                  <div key={lang} className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground capitalize">{lang}</span>
                      <button
                        onClick={() => copyToClipboard(code, lang)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-2"
                      >
                        {copied === lang ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied === lang ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-background/50 p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-foreground whitespace-pre-wrap">{code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>

            {/* Rate Limiting */}
            <section className={expandedSection === 'rate-limiting' ? '' : 'hidden'}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Rate Limiting</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>API requests are rate limited to prevent abuse.</p>
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Standard Rate Limit</p>
                    <p className="text-sm">100 requests per minute</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Headers</p>
                    <p className="text-xs font-mono mt-1">X-RateLimit-Limit: 100</p>
                    <p className="text-xs font-mono">X-RateLimit-Remaining: 95</p>
                    <p className="text-xs font-mono">X-RateLimit-Reset: 1234567890</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Handling */}
            <section className={expandedSection === 'errors' ? '' : 'hidden'}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Error Handling</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">All errors return standard HTTP status codes along with a JSON error object.</p>
                <div className="space-y-3">
                  {[
                    { code: 200, message: 'Success' },
                    { code: 400, message: 'Bad Request — Invalid parameters' },
                    { code: 401, message: 'Unauthorized — Invalid API key' },
                    { code: 404, message: 'Not Found — Resource not found' },
                    { code: 429, message: 'Too Many Requests — Rate limit exceeded' },
                    { code: 500, message: 'Internal Server Error' },
                  ].map(error => (
                    <div key={error.code} className="border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-semibold text-foreground">{error.code}</span>
                        <span className="text-sm text-muted-foreground">{error.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Guerrilla Mail API Documentation</p>
        </div>
      </footer>
    </div>
  );
}
