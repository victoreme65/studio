"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Mail, Lock, User, ArrowLeft, Wallet, Loader2, CheckCircle, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameStatus(username.length > 0 ? 'invalid' : 'idle');
        return;
      }
      
      setUsernameStatus('checking');
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        setUsernameStatus(querySnapshot.empty ? 'available' : 'taken');
      } catch (error) {
        setUsernameStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, db]);

  const initializeUserProfile = async (userId: string, data: any) => {
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      username: data.username || 'Trader_' + userId.slice(0, 4),
      email: data.email || null,
      walletAddress: data.walletAddress || null,
      balance: 1000, 
      miningRate: 0.4,
      lastMiningTime: new Date().toISOString(),
      referralCode: `SOLAR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      vipStatus: false,
      stakingBalance: 0,
      createdAt: serverTimestamp()
    }, { merge: true });
  };

  const handleRegister = async () => {
    if (!email || !password || !username) return;
    setIsLoading(true);
    
    try {
      // Simulate sending OTP
      setStep(2);
      toast({ title: "Verification Sent", description: "Check your email for the security code." });
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await initializeUserProfile(userCredential.user.uid, { username, email });
      toast({ title: "Portal Initialized", description: "Welcome to Solar AI." });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Verification Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSignup = async () => {
    setIsLoading(true);
    try {
      // Use Anonymous Auth to create a session for the wallet user
      const userCredential = await signInAnonymously(auth);
      const fakeAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      await initializeUserProfile(userCredential.user.uid, { 
        username: `Wallet_${fakeAddress.slice(2, 6)}`,
        walletAddress: fakeAddress 
      });
      toast({ title: "Wallet Connected", description: `Linked: ${fakeAddress.slice(0, 10)}...` });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Wallet Connection Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await initializeUserProfile(result.user.uid, { 
        username: result.user.displayName?.split(' ')[0] || 'Trader',
        email: result.user.email 
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Google Signup Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden cyber-grid">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,102,255,0.05),transparent)] pointer-events-none" />
      <div className="p-6">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6 animate-glow">
              <Zap className="text-white w-10 h-10 fill-current" />
            </div>
            <h1 className="text-4xl font-headline font-bold">Initialize Portal</h1>
            <p className="text-muted-foreground mt-2">Start your journey into AI-powered finance.</p>
          </div>

          <Card className="glass-card border-white/10 shadow-2xl">
            <CardContent className="pt-8">
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      placeholder="Username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className="bg-white/5 border-white/10 h-12 pl-10" 
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                      {usernameStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10 h-12 pl-10" 
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="Security Key" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/10 h-12 pl-10" 
                    />
                  </div>

                  <Button 
                    onClick={handleRegister}
                    disabled={isLoading || usernameStatus !== 'available' || password.length < 8}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Generate OTP'}
                  </Button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/5"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                      <span className="bg-[#0A0A0A] px-2 text-muted-foreground">Web3 & Social</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleGoogleSignup} variant="outline" className="border-white/10 hover:bg-white/5 gap-2 h-12">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button onClick={handleWalletSignup} variant="outline" className="border-white/10 hover:bg-white/5 gap-2 h-12">
                      <Wallet className="w-4 h-4 text-secondary" /> Wallet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="text-center space-y-2">
                    <Smartphone className="w-12 h-12 mx-auto text-primary" />
                    <h3 className="text-xl font-bold">Confirm Identity</h3>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {email}</p>
                  </div>
                  <Input 
                    placeholder="000000" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="bg-white/5 border-white/10 h-16 text-center text-3xl font-mono tracking-[0.5em]" 
                  />
                  <Button 
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Complete Initialization'}
                  </Button>
                  <Button variant="ghost" className="w-full text-xs" onClick={() => setStep(1)}>
                    Incorrect email? Change address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Known entity? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}