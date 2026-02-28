"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Pickaxe, 
  Zap, 
  TrendingUp, 
  Coins, 
  Trophy, 
  MessageSquareCode, 
  User, 
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from "next-themes";
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mining Rig', icon: Pickaxe, href: '/mining' },
  { label: 'AI Signals', icon: Zap, href: '/signals' },
  { label: 'Market AI', icon: TrendingUp, href: '/predictions' },
  { label: 'Vault Staking', icon: Coins, href: '/staking' },
  { label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
  { label: 'Assistant', icon: MessageSquareCode, href: '/assistant' },
];

const TICKER_DATA = [
  { pair: 'BTC/USD', price: 64520.45, change: 2.45 },
  { pair: 'ETH/USD', price: 3421.12, change: -1.20 },
  { pair: 'SOL/USD', price: 142.88, change: 8.12 },
  { pair: 'BNB/USD', price: 588.22, change: 0.45 },
  { pair: 'XRP/USD', price: 0.62, change: -0.12 },
  { pair: 'ADA/USD', price: 0.45, change: 1.15 },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userRef);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground cyber-grid">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 border-r border-border bg-card/40 backdrop-blur-3xl z-50">
        <div className="p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <Zap className="text-white w-6 h-6 fill-current" />
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter">SOLAR AI</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
              ) : (
                <div className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                pathname === item.href 
                  ? "bg-primary text-white glow-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5 transition-colors", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                {item.label}
              </div>
              {pathname === item.href && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}
          
          <div className="pt-8 mt-8 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-4 mb-4">Administration</p>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                pathname === '/admin' ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <ShieldCheck className="w-5 h-5 text-secondary" />
              Admin Portal
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-border">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 bg-accent/5">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200`} />
              <AvatarFallback>{userData?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{userData?.username || 'Guest'}</p>
              <p className="text-[10px] text-secondary font-bold tracking-widest uppercase">
                {userData?.vipStatus ? 'VIP ELITE' : 'STANDARD'}
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen relative">
        {/* Ticker Header */}
        <div className="h-10 bg-black/40 border-b border-border flex items-center overflow-hidden z-40">
          <div className="marquee">
            <div className="marquee-content gap-12 px-6">
              {[...TICKER_DATA, ...TICKER_DATA].map((ticker, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-muted-foreground">{ticker.pair}</span>
                  <span className="text-white">${ticker.price.toLocaleString()}</span>
                  <span className={ticker.change >= 0 ? 'text-green-500' : 'text-destructive'}>
                    {ticker.change >= 0 ? '+' : ''}{ticker.change}%
                  </span>
                  {ticker.change >= 0 ? <TrendUp className="w-2.5 h-2.5 text-green-500" /> : <TrendDown className="w-2.5 h-2.5 text-destructive" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        
        {/* Mobile Header */}
        <header className="lg:hidden h-20 flex items-center justify-between px-6 border-b border-border glass sticky top-10 z-40">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="font-headline font-bold text-xl">SOLAR AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed inset-y-0 right-0 w-[300px] bg-background border-l border-border p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-10">
              <span className="font-headline font-bold text-2xl">Menu</span>
              <Button variant="ghost" size="icon" className="w-12 h-12" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-1 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all",
                    pathname === item.href ? "bg-primary text-white glow-primary" : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-8 border-t border-border">
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full h-14 justify-start gap-4 border-border rounded-2xl font-bold"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}