import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Pickaxe, TrendingUp, ShieldCheck, Users, Globe, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-glow">
                <Zap className="text-white fill-current" />
              </div>
              <span className="text-2xl font-headline font-bold tracking-tight text-white">SOLAR AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#mining" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Mining</a>
              <a href="#staking" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Staking</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="hidden sm:inline-flex text-white hover:text-primary">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] -z-10 rounded-full" />
        <div className="container px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 animate-bounce">
            <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Next-Gen Crypto Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold mb-6 tracking-tighter leading-tight">
            The Future of <br />
            <span className="text-gradient">AI Trading is Here</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Solar AI combines advanced machine learning with decentralized mining to provide the most accurate signals and predictions in the crypto space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-lg group" asChild>
              <Link href="/mining">
                Start Mining
                <Pickaxe className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 text-lg group" asChild>
              <Link href="/signals">
                Explore Signals
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/20 border-y border-white/5">
        <div className="container px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Total Supply', value: '500M SOLAR' },
              { label: 'Active Miners', value: '124,500+' },
              { label: 'AI Accuracy', value: '94.2%' },
              { label: 'Daily Signals', value: '50+' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-secondary font-headline font-bold text-2xl lg:text-3xl mb-1 group-hover:scale-110 transition-transform">{stat.value}</p>
                <p className="text-muted-foreground text-sm uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to dominate the markets with the power of Artificial Intelligence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'AI Signals', desc: 'Real-time entry, take profit, and stop loss levels for BTC, ETH, and major Forex pairs.' },
              { icon: TrendingUp, title: 'AI Predictions', desc: 'Deep-learning based trend analysis and price targets with confidence scoring.' },
              { icon: Pickaxe, title: 'Cloud Mining', desc: 'Mine SOLAR tokens directly in your browser with no hardware required.' },
              { icon: ShieldCheck, title: 'Staking Rewards', desc: 'Lock your tokens for high-yield returns and governance rights.' },
              { icon: Users, title: 'Referral System', desc: 'Earn 25% of your referrals mining yields for life.' },
              { icon: Globe, title: 'Global Access', desc: 'Trade and mine from anywhere in the world on any device.' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-headline">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container px-4">
          <div className="glass-card p-12 lg:p-20 rounded-[40px] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[100px] -z-10" />
            <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of users already mining and trading smarter with Solar AI.
            </p>
            <Button size="lg" className="h-16 px-12 rounded-full bg-white text-black hover:bg-gray-200 text-xl font-bold" asChild>
              <Link href="/register">Join Solar AI Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="text-primary w-6 h-6 fill-current" />
            <span className="font-headline font-bold text-xl">SOLAR AI</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Telegram</a>
            <a href="#" className="hover:text-primary transition-colors">Discord</a>
            <a href="#" className="hover:text-primary transition-colors">Whitepaper</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Solar AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}