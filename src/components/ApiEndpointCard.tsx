interface ApiEndpointCardProps {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  path: string;
  description: string;
  auth?: boolean;
  params?: Array<{
    name: string;
    type: string;
    required?: boolean;
    description: string;
  }>;
}

export function ApiEndpointCard({
  method,
  path,
  description,
  auth = true,
  params = [],
}: ApiEndpointCardProps) {
  const methodColor = {
    GET: 'bg-green-500/20 text-green-400',
    POST: 'bg-blue-500/20 text-blue-400',
    DELETE: 'bg-red-500/20 text-red-400',
    PUT: 'bg-yellow-500/20 text-yellow-400',
    PATCH: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start gap-4 mb-3">
        <span className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${methodColor[method]}`}>
          {method}
        </span>
        <span className="font-mono text-sm text-primary flex-1 break-words">{path}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {auth && (
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
          Requires API Key
        </div>
      )}

      {params.length > 0 && (
        <div className="text-xs">
          <p className="text-foreground font-semibold mb-2">Parameters:</p>
          <div className="space-y-1 bg-background/30 rounded p-2">
            {params.map((param, idx) => (
              <div key={idx} className="text-muted-foreground">
                <span className="text-foreground font-mono">{param.name}</span>
                <span className="text-primary"> {param.type}</span>
                {param.required && <span className="text-destructive"> *</span>}
                <br />
                <span className="text-xs">{param.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
