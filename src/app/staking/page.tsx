"use client";

import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, ShieldCheck, Lock, Zap, Calculator, Loader2, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';

const STAKING_TIERS = [
  { days: 7, reward: 5, label: 'Std', icon: Zap, rate: 0.05 },
  { days: 14, reward: 12, label: 'Ref', icon: ShieldCheck, rate: 0.12 },
  { days: 30, reward: 25, label: 'Quantum', icon: Lock, rate: 0.25 },
];

export default function StakingPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [selectedTier, setSelectedTier] = useState(0);
  const [amount, setAmount] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: userData } = useDoc(userRef);

  const stakesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'stakingTransactions'), orderBy('startTime', 'desc'));
  }, [db, user]);

  const { data: stakes } = useCollection(stakesQuery);

  const handleStake = () => {
    const numAmount = parseFloat(amount);
    if (!user || !userRef || !userData || !db) return;
    
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > (userData.balance || 0)) {
      toast({ title: "Error", description: "Insufficient balance.", variant: "destructive" });
      return;
    }

    const tier = STAKING_TIERS[selectedTier];
    const startTime = new Date();
    const endTime = new Date();
    endTime.setDate(startTime.getDate() + tier.days);

    updateDocumentNonBlocking(userRef, {
      balance: userData.balance - numAmount,
      stakingBalance: (userData.stakingBalance || 0) + numAmount
    });

    addDocumentNonBlocking(collection(db, 'users', user.uid, 'stakingTransactions'), {
      userId: user.uid,
      amount: numAmount,
      durationDays: tier.days,
      interestRate: tier.rate,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'active',
      rewardEarned: numAmount * tier.rate
    });

    toast({ title: "Secured", description: `Staked ${numAmount} SOLAR.` });
    setAmount('');
  };

  const potentialReward = parseFloat(amount) ? (parseFloat(amount) * (STAKING_TIERS[selectedTier].rate)).toFixed(2) : '0.00';
  const unlockDate = mounted 
    ? new Date(Date.now() + STAKING_TIERS[selectedTier].days * 24 * 60 * 60 * 1000).toLocaleDateString()
    : "--/--/----";

  if (isUserLoading) return <Shell><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div></Shell>;

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-headline font-bold">Yield Vaults</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Secure your assets for passive network yields.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary" />
              Pool Selection
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {STAKING_TIERS.map((tier, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTier(i)}
                  className={`glass-card p-3 rounded-xl text-center transition-all ${selectedTier === i ? 'ring-1 ring-primary bg-primary/5' : 'hover:bg-white/5'}`}
                >
                  <div className={`p-1.5 rounded-lg w-fit mx-auto mb-2 ${selectedTier === i ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                    <tier.icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold font-headline">{tier.days}D</h3>
                  <p className="text-sm font-bold text-secondary">+{tier.reward}%</p>
                </button>
              ))}
            </div>

            <Card className="glass-card">
              <CardHeader className="py-4 border-b border-white/5">
                <CardTitle className="text-sm md:text-base font-headline font-bold flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary" />
                  Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                    <span>Available</span>
                    <span className="text-white">{userData?.balance?.toLocaleString() || '0.00'} SOLAR</span>
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Amount..." 
                      className="bg-white/5 border-white/10 h-12 text-lg font-bold pr-16 rounded-xl"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-primary h-8"
                      onClick={() => setAmount(userData?.balance?.toString() || '0')}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[8px] text-muted-foreground uppercase mb-0.5">EST. YIELD</p>
                    <p className="text-sm font-bold text-green-500">+{potentialReward}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-[8px] text-muted-foreground uppercase mb-0.5">UNLOCK</p>
                    <p className="text-sm font-bold">{unlockDate}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleStake}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full h-12 font-bold bg-primary hover:bg-primary/90 rounded-xl"
                >
                  Commit to Vault
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card h-full max-h-[400px] md:max-h-none overflow-hidden flex flex-col">
            <CardHeader className="py-4 border-b border-white/5">
              <CardTitle className="text-sm md:text-base font-headline font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto scrollbar-hide p-0">
              <div className="divide-y divide-white/5">
                {stakes?.map((stake, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <p className="text-xs font-bold">{stake.amount.toLocaleString()} SOLAR</p>
                      <p className="text-[9px] text-muted-foreground uppercase">Ends: {new Date(stake.endTime).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs font-bold text-green-500">+{stake.rewardEarned.toFixed(2)}</p>
                  </div>
                ))}
                {!stakes?.length && (
                  <div className="p-8 text-center text-muted-foreground text-[10px]">Empty vault.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
