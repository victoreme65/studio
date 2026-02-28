"use client";

import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  TrendingUp, 
  Plus,
  Search,
  Settings,
  MoreVertical,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const db = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(10));
  }, [db]);

  const { data: users, isLoading: isUsersLoading } = useCollection(usersQuery);

  const handleSeedData = async () => {
    if (!db) return;
    setIsSeeding(true);
    try {
      const signals = [
        { pair: "BTC/USDT", type: "BUY", entry: 64250.50, takeProfit: 68000.00, stopLoss: 62000.00, confidence: 88, timestamp: new Date().toISOString() },
        { pair: "ETH/USDT", type: "SELL", entry: 3450.20, takeProfit: 3100.00, stopLoss: 3600.00, confidence: 72, timestamp: new Date().toISOString() },
        { pair: "SOL/USDT", type: "BUY", entry: 145.80, takeProfit: 165.00, stopLoss: 138.00, confidence: 91, timestamp: new Date().toISOString() }
      ];

      const predictions = [
        { asset: "BTC", trend: "Bullish", confidence: 85, targetPrice: 72000, timestamp: new Date().toISOString() },
        { asset: "ETH", trend: "Sideways", confidence: 50, targetPrice: 3500, timestamp: new Date().toISOString() },
        { asset: "EUR/USD", trend: "Bearish", confidence: 65, targetPrice: 1.075, timestamp: new Date().toISOString() }
      ];

      for (const signal of signals) {
        addDocumentNonBlocking(collection(db, 'signals_public'), signal);
      }
      for (const pred of predictions) {
        addDocumentNonBlocking(collection(db, 'predictions_public'), pred);
      }

      toast({ title: "Real-time Sync", description: "Market signals and predictions synchronized." });
    } catch (e: any) {
      toast({ title: "Sync Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2 text-white">
              <ShieldCheck className="text-primary" />
              Admin Command Center
            </h1>
            <p className="text-muted-foreground">Manage Solar AI ecosystem, users, and content.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              variant="outline" 
              className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
            >
              {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
              Synchronize AI Nodes
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Asset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Network Users', value: users?.length || '0', sub: 'Live connections', icon: Users },
            { label: 'AI Compute', value: 'Quantum-9', sub: 'Nominal state', icon: Zap },
            { label: 'System Health', value: '99.9%', sub: 'All nodes online', icon: ShieldCheck },
          ].map((stat, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold font-headline text-white">{stat.value}</h3>
                  <p className="text-xs text-green-500 mt-0.5">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-primary">Entities</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-lg data-[state=active]:bg-primary">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white">User Registry</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search neural signatures..." className="pl-10 bg-white/5 border-white/10" />
                </div>
              </CardHeader>
              <CardContent>
                {isUsersLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-4">
                    {users?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`https://picsum.photos/seed/${user.id}/200`} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-white">{user.username}</p>
                            <p className="text-xs text-muted-foreground">{user.email || 'Wallet Connected'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-primary">{user.balance?.toLocaleString()} SOLAR</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{user.vipStatus ? 'VIP Elite' : 'Standard'}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-white">Neural Security Stream</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-[10px] sm:text-xs text-muted-foreground">
                  {[
                    `[${new Date().toISOString()}] SECURITY: Admin initialized node synchronization.`,
                    `[${new Date().toISOString()}] SYSTEM: AI Signal generated for BTC/USDT (Confidence 88%)`,
                    `[${new Date().toISOString()}] AUTH: New registration signature detected on cluster-01.`,
                    `[${new Date().toISOString()}] SYSTEM: Daily node synchronization complete.`,
                    `[${new Date().toISOString()}] WARNING: High server load detected on Mining-Node-04`,
                  ].map((log, i) => (
                    <div key={i} className={`p-2 rounded border-l-2 ${log.includes('WARNING') ? 'border-secondary bg-secondary/5' : log.includes('SECURITY') ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}