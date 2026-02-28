"use client";

import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, ShieldCheck, Lock, Zap, Calculator, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';

const STAKING_TIERS = [
  { days: 7, reward: 5, label: 'Starter', icon: Zap, rate: 0.05 },
  { days: 14, reward: 10, label: 'Advanced', icon: ShieldCheck, rate: 0.10 },
  { days: 30, reward: 20, label: 'Elite', icon: Lock, rate: 0.20 },
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
    if (!user || !userRef || !userData) return;
    
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > (userData.balance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "Verify your SOLAR balance before staking.",
        variant: "destructive"
      });
      return;
    }

    const tier = STAKING_TIERS[selectedTier];
    const startTime = new Date();
    const endTime = new Date();
    endTime.setDate(startTime.getDate() + tier.days);

    // Update user balance
    updateDocumentNonBlocking(userRef, {
      balance: userData.balance - numAmount,
      stakingBalance: (userData.stakingBalance || 0) + numAmount
    });

    // Record transaction
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
      description: `Staked ${numAmount} SOLAR in the ${tier.label} vault.`,
    });
    setAmount('');
  };

  const potentialReward = parseFloat(amount) ? (parseFloat(amount) * (STAKING_TIERS[selectedTier].reward / 100)).toFixed(2) : '0.00';
  const unlockDate = mounted 
    ? new Date(Date.now() + STAKING_TIERS[selectedTier].days * 24 * 60 * 60 * 1000).toLocaleDateString()
    : "--/--/----";

  if (isUserLoading) return <Shell><div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div></Shell>;

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold">Token Staking Vault</h1>
          <p className="text-muted-foreground">Secure your SOLAR tokens and earn high-yield rewards.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-headline font-bold px-1">Select Staking Duration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STAKING_TIERS.map((tier, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTier(i)}
                  className={`glass-card p-6 rounded-2xl text-left transition-all relative overflow-hidden group ${selectedTier === i ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-white/5'}`}
                >
                  <div className={`p-2 rounded-lg w-fit mb-4 ${selectedTier === i ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                    <tier.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold font-headline mb-1">{tier.days} Days</h3>
                  <p className="text-2xl font-bold text-secondary mb-1">+{tier.reward}%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{tier.label} Tier</p>
                </button>
              ))}
            </div>

            <Card className="glass-card mt-8">
              <CardHeader><CardTitle className="text-lg font-headline font-bold">Staking Terminal</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className="font-bold">{userData?.balance?.toLocaleString() || '0.00'} SOLAR</span>
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Enter amount to stake" 
                      className="bg-white/5 border-white/10 h-16 text-2xl font-bold pr-24 rounded-2xl"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:bg-primary/10"
                      onClick={() => setAmount(userData?.balance?.toString() || '0')}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">ESTIMATED REWARD</p>
                    <p className="text-xl font-bold text-green-500">+{potentialReward} SOLAR</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">UNLOCK DATE</p>
                    <p className="text-xl font-bold">{unlockDate}</p>
                  </div>
                </div>

                <Button 
                  onClick={handleStake}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl"
                >
                  Confirm Staking
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-card border-primary/20 bg-primary/5">
              <CardHeader><CardTitle className="text-lg font-headline font-bold">Your Active Stakes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {stakes?.map((stake, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                    <div>
                      <p className="text-sm font-bold">{stake.amount.toLocaleString()} SOLAR</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{new Date(stake.endTime).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-500">+{stake.rewardEarned.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {!stakes?.length && <p className="text-center text-xs text-muted-foreground py-4">No active vault positions.</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
