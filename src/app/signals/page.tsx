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
  Calendar
} from 'lucide-react';
import { MOCK_SIGNALS } from '@/app/lib/mock-data';
import { toast } from '@/hooks/use-toast';

export default function SignalsPage() {
  const [loading, setLoading] = useState(false);

  const refreshSignals = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Signals Updated",
        description: "Latest AI trading analysis fetched successfully.",
      });
    }, 1500);
  };

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">AI Trading Signals</h1>
            <p className="text-muted-foreground">High-probability setups detected by Solar AI neural networks.</p>
          </div>
          <Button onClick={refreshSignals} disabled={loading} className="bg-primary hover:bg-primary/90 text-white gap-2">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Signals
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_SIGNALS.map((signal, i) => (
            <Card key={i} className="glass-card group overflow-hidden border-white/5 hover:border-primary/20">
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
                <Badge className={signal.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}>
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
                    View Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Signal Performance Banner */}
        <div className="glass-card rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-glow">
              <Zap className="w-10 h-10 text-primary fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold">Signal Accuracy: 94.2%</h3>
              <p className="text-muted-foreground">Our AI model has successfully predicted 240/255 signals this month.</p>
            </div>
          </div>
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 rounded-full font-bold">
            Get Premium Signals
          </Button>
        </div>
      </div>
    </Shell>
  );
}