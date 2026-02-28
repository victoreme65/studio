import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Coins, 
  Zap, 
  Pickaxe, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_SIGNALS, MOCK_PREDICTIONS } from '@/app/lib/mock-data';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <Shell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Welcome back, John!</h1>
            <p className="text-muted-foreground mt-1">Here is your trading and mining overview for today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/5 px-3 py-1">
              VIP LEVEL 1
            </Badge>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Zap className="w-4 h-4" />
              Upgrade to VIP
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Balance', value: '45,230.45 SOLAR', sub: '≈ $12,450.00', icon: Coins, color: 'text-secondary' },
            { label: 'Mining Rate', value: '0.4 SOLAR/hr', sub: 'Base Rate Active', icon: Pickaxe, color: 'text-primary' },
            { label: 'Staked Tokens', value: '12,000 SOLAR', sub: 'Rewards: +450.12', icon: ShieldCheck, color: 'text-green-500' },
            { label: 'Referral Earnings', value: '1,245.80 SOLAR', sub: '12 Active Referrals', icon: UserPlus, color: 'text-purple-500' },
          ].map((stat, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold font-headline truncate">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mining Preview */}
          <Card className="lg:col-span-2 glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline font-bold">Mining in Progress</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                <Link href="/mining">View Details</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                  <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center relative z-10">
                    <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <Pickaxe className="absolute w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold font-headline mb-1">0.02450 SOLAR</h4>
                  <p className="text-muted-foreground">Unclaimed Mining Balance</p>
                </div>
                <div className="flex gap-4 mt-8 w-full max-w-xs">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">Claim Rewards</Button>
                  <Button variant="outline" className="flex-1 border-white/10 text-white">Boost Rate</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Signals */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline font-bold">Latest AI Signals</CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                <Link href="/signals">Full List</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {MOCK_SIGNALS.slice(0, 4).map((signal, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                        {signal.type === 'BUY' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{signal.pair}</p>
                        <p className="text-xs text-muted-foreground">{signal.confidence}% Confidence</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-destructive'}`}>{signal.type}</p>
                      <p className="text-xs text-muted-foreground font-mono">@{signal.entry.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Predictions Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold">Market Predictions</h2>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
              <Link href="/predictions">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_PREDICTIONS.map((pred, i) => (
              <div key={i} className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                    {pred.asset}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{pred.asset}</p>
                    <p className={`text-xs ${pred.trend === 'Bullish' ? 'text-green-500' : pred.trend === 'Bearish' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {pred.trend} Trend
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${pred.targetPrice.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Target</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}