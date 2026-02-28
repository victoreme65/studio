"use client";

import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Coins, 
  Zap, 
  Pickaxe, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck,
  UserPlus,
  Activity,
  ArrowRight,
  Loader2,
  TrendingUp,
  BrainCircuit,
  Binary
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
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const CHART_DATA = [
  { name: '00:00', value: 42000 },
  { name: '04:00', value: 45000 },
  { name: '08:00', value: 44000 },
  { name: '12:00', value: 48000 },
  { name: '16:00', value: 52000 },
  { name: '20:00', value: 51000 },
  { name: '24:00', value: 54000 },
];

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [ticker, setTicker] = useState(64520.45);
  const [neuralLogs, setNeuralLogs] = useState<string[]>([]);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTicker(prev => prev + (Math.random() - 0.5) * 50);
    }, 3000);

    const neuralMessages = [
      "Analyzing BTC hash rate vectors...",
      "Detected pattern breakout on ETH/USDT 4H",
      "Sentiment shift detected on X/Twitter clusters",
      "Optimizing trade execution parameters",
      "Neural link established with Node-9",
      "Calculating liquidation clusters for SOL",
    ];

    const logInterval = setInterval(() => {
      const msg = neuralMessages[Math.floor(Math.random() * neuralMessages.length)];
      setNeuralLogs(prev => [msg, ...prev].slice(0, 5));
    }, 4000);

    return () => {
      clearInterval(tickerInterval);
      clearInterval(logInterval);
    };
  }, []);

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
    });
    toast({
      title: "Tier Upgraded",
      description: "You have been promoted to VIP Elite status.",
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
            <h1 className="text-4xl font-headline font-bold tracking-tight">Financial Command</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span>Network: <span className="text-white font-mono">BTC @ ${ticker.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/10 px-4 py-1.5 rounded-full font-bold">
              {userData?.vipStatus ? 'VIP ELITE' : 'STANDARD TIER'}
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
            { label: 'SOLAR Balance', value: userData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00', sub: `+${userData?.miningRate || 0.4}/H`, icon: Coins, color: 'text-secondary' },
            { label: 'Mining State', value: 'NOMINAL', sub: 'Syncing Nodes', icon: Pickaxe, color: 'text-primary' },
            { label: 'Asset Vault', value: userData?.stakingBalance?.toLocaleString() || '0', sub: 'Staked Funds', icon: ShieldCheck, color: 'text-green-500' },
            { label: 'Referral Code', value: userData?.referralCode || 'N/A', sub: 'Share & Earn', icon: UserPlus, color: 'text-purple-500' },
          ].map((stat, i) => (
            <Card key={i} className="glass-card group overflow-hidden">
              <CardContent className="p-6">
                <div className={`p-3 rounded-xl bg-white/5 ${stat.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold font-headline truncate">{stat.value}</h3>
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                Value Trajectory
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">LIVE ANALYSIS</Badge>
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
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Binary className="w-3 h-3" />
                  AI Neural Stream
                </p>
                <div className="space-y-1">
                  {neuralLogs.map((log, i) => (
                    <p key={i} className="text-[10px] font-mono text-primary/80 animate-in fade-in slide-in-from-left-2">
                      {'>'} {log}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
              <CardTitle className="text-lg font-headline font-bold">Live AI Signals</CardTitle>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5 h-[400px] overflow-y-auto scrollbar-hide">
                {signals?.map((signal, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                        {signal.type === 'BUY' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{signal.pair}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{signal.confidence}% Confidence</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-destructive'}`}>{signal.type}</p>
                      <p className="text-xs font-mono text-muted-foreground">${signal.entry?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {!signals?.length && !isSignalsLoading && (
                  <div className="p-10 text-center text-muted-foreground text-sm">Waiting for AI sync...</div>
                )}
              </div>
              <div className="p-4 bg-white/5">
                <Button variant="ghost" className="w-full text-xs text-primary gap-2" asChild>
                  <Link href="/signals">Signal Terminal <ArrowRight className="w-3 h-3" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}