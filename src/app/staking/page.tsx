"use client";

import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, ShieldCheck, Lock, ArrowRight, Zap, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const STAKING_TIERS = [
  { days: 7, reward: 5, label: 'Starter', icon: Zap },
  { days: 14, reward: 10, label: 'Advanced', icon: ShieldCheck },
  { days: 30, reward: 20, label: 'Elite', icon: Lock },
];

export default function StakingPage() {
  const [selectedTier, setSelectedTier] = useState(0);
  const [amount, setAmount] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStake = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount of SOLAR to stake.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Staking Successful",
      description: `Successfully staked ${numAmount} SOLAR for ${STAKING_TIERS[selectedTier].days} days.`,
    });
    setAmount('');
  };

  const potentialReward = parseFloat(amount) ? (parseFloat(amount) * (STAKING_TIERS[selectedTier].reward / 100)).toFixed(2) : '0.00';

  // Calculate unlock date on the client to avoid hydration mismatch
  const unlockDate = mounted 
    ? new Date(Date.now() + STAKING_TIERS[selectedTier].days * 24 * 60 * 60 * 1000).toLocaleDateString()
    : "--/--/----";

  return (
    <Shell>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold">Token Staking Vault</h1>
          <p className="text-muted-foreground">Secure your SOLAR tokens and earn high-yield rewards.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Staking Tiers */}
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
                  {selectedTier === i && (
                    <div className="absolute top-4 right-4">
                      <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Card className="glass-card mt-8">
              <CardHeader>
                <CardTitle className="text-lg font-headline font-bold">Staking Terminal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className="font-bold">45,230.45 SOLAR</span>
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
                      onClick={() => setAmount('45230.45')}
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Calculator className="w-3 h-3" />
                      ESTIMATED REWARD
                    </div>
                    <p className="text-xl font-bold text-green-500">+{potentialReward} SOLAR</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Lock className="w-3 h-3" />
                      UNLOCK DATE
                    </div>
                    <p className="text-xl font-bold">
                      {unlockDate}
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleStake}
                  className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-2xl"
                >
                  Confirm Staking
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Staked tokens will be locked until the duration ends. Early withdrawal is not possible.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Staking Summary Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg font-headline font-bold">Your Staking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Staked</p>
                  <h3 className="text-3xl font-bold font-headline">12,000.00</h3>
                  <p className="text-xs text-secondary mt-1 tracking-widest">SOLAR</p>
                </div>
                <div className="space-y-4">
                  {[
                    { amount: '5,000', days: '14 Left', reward: '+500' },
                    { amount: '7,000', days: '2 Left', reward: '+350' },
                  ].map((stake, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                      <div>
                        <p className="text-sm font-bold">{stake.amount} SOLAR</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{stake.days}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-green-500">{stake.reward}</p>
                        <p className="text-[10px] text-muted-foreground">Accumulated</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-headline font-bold">Global Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Value Locked</span>
                  <span className="font-bold">8.5M SOLAR</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Staking Participants</span>
                  <span className="font-bold">24.5K</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Average APY</span>
                  <span className="font-bold text-secondary">15.4%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
