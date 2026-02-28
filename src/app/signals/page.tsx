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
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-headline font-bold text-white">AI Trading Signals</h1>
            <p className="text-[10px] text-muted-foreground">High-probability setups detected by Solar AI clusters.</p>
          </div>
          <Button onClick={handleRefresh} disabled={isLoading} size="sm" className="bg-primary hover:bg-primary/90 text-white gap-1.5 h-8 text-[10px] rounded-full px-4">
            <RefreshCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Synchronizing AI Nodes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {signals?.map((signal, i) => (
              <Card key={i} className="glass-card group overflow-hidden border-white/5 hover:border-primary/20 transition-all">
                <div className={`h-0.5 w-full ${signal.type === 'BUY' ? 'bg-green-500' : 'bg-destructive'}`} />
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center font-bold text-sm">
                      {signal.pair.split('/')[0]}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold font-headline">{signal.pair}</CardTitle>
                      <p className="text-[8px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {new Date(signal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge className={`text-[8px] h-5 px-1.5 border-none ${signal.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}`}>
                    {signal.type}
                  </Badge>
                </CardHeader>
                <CardContent className="px-4 pb-3 space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-[7px] uppercase tracking-widest text-muted-foreground mb-0.5">Entry Price</p>
                      <p className="text-sm font-bold font-mono">${signal.entry.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <p className="text-[7px] uppercase tracking-widest text-muted-foreground mb-0.5">Confidence</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-bold text-secondary">{signal.confidence}%</p>
                        <Zap className="w-2.5 h-2.5 text-secondary fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-green-500">
                        <Target className="w-3 h-3" />
                        <span>Take Profit</span>
                      </div>
                      <span className="font-bold font-mono text-green-500">${signal.takeProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        <span>Stop Loss</span>
                      </div>
                      <span className="font-bold font-mono text-destructive">${signal.stopLoss.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5">
                    <Button size="sm" className="w-full h-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 gap-1.5 text-[9px] rounded-lg">
                      <BarChart3 className="w-3 h-3" />
                      Neural Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!signals?.length && (
              <div className="col-span-full py-16 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-50">No signals found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}