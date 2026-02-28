"use client";

import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Coins, 
  Zap, 
  Pickaxe, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck,
  UserPlus,
  Activity,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, limit, orderBy } from 'firebase/firestore';

const CHART_DATA = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 4500 },
  { name: 'Wed', value: 4200 },
  { name: 'Thu', value: 4800 },
  { name: 'Fri', value: 5200 },
  { name: 'Sat', value: 5800 },
  { name: 'Sun', value: 6400 },
];

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

  const signalsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'signals_public'), orderBy('timestamp', 'desc'), limit(3));
  }, [db]);

  const { data: signals, isLoading: isSignalsLoading } = useCollection(signalsQuery);

  const handleUpgradeTier = () => {
    if (!userRef || !userData) return;
    updateDocumentNonBlocking(userRef, {
      vipStatus: true,
      balance: (userData.balance || 0) - 5000 
    });
  };

  if (isUserLoading || isUserDataLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold tracking-tight">Command Center</h1>
            <p className="text-muted-foreground">Quantum analytics and mining optimization live.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/10 px-4 py-1.5 rounded-full font-bold">
              {userData?.vipStatus ? 'VIP LEVEL 1' : 'STANDARD TIER'}
            </Badge>
            {!userData?.vipStatus && (
              <Button 
                onClick={handleUpgradeTier}
                className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-full px-6 glow-primary"
              >
                <Zap className="w-4 h-4" />
                Upgrade Tier
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'SOLAR Balance', value: userData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00', sub: `Rate: ${userData?.miningRate || 0}/H`, icon: Coins, color: 'text-secondary', glow: 'shadow-secondary/5' },
            { label: 'Mining Progress', value: 'ACTIVE', sub: 'Syncing Nodes', icon: Pickaxe, color: 'text-primary', glow: 'shadow-primary/5' },
            { label: 'Active Stakes', value: userData?.stakingBalance?.toLocaleString() || '0', sub: 'Shield Secured', icon: ShieldCheck, color: 'text-green-500', glow: 'shadow-green-500/5' },
            { label: 'Referral Link', value: userData?.referralCode || 'N/A', sub: '25% Kickback', icon: UserPlus, color: 'text-purple-500', glow: 'shadow-purple-500/5' },
          ].map((stat, i) => (
            <Card key={i} className={`glass-card group ${stat.glow}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Activity className="w-4 h-4 text-muted-foreground opacity-30" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold font-headline truncate">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    {stat.sub}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <div className="space-y-1">
                <CardTitle className="text-lg font-headline font-bold">Value Trajectory</CardTitle>
                <p className="text-xs text-muted-foreground">Historical performance vs AI projection</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs rounded-full">24H</Button>
                <Button variant="secondary" size="sm" className="text-xs rounded-full">7D</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px'}} itemStyle={{color: 'hsl(var(--foreground))'}} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline font-bold">Live Signals</CardTitle>
              <Badge className="bg-primary/20 text-primary border-none text-[10px] animate-pulse">LIVE</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {signals?.map((signal, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                        {signal.type === 'BUY' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{signal.pair}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{signal.confidence}% Accuracy</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-destructive'}`}>{signal.type}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">@{signal.entry?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {!signals?.length && !isSignalsLoading && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No active signals found.
                  </div>
                )}
              </div>
              <div className="p-4 bg-white/5">
                <Button variant="ghost" className="w-full text-xs text-primary gap-2" asChild>
                  <Link href="/signals">
                    Open Full Terminal <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}