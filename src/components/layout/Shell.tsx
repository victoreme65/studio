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
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sun,
  Moon
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
    <div className="flex min-h-screen bg-background text-foreground cyber-grid overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-56 flex-col fixed inset-y-0 border-r border-border bg-card/40 backdrop-blur-3xl z-50">
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center glow-primary transition-transform">
                <Zap className="text-white w-4 h-4 fill-current" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tighter">SOLAR AI</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-7 w-7"
            >
              {mounted && (theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />)}
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all group",
                pathname === item.href 
                  ? "bg-primary text-white glow-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={cn("w-3.5 h-3.5", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                {item.label}
              </div>
              {pathname === item.href && <ChevronRight className="w-3 h-3" />}
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground px-2.5 mb-1.5">System</p>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all group",
                pathname === '/admin' ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              Admin Portal
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          <div className="glass-card p-2 rounded-xl flex items-center gap-2 bg-accent/5">
            <Avatar className="w-7 h-7 border border-primary/20">
              <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200`} />
              <AvatarFallback>{userData?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold truncate">{userData?.username || 'Guest'}</p>
              <p className="text-[8px] text-secondary font-bold tracking-widest uppercase">
                {userData?.vipStatus ? 'VIP ELITE' : 'STANDARD'}
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive h-6 w-6"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-56 flex flex-col min-h-screen relative overflow-y-auto">
        {/* Ticker Header */}
        <div className="h-7 bg-black/40 border-b border-border flex items-center overflow-hidden z-40 shrink-0">
          <div className="marquee">
            <div className="marquee-content gap-6 px-3">
              {[...TICKER_DATA, ...TICKER_DATA].map((ticker, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[8px] font-mono whitespace-nowrap">
                  <span className="text-muted-foreground">{ticker.pair}</span>
                  <span className="text-white">${ticker.price.toLocaleString()}</span>
                  <span className={ticker.change >= 0 ? 'text-green-500' : 'text-destructive'}>
                    {ticker.change >= 0 ? '+' : ''}{ticker.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <header className="lg:hidden h-12 flex items-center justify-between px-3 border-b border-border glass sticky top-0 z-40 shrink-0">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="text-white w-4 h-4 fill-current" />
            </div>
            <span className="font-headline font-bold text-base tracking-tighter">SOLAR AI</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8"
            >
              {mounted && (theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />)}
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-3 md:p-4 lg:p-5 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed inset-y-0 right-0 w-[240px] bg-background border-l border-border p-4 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between mb-6">
              <span className="font-headline font-bold text-lg">Menu</span>
              <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all",
                    pathname === item.href ? "bg-primary text-white glow-primary" : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-border">
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full h-10 justify-start gap-3 border-border rounded-xl font-bold text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}