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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Mining', icon: Pickaxe, href: '/mining' },
  { label: 'AI Signals', icon: Zap, href: '/signals' },
  { label: 'Predictions', icon: TrendingUp, href: '/predictions' },
  { label: 'Staking', icon: Coins, href: '/staking' },
  { label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
  { label: 'AI Assistant', icon: MessageSquareCode, href: '/assistant' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r border-white/5 bg-card/50 backdrop-blur-xl z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-white">SOLAR AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                pathname === item.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
              {item.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-white/5">
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                pathname === '/admin' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <ShieldCheck className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="glass-card p-3 rounded-xl flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-primary/20">
              <AvatarImage src="https://picsum.photos/seed/user/200" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">John Doe</p>
              <p className="text-xs text-secondary font-medium">VIP Member</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-white/5 glass sticky top-0 z-40">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-current" />
            </div>
            <span className="font-headline font-bold text-lg text-white">SOLAR AI</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="fixed inset-y-0 right-0 w-[280px] bg-background border-l border-white/5 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-headline font-bold text-xl">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                    pathname === item.href ? "bg-primary/20 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-6 border-t border-white/5">
              <Button variant="outline" className="w-full justify-start gap-3 border-white/10 text-muted-foreground hover:text-white">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}