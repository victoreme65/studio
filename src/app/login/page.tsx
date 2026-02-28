"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Mail, Lock, ArrowLeft, Wallet, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const ensureUserProfile = async (userId: string, data: any) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        id: userId,
        username: data.username || 'Trader_' + userId.slice(0, 4),
        email: data.email || null,
        balance: 1000,
        miningRate: 0.4,
        lastMiningTime: new Date().toISOString(),
        referralCode: `SOLAR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        vipStatus: false,
        stakingBalance: 0,
        createdAt: serverTimestamp()
      });
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await ensureUserProfile(result.user.uid, { 
        username: result.user.displayName?.split(' ')[0] || 'Trader',
        email: result.user.email 
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Social Login Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      await ensureUserProfile(userCredential.user.uid, { username: 'Web3_Explorer' });
      toast({ title: "Web3 Session Active", description: "Wallet interface connected." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Wallet Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden cyber-grid">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,102,255,0.1),transparent)] pointer-events-none" />
      
      <div className="p-6">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-white">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6 animate-glow">
              <Zap className="text-white w-10 h-10 fill-current" />
            </div>
            <h1 className="text-4xl font-headline font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Access your Solar AI dashboard and mining rig.</p>
          </div>

          <Card className="glass-card border-white/10 shadow-2xl">
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" 
                  />
                </div>
              </div>

              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Login to Portal'}
              </Button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0A0A0A] px-2 text-muted-foreground">Web3 & Social</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleGoogleLogin} variant="outline" className="border-white/10 hover:bg-white/5 gap-2 h-12">
                   <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  Google
                </Button>
                <Button onClick={handleWalletLogin} variant="outline" className="border-white/10 hover:bg-white/5 gap-2 h-12">
                  <Wallet className="w-4 h-4 text-secondary" /> Wallet
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            New entity? <Link href="/register" className="text-primary font-bold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}