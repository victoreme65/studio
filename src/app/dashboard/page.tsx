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
      "Sentiment shift detected on X clusters",
      "Optimizing trade parameters",
      "Neural link established with Node-9",
      "Calculating liquidation clusters",
    ];

    const logInterval = setInterval(() => {
      const msg = neuralMessages[Math.floor(Math.random() * neuralMessages.length)];
      setNeuralLogs(prev => [msg, ...prev].slice(0, 4));
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
    return query(collection(db, 'signals_public'), orderBy('timestamp', 'desc'), limit(5));
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
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-2xl font-headline font-bold">Network Core</h1>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span>BTC @ <span className="text-white font-mono">${ticker.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Badge variant="outline" className="border-secondary/30 text-secondary bg-secondary/5 px-2 py-0.5 rounded-full text-[9px] font-bold">
              {userData?.vipStatus ? 'VIP ELITE' : 'STANDARD'}
            </Badge>
            {!userData?.vipStatus && (
              <Button 
                onClick={handleUpgradeTier}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white gap-1 h-8 rounded-full px-3 text-[10px] glow-primary ml-auto sm:ml-0"
              >
                <Zap className="w-3 h-3" />
                Upgrade
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {[
            { label: 'SOLAR Balance', value: userData?.balance?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00', sub: `+${userData?.miningRate || 0.4}/H`, icon: Coins, color: 'text-secondary' },
            { label: 'Mining State', value: 'ACTIVE', sub: 'Syncing Nodes', icon: Pickaxe, color: 'text-primary' },
            { label: 'Vault Staked', value: userData?.stakingBalance?.toLocaleString() || '0', sub: 'Secured Funds', icon: ShieldCheck, color: 'text-green-500' },
            { label: 'Referral ID', value: userData?.referralCode || 'N/A', sub: 'Earn 25%', icon: UserPlus, color: 'text-purple-500' },
          ].map((stat, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-3">
                <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color} w-fit mb-1.5`}>
                  <stat.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <p className="text-[8px] md:text-[9px] text-muted-foreground font-medium mb-0.5 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-base md:text-lg font-bold font-headline truncate">{stat.value}</h3>
                <p className="text-[8px] text-muted-foreground mt-1 flex items-center gap-1">
                  <TrendingUp className="w-2 h-2 text-green-500" />
                  {stat.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-white/5">
              <CardTitle className="text-xs md:text-sm font-headline font-bold flex items-center gap-2">
                <BrainCircuit className="w-3.5 h-3.5 text-primary" />
                Market Trajectory
              </CardTitle>
              <Badge variant="outline" className="text-[8px]">LIVE</Badge>
            </CardHeader>
            <CardContent className="pt-3 px-2 md:px-4">
              <div className="h-[180px] md:h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 8}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '9px'}} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={1.5} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-3 p-2 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <p className="text-[7px] md:text-[8px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Binary className="w-2 h-2" />
                  AI Stream
                </p>
                <div className="space-y-0.5">
                  {neuralLogs.map((log, i) => (
                    <p key={i} className="text-[8px] font-mono text-primary/80 truncate">
                      {'>'} {log}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card flex flex-col h-full max-h-[350px] lg:max-h-none">
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-white/5">
              <CardTitle className="text-xs md:text-sm font-headline font-bold">Signals</CardTitle>
              <span className="flex h-1 w-1 rounded-full bg-green-500 animate-pulse" />
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-white/5">
                {signals?.map((signal, i) => (
                  <div key={i} className="px-3 py-2 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                        {signal.type === 'BUY' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold">{signal.pair}</p>
                        <p className="text-[8px] text-muted-foreground uppercase">{signal.confidence}% Conf</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-destructive'}`}>{signal.type}</p>
                      <p className="text-[9px] font-mono text-muted-foreground">${signal.entry?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {!signals?.length && !isSignalsLoading && (
                  <div className="p-4 text-center text-muted-foreground text-[10px]">Waiting for sync...</div>
                )}
              </div>
              <div className="p-2 bg-white/5 border-t border-white/5">
                <Button variant="ghost" className="w-full h-7 text-[9px] text-primary gap-1" asChild>
                  <Link href="/signals">Terminal <ArrowRight className="w-2 h-2" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}