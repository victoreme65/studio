"use client";

import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  AlertCircle, 
  RefreshCcw,
  BarChart3,
  Calendar,
  Loader2
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export default function SignalsPage() {
  const db = useFirestore();

  const signalsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'signals_public'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: signals, isLoading } = useCollection(signalsQuery);

  const handleRefresh = () => {
    toast({
      title: "Refreshing Network",
      description: "Fetching latest AI neural outputs...",
    });
  };

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">AI Trading Signals</h1>
            <p className="text-muted-foreground">High-probability setups detected by Solar AI clusters.</p>
          </div>
          <Button onClick={handleRefresh} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white gap-2">
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Signals
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Synchronizing with AI Nodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {signals?.map((signal, i) => (
              <Card key={i} className="glass-card group overflow-hidden border-white/5 hover:border-primary/20 transition-all">
                <div className={`h-1 w-full ${signal.type === 'BUY' ? 'bg-green-500' : 'bg-destructive'}`} />
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg">
                      {signal.pair.split('/')[0]}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold font-headline">{signal.pair}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(signal.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={signal.type === 'BUY' ? 'bg-green-500/20 text-green-500 border-none' : 'bg-destructive/20 text-destructive border-none'}>
                    {signal.type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Entry Price</p>
                      <p className="text-lg font-bold font-mono">${signal.entry.toLocaleString()}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-secondary">{signal.confidence}%</p>
                        <Zap className="w-4 h-4 text-secondary fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-green-500">
                        <Target className="w-4 h-4" />
                        <span>Take Profit</span>
                      </div>
                      <span className="font-bold font-mono text-green-500">${signal.takeProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span>Stop Loss</span>
                      </div>
                      <span className="font-bold font-mono text-destructive">${signal.stopLoss.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Neural Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!signals?.length && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">No active signals at this block depth.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}