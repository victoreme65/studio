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
  { days: 7, reward: 5, label: 'Standard', icon: Zap, rate: 0.05 },
  { days: 14, reward: 12, label: 'Reinforced', icon: ShieldCheck, rate: 0.12 },
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
      toast({
        title: "Transaction Error",
        description: "Verify your available SOLAR balance.",
        variant: "destructive"
      });
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

    toast({
      title: "Vault Secured",
      description: `Committed ${numAmount} SOLAR to the ${tier.label} vault.`,
    });
    setAmount('');
  };

  const potentialReward = parseFloat(amount) ? (parseFloat(amount) * (STAKING_TIERS[selectedTier].rate)).toFixed(2) : '0.00';
  const unlockDate = mounted 
    ? new Date(Date.now() + STAKING_TIERS[selectedTier].days * 24 * 60 * 60 * 1000).toLocaleDateString()
    : "--/--/----";

  if (isUserLoading) return <Shell><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div></Shell>;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Yield Vaults</h1>
          <p className="text-muted-foreground">Lock assets in decentralized security pools to generate network yields.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Available Pools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STAKING_TIERS.map((tier, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTier(i)}
                  className={`glass-card p-6 rounded-2xl text-left transition-all relative overflow-hidden group ${selectedTier === i ? 'ring-2 ring-primary bg-primary/10 shadow-[0_0_30px_rgba(0,102,255,0.15)]' : 'hover:bg-white/5'}`}
                >
                  <div className={`p-2 rounded-lg w-fit mb-4 ${selectedTier === i ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                    <tier.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-headline mb-1">{tier.days} Days</h3>
                  <p className="text-2xl font-bold text-secondary mb-1">+{tier.reward}%</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{tier.label} Access</p>
                </button>
              ))}
            </div>

            <Card className="glass-card mt-8">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Vault Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-muted-foreground">Balance in Wallet</span>
                    <span className="text-white">{userData?.balance?.toLocaleString() || '0.00'} SOLAR</span>
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Commit amount..." 
                      className="bg-white/5 border-white/10 h-16 text-2xl font-bold pr-24 rounded-2xl focus:ring-primary"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10 font-bold"
                      onClick={() => setAmount(userData?.balance?.toString() || '0')}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">NETWORK YIELD</p>
                    <p className="text-xl font-bold text-green-500">+{potentialReward} SOLAR</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">MATURITY DATE</p>
                    <p className="text-xl font-bold text-white">{unlockDate}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleStake}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl glow-primary"
                >
                  Commit to Vault
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card bg-primary/5 border-primary/20">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg font-headline font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  Active Stakes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {stakes?.map((stake, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-white">{stake.amount.toLocaleString()} SOLAR</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Ends: {new Date(stake.endTime).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-500">+{stake.rewardEarned.toFixed(2)}</p>
                      <Badge variant="outline" className="text-[8px] h-4 border-primary/30 text-primary">SECURED</Badge>
                    </div>
                  </div>
                ))}
                {!stakes?.length && (
                  <div className="text-center py-8 space-y-2">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Coins className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Your vault is currently empty.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="p-6 rounded-2xl glass-card bg-secondary/5 border-secondary/20">
              <h4 className="text-sm font-bold text-secondary flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 fill-current" />
                Boost Rewards
              </h4>
              <p className="text-xs text-muted-foreground">
                VIP Elite members receive an additional 5% yield boost on all Quantum tier stakes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}