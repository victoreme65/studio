"use client";

import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, Zap, Flame, Clock, Coins, History } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

export default function MiningPage() {
  const [isMining, setIsMining] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [miningRate] = useState(0.4 / 3600); // Solar per second

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining) {
      interval = setInterval(() => {
        setAccumulated(prev => prev + miningRate);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, miningRate]);

  const handleToggleMining = () => {
    setIsMining(!isMining);
    if (!isMining) {
      toast({
        title: "Mining Started",
        description: "Your session has been initialized. SOLAR tokens are being generated.",
      });
    }
  };

  const handleClaim = () => {
    if (accumulated < 0.01) {
      toast({
        title: "Balance too low",
        description: "Minimum claim amount is 0.01 SOLAR",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Tokens Claimed",
      description: `Successfully added ${accumulated.toFixed(4)} SOLAR to your wallet.`,
    });
    setAccumulated(0);
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold">Cloud Mining Engine</h1>
          <p className="text-muted-foreground">High-performance decentralized mining powered by Solar AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Mining Terminal */}
          <Card className="md:col-span-2 glass-card relative overflow-hidden group">
            {isMining && (
              <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse" />
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pickaxe className={isMining ? "text-primary animate-bounce" : "text-muted-foreground"} />
                Active Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 py-10">
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className={`w-48 h-48 rounded-full border-2 border-white/5 flex items-center justify-center transition-all duration-500 ${isMining ? 'border-primary shadow-[0_0_50px_-12px_rgba(0,102,255,0.5)]' : ''}`}>
                    <div className="text-center">
                      <h2 className="text-5xl font-bold font-headline mb-1 tabular-nums">
                        {accumulated.toFixed(5)}
                      </h2>
                      <p className="text-sm font-medium text-secondary tracking-widest uppercase">SOLAR</p>
                    </div>
                  </div>
                  {isMining && (
                    <div className="absolute -top-4 -right-4">
                      <Zap className="text-secondary fill-current w-12 h-12 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    <span>Mining Rate</span>
                    <span className="text-primary">0.4 SOLAR / HR</span>
                  </div>
                  <Progress value={isMining ? 100 : 0} className="h-2 bg-white/5" />
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleToggleMining}
                  size="lg" 
                  className={`flex-1 h-16 text-lg font-bold rounded-2xl transition-all duration-300 ${isMining ? 'bg-destructive/10 text-destructive border border-destructive hover:bg-destructive hover:text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                >
                  {isMining ? 'Stop Mining' : 'Start Mining'}
                </Button>
                <Button 
                  onClick={handleClaim}
                  disabled={accumulated === 0}
                  variant="outline" 
                  size="lg" 
                  className="flex-1 h-16 text-lg font-bold rounded-2xl border-white/10 hover:bg-white/5"
                >
                  Claim Tokens
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mining Info */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Boosters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'VIP Multiplier', value: '1.2x', active: true },
                  { name: 'Referral Bonus', value: '1.05x', active: false },
                  { name: 'Daily Streak', value: '1.0x', active: false },
                ].map((boost, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-sm font-medium">{boost.name}</span>
                    <Badge variant={boost.active ? 'default' : 'secondary'} className={boost.active ? 'bg-primary' : 'bg-white/5'}>
                      {boost.value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-primary">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hash Power</p>
                    <p className="text-sm font-bold">12.4 GH/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 text-secondary">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active Time</p>
                    <p className="text-sm font-bold">12h 45m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Claim History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="text-muted-foreground" />
              Claim History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { amount: '12.450', date: '2024-05-20 14:30', status: 'Completed' },
                { amount: '8.210', date: '2024-05-19 12:15', status: 'Completed' },
                { amount: '15.600', date: '2024-05-18 09:45', status: 'Completed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">+{item.amount} SOLAR</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-none">{item.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}