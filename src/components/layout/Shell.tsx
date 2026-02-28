"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mining Rig', icon: Pickaxe, href: '/mining' },
  { label: 'AI Signals', icon: Zap, href: '/signals' },
  { label: 'Market AI', icon: TrendingUp, href: '/predictions' },
  { label: 'Vault Staking', icon: Coins, href: '/staking' },
  { label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
  { label: 'Assistant', icon: MessageSquareCode, href: '/assistant' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground cyber-grid">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter text-white">SOLAR AI</span>
          </Link>
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
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5 transition-colors", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                {item.label}
              </div>
              {pathname === item.href && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}
          
          <div className="pt-8 mt-8 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-4 mb-4">Administration</p>
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                pathname === '/admin' ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <ShieldCheck className="w-5 h-5 text-secondary" />
              Admin Portal
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4 bg-white/[0.02]">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarImage src="https://picsum.photos/seed/user/200" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">John Doe</p>
              <p className="text-[10px] text-secondary font-bold tracking-widest uppercase">VIP ELITE</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 flex flex-col min-h-screen relative">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] pointer-events-none -z-10" />
        
        {/* Mobile Header */}
        <header className="lg:hidden h-20 flex items-center justify-between px-6 border-b border-white/5 glass sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="font-headline font-bold text-xl text-white">SOLAR AI</span>
          </Link>
          <Button variant="ghost" size="icon" className="w-12 h-12" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed inset-y-0 right-0 w-[300px] bg-background border-l border-white/5 p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-10">
              <span className="font-headline font-bold text-2xl text-white">Menu</span>
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
                    pathname === item.href ? "bg-primary text-white glow-primary" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-8 border-t border-white/5">
              <Button variant="outline" className="w-full h-14 justify-start gap-4 border-white/10 rounded-2xl font-bold">
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