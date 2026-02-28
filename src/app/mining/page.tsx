"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, Zap, Flame, Clock, Coins, History, Terminal, Power, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function MiningPage() {
  const [isMining, setIsMining] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [miningRate] = useState(0.4 / 3600); // Solar per second
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Engine initialized...", "[SYSTEM] Waiting for user command..."]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining) {
      interval = setInterval(() => {
        setAccumulated(prev => prev + miningRate);
        if (Math.random() > 0.95) {
          addLog(`[NODE-04] Block verified. Hash: 0x${Math.random().toString(16).slice(2, 10)}...`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, miningRate]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleToggleMining = () => {
    setIsMining(!isMining);
    if (!isMining) {
      addLog("Starting quantum hash extraction...");
      toast({
        title: "Engine Hot",
        description: "Decentralized mining sequence initiated.",
      });
    } else {
      addLog("Engine power down sequence initiated.");
    }
  };

  const handleClaim = () => {
    if (accumulated < 0.01) {
      toast({
        title: "Minimum Not Met",
        description: "Accumulate at least 0.01 SOLAR to bridge tokens.",
        variant: "destructive"
      });
      return;
    }
    addLog(`Claimed ${accumulated.toFixed(4)} SOLAR to mainnet wallet.`);
    toast({
      title: "Sync Successful",
      description: `Bridged ${accumulated.toFixed(4)} SOLAR to your account.`,
    });
    setAccumulated(0);
  };

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white">Mining Rig</h1>
            <p className="text-muted-foreground">Quantum hash extraction from the Solar neural network.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-3 py-1">Node: Active</Badge>
            <Badge variant="outline" className="border-secondary/20 bg-secondary/5 px-3 py-1 text-secondary">Latency: 14ms</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Mining Terminal */}
          <Card className="lg:col-span-3 glass-card relative overflow-hidden group border-white/5">
            {isMining && (
              <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse" />
            )}
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-white">
                <Power className={isMining ? "text-primary animate-pulse" : "text-muted-foreground"} />
                Reactor Core
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Efficiency</p>
                  <p className="text-sm font-bold text-green-500">98.4%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-12">
              <div className="flex flex-col items-center">
                <div className="relative mb-12">
                  <div className={`w-64 h-64 rounded-full border border-white/5 flex items-center justify-center transition-all duration-700 ${isMining ? 'border-primary glow-primary' : ''}`}>
                    <div className="text-center">
                      <h2 className="text-6xl font-bold font-headline mb-1 tabular-nums text-white">
                        {accumulated.toFixed(5)}
                      </h2>
                      <p className="text-sm font-bold text-secondary tracking-[0.3em] uppercase">Pending SOLAR</p>
                    </div>
                  </div>
                  {isMining && (
                    <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
                      <Zap className="text-secondary fill-current w-8 h-8 absolute -top-4 left-1/2 -translate-x-1/2" />
                    </div>
                  )}
                </div>

                <div className="w-full max-w-lg space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Mining Frequency</p>
                      <p className="text-lg font-bold text-primary">0.4000 SOLAR / HR</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Power Draw</p>
                      <p className="text-lg font-bold text-white">0.00 kWh <span className="text-[10px] text-muted-foreground">(Cloud)</span></p>
                    </div>
                  </div>
                  <Progress value={isMining ? 100 : 0} className="h-2 bg-white/5" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <Button 
                  onClick={handleToggleMining}
                  className={`flex-1 h-20 text-xl font-bold rounded-2xl transition-all duration-500 ${isMining ? 'bg-destructive/10 text-destructive border border-destructive hover:bg-destructive hover:text-white' : 'bg-primary text-white hover:bg-primary/90 glow-primary'}`}
                >
                  {isMining ? 'Terminate Rig' : 'Ignite Engine'}
                </Button>
                <Button 
                  onClick={handleClaim}
                  disabled={accumulated === 0}
                  className="flex-1 h-20 text-xl font-bold rounded-2xl border-white/10 glass-card text-white hover:bg-white/10"
                >
                  Bridge Tokens
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Diagnostics Terminal & Stats */}
          <div className="space-y-6">
            <Card className="glass-card bg-black/40 border-white/5 flex flex-col h-[400px]">
              <CardHeader className="py-3 border-b border-white/5">
                <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  Live Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent 
                ref={terminalRef}
                className="flex-1 p-4 font-mono text-[10px] text-primary/70 overflow-y-auto scrollbar-hide space-y-1"
              >
                {logs.map((log, i) => (
                  <div key={i} className="leading-tight">{log}</div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/5">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Network Capacity</p>
                    <p className="text-lg font-bold text-white">4.2 PB</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Node Temp</p>
                    <p className="text-lg font-bold text-white">42°C <span className="text-[10px] text-muted-foreground">NOMINAL</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </Shell>
  );
}