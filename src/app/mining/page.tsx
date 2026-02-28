"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pickaxe, Zap, Terminal, Power, Database, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';

export default function MiningPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isMining, setIsMining] = useState(false);
  const [accumulated, setAccumulated] = useState(0);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Reactor idle...", "[SYSTEM] Waiting for link..."]);
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
        if (Math.random() > 0.94) {
          addLog(`[NODE] Block verified: 0x${Math.random().toString(16).slice(2, 8)}...`);
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
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleToggleMining = () => {
    setIsMining(!isMining);
    if (!isMining) {
      addLog("Starting hash extraction...");
      toast({
        title: "Ignition",
        description: "Cloud mining nodes online.",
      });
    } else {
      addLog("Node termination sequence...");
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
    addLog(`Bridged ${accumulated.toFixed(4)} SOLAR to wallet.`);
    toast({
      title: "Sync Complete",
      description: `Claimed ${accumulated.toFixed(4)} SOLAR.`,
    });
    setAccumulated(0);
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
      <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div className="space-y-0.5">
            <h1 className="text-xl md:text-2xl font-headline font-bold">Extraction Hub</h1>
            <p className="text-[10px] text-muted-foreground">Distributed compute nodes for SOLAR generation.</p>
          </div>
          <div className="flex gap-1.5">
            <Badge variant="outline" className="text-[8px] h-5 px-1.5">Active Node</Badge>
            <Badge variant="outline" className="text-[8px] h-5 px-1.5 text-secondary border-secondary/20">100% Efficient</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="lg:col-span-3 glass-card relative overflow-hidden flex flex-col">
            <CardHeader className="py-2 px-4 border-b border-white/5 flex flex-row items-center justify-between">
              <CardTitle className="text-xs flex items-center gap-2">
                <Power className={isMining ? "text-primary animate-pulse w-3 h-3" : "text-muted-foreground w-3 h-3"} />
                Reactor
              </CardTitle>
              <div className="text-right">
                <p className="text-[8px] text-muted-foreground uppercase">Rate</p>
                <p className="text-[10px] font-bold text-green-500">420 GH/S</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center py-6 md:py-10">
              <div className="relative mb-6 md:mb-8">
                <div className={`w-36 h-36 md:w-48 md:h-48 rounded-full border border-white/5 flex items-center justify-center transition-all duration-700 ${isMining ? 'border-primary glow-primary shadow-[0_0_20px_rgba(0,102,255,0.05)]' : ''}`}>
                  <div className="text-center z-10">
                    <h2 className="text-2xl md:text-3xl font-bold font-headline mb-0.5 tabular-nums">
                      {accumulated.toFixed(5)}
                    </h2>
                    <p className="text-[8px] font-bold text-secondary uppercase tracking-widest">Unclaimed</p>
                  </div>
                  {isMining && (
                    <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping opacity-10" />
                  )}
                </div>
              </div>

              <div className="w-full max-w-xs space-y-2 mb-6">
                <div className="flex justify-between text-[9px]">
                  <span className="text-muted-foreground">Yield Speed</span>
                  <span className="text-primary font-bold">{userData?.miningRate || 0.4} SOLAR / HR</span>
                </div>
                <Progress value={isMining ? 100 : 0} className="h-1 bg-white/5" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <Button 
                  onClick={handleToggleMining}
                  className={`flex-1 h-11 text-xs font-bold rounded-lg transition-all ${isMining ? 'bg-destructive/10 text-destructive border-destructive' : 'bg-primary text-white glow-primary'}`}
                >
                  {isMining ? 'Stop Node' : 'Start Mining'}
                </Button>
                <Button 
                  onClick={handleClaim}
                  disabled={accumulated < 0.0001}
                  variant="outline"
                  className="flex-1 h-11 text-xs font-bold rounded-lg border-white/10"
                >
                  Bridge
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Card className="glass-card flex-1 bg-black/40 h-[180px] md:h-auto overflow-hidden flex flex-col">
              <CardHeader className="py-1.5 px-3 border-b border-white/5">
                <p className="text-[8px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Terminal className="w-2.5 h-2.5" />
                  Analytics
                </p>
              </CardHeader>
              <CardContent ref={terminalRef} className="p-2 font-mono text-[8px] text-primary/70 overflow-y-auto scrollbar-hide space-y-0.5">
                {logs.map((log, i) => (
                  <div key={i} className="leading-tight truncate">{log}</div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card p-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] text-muted-foreground uppercase">Sync Status</p>
                  <p className="text-[10px] font-bold truncate">Block #1.8M</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}