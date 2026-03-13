import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'plaintext', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-background/50">
      {title && (
        <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="bg-background/50 p-4 overflow-x-auto relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-1.5 rounded text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
