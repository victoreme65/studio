"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, Zap, Flame, Clock, Coins, History, Terminal, Power, Database, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';

export default function MiningPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isMining, setIsMining] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Engine initialized...", "[SYSTEM] Checking node synchronization..."]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining && userData) {
      const ratePerSec = (userData.miningRate || 0.4) / 3600;
      interval = setInterval(() => {
        setAccumulated(prev => prev + ratePerSec);
        if (Math.random() > 0.95) {
          addLog(`[NODE-SECURE] Block ${Math.floor(Math.random() * 10000)} verified. 0x${Math.random().toString(16).slice(2, 10)}...`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, userData]);

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
      addLog("Starting quantum hash extraction sequence...");
      toast({
        title: "Ignition",
        description: "Cloud mining nodes are now online.",
      });
    } else {
      addLog("Node termination initiated. Powering down...");
    }
  };

  const handleClaim = () => {
    if (!userRef || !userData || accumulated < 0.0001) return;

    const newBalance = (userData.balance || 0) + accumulated;
    
    updateDocumentNonBlocking(userRef, {
      balance: newBalance,
      lastMiningTime: new Date().toISOString()
    });

    if (db && user) {
      addDocumentNonBlocking(collection(db, 'users', user.uid, 'miningLogs'), {
        amount: accumulated,
        timestamp: new Date().toISOString(),
        userId: user.uid
      });
    }

    addLog(`Successfully bridged ${accumulated.toFixed(6)} SOLAR to mainnet.`);
    toast({
      title: "Sync Complete",
      description: `Bridged ${accumulated.toFixed(6)} SOLAR to your wallet.`,
    });
    setAccumulated(0);
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
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Quantum Extraction</h1>
            <p className="text-muted-foreground">Generating SOLAR tokens via global distributed compute nodes.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-3 py-1">Node: Active</Badge>
            <Badge variant="outline" className="border-secondary/20 bg-secondary/5 px-3 py-1 text-secondary">Efficiency: 100%</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 glass-card relative overflow-hidden group border-white/5">
            {isMining && <div className="absolute inset-0 bg-primary/5 pointer-events-none animate-pulse" />}
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-white">
                <Power className={isMining ? "text-primary animate-pulse" : "text-muted-foreground"} />
                Reactor Status
              </CardTitle>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Hash Rate</p>
                <p className="text-sm font-bold text-green-500">420 GH/S</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-12">
              <div className="flex flex-col items-center">
                <div className="relative mb-12">
                  <div className={`w-72 h-72 rounded-full border border-white/5 flex items-center justify-center transition-all duration-1000 ${isMining ? 'border-primary glow-primary scale-105 shadow-[0_0_50px_rgba(0,102,255,0.2)]' : ''}`}>
                    <div className="text-center relative z-10">
                      <h2 className="text-5xl font-bold font-headline mb-1 tabular-nums text-white">
                        {accumulated.toFixed(6)}
                      </h2>
                      <p className="text-xs font-bold text-secondary tracking-[0.3em] uppercase">Unclaimed SOLAR</p>
                    </div>
                    {/* Visual Reactor Rings */}
                    {isMining && (
                      <>
                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
                        <div className="absolute inset-4 rounded-full border border-primary/10 animate-spin-slow" />
                      </>
                    )}
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
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Yield Speed</p>
                      <p className="text-lg font-bold text-primary">{userData?.miningRate || 0.4} SOLAR / HR</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Node</p>
                      <p className="text-lg font-bold text-white">SOLAR-IX-TERMINAL</p>
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
                  {isMining ? 'Shutdown Reactor' : 'Start Mining'}
                </Button>
                <Button 
                  onClick={handleClaim}
                  disabled={accumulated < 0.0001}
                  className="flex-1 h-20 text-xl font-bold rounded-2xl border-white/10 glass-card text-white hover:bg-white/10"
                >
                  Bridge to Balance
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass-card bg-black/40 border-white/5 flex flex-col h-[400px]">
              <CardHeader className="py-3 border-b border-white/5">
                <CardTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  Node Analytics
                </CardTitle>
              </CardHeader>
              <CardContent ref={terminalRef} className="flex-1 p-4 font-mono text-[10px] text-primary/70 overflow-y-auto scrollbar-hide space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="leading-tight animate-in fade-in slide-in-from-bottom-1">{log}</div>
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
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Sync Depth</p>
                    <p className="text-lg font-bold text-white">Block #1,882,442</p>
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
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </Shell>
  );
}