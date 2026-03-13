import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Zap, Code, GitBranch, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              GM
            </div>
            <span className="text-lg font-bold text-foreground">Guerrilla Mail</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition">For Developers</a>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition">App</Link>
            <Link to="/documentation">
              <Button variant="default" size="sm">Get API Key</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <div className="inline-block">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
              Privacy First Email Service
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Instant Email,<br className="hidden sm:block" />
            <span className="gradient-text">Zero Commitment</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate temporary email addresses instantly. No signup, no tracking, no spam. 
            Perfect for protecting your privacy online—and powering developer integrations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Try Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/documentation">
              <Button size="lg" variant="outline">
                View API Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why Guerrilla Mail?</h2>
          <p className="text-lg text-muted-foreground">Powerful features designed for everyday users and developers</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Instant Access</h3>
            <p className="text-muted-foreground">Get a working email address in milliseconds. No waiting, no forms, no verification.</p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Complete Privacy</h3>
            <p className="text-muted-foreground">Your data is never stored or tracked. Emails expire automatically. Your privacy, protected.</p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Full Email Support</h3>
            <p className="text-muted-foreground">Send and receive emails just like a regular account. Switch domains. Full inbox control.</p>
          </div>

          {/* Feature 4 */}
          <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">REST API</h3>
            <p className="text-muted-foreground">Integrate temporary email into your applications. Comprehensive API with examples in multiple languages.</p>
          </div>

          {/* Feature 5 */}
          <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">API Authentication</h3>
            <p className="text-muted-foreground">Secure API key authentication with rate limiting and usage tracking for developers.</p>
          </div>

          {/* Feature 6 */}
          <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Multiple Domains</h3>
            <p className="text-muted-foreground">Choose from various email domains. Create accounts with different domain preferences.</p>
          </div>
        </div>
      </section>

      {/* Developer CTA Section */}
      <section id="docs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Build with Guerrilla Mail</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our REST API makes it simple to integrate temporary email functionality into your applications. 
              Full documentation, code examples, and SDKs available.
            </p>
            <Link to="/documentation">
              <Button size="lg" className="gap-2">
                Explore API Documentation <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 font-mono text-sm">
            <p className="text-muted-foreground mb-3">// Quick API Example</p>
            <div className="space-y-2 text-foreground">
              <p><span className="text-blue-400">const</span> createEmail = <span className="text-yellow-400">async</span> () =&gt; {'{'}</p>
              <p className="ml-4"><span className="text-yellow-400">const</span> res = <span className="text-yellow-400">await</span> <span className="text-cyan-400">fetch</span>(<span className="text-green-400">'/api/v1/accounts'</span>, {'{'}</p>
              <p className="ml-8">method: <span className="text-green-400">'POST'</span>,</p>
              <p className="ml-8">headers: {'{'}</p>
              <p className="ml-12">Authorization: <span className="text-green-400">'Bearer YOUR_KEY'</span></p>
              <p className="ml-8">{'}'}</p>
              <p className="ml-4">{'}'});</p>
              <p className="ml-4"><span className="text-yellow-400">return</span> res.json();</p>
              <p>{'}'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">
                GM
              </div>
              <span className="font-semibold text-foreground">Guerrilla Mail</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition">Privacy</a>
              <a href="#" className="hover:text-foreground transition">Terms</a>
              <a href="#" className="hover:text-foreground transition">Status</a>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Guerrilla Mail. Built for privacy-conscious users and developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
