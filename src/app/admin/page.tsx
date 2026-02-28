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
  Plus,
  Search,
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
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 px-1">
          <div>
            <h1 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-2 text-white">
              <ShieldCheck className="text-primary w-6 h-6" />
              Admin Command
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Ecosystem Management Portal.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              variant="outline" 
              size="sm"
              className="flex-1 md:flex-none h-9 border-primary/20 bg-primary/5 text-primary text-[10px] font-bold"
            >
              {isSeeding ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <RefreshCcw className="w-3 h-3 mr-1.5" />}
              Sync Nodes
            </Button>
            <Button size="sm" className="flex-1 md:flex-none h-9 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold">
              <Plus className="w-3 h-3 mr-1.5" />
              New Asset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {[
            { label: 'Network Users', value: users?.length || '0', sub: 'Live connections', icon: Users },
            { label: 'AI Compute', value: 'Quantum-9', sub: 'Nominal state', icon: Zap },
            { label: 'System Health', value: '99.9%', sub: 'All nodes online', icon: ShieldCheck },
          ].map((stat, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/5 text-primary shrink-0">
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] text-muted-foreground uppercase">{stat.label}</p>
                  <h3 className="text-sm md:text-base font-bold font-headline text-white truncate">{stat.value}</h3>
                  <p className="text-[7px] text-green-500 truncate">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-3">
          <TabsList className="bg-white/5 border border-white/10 h-9 p-1 rounded-xl">
            <TabsTrigger value="users" className="rounded-lg h-7 text-[10px] data-[state=active]:bg-primary">Registry</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-lg h-7 text-[10px] data-[state=active]:bg-primary">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-3">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 border-b border-white/5">
                <CardTitle className="text-xs text-white">User Registry</CardTitle>
                <div className="relative w-full max-w-[180px]">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input placeholder="Search..." className="h-7 text-[10px] pl-7 bg-white/5 border-white/10 rounded-lg" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isUsersLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="animate-spin text-primary w-5 h-5" /></div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {users?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-white/10">
                            <AvatarImage src={`https://picsum.photos/seed/${user.id}/200`} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-white truncate">{user.username}</p>
                            <p className="text-[8px] text-muted-foreground truncate">{user.email || 'Wallet Session'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-primary">{user.balance?.toLocaleString()} SOLAR</p>
                            <p className="text-[8px] text-muted-foreground uppercase">{user.vipStatus ? 'VIP' : 'STD'}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <MoreVertical className="w-3 h-3 text-muted-foreground" />
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
              <CardHeader className="py-2.5 px-4 border-b border-white/5">
                <CardTitle className="text-xs text-white uppercase tracking-widest">Neural Stream</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1.5 font-mono text-[9px] text-muted-foreground">
                  {[
                    `[${new Date().toISOString()}] SECURITY: Node sync init.`,
                    `[${new Date().toISOString()}] SYSTEM: AI Signal generated.`,
                    `[${new Date().toISOString()}] AUTH: New signature detected.`,
                    `[${new Date().toISOString()}] SYSTEM: Global sync complete.`,
                    `[${new Date().toISOString()}] WARNING: Cluster load rising.`,
                  ].map((log, i) => (
                    <div key={i} className={`p-1.5 rounded border-l-2 ${log.includes('WARNING') ? 'border-secondary bg-secondary/5' : log.includes('SECURITY') ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'}`}>
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