"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Mail, Lock, User, ArrowLeft, ShieldCheck, Chrome, Wallet, Loader2, CheckCircle2, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

type Step = 'INITIAL' | 'OTP' | 'SUCCESS';

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('INITIAL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  // Username Availability Check
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
        
        if (querySnapshot.empty) {
          setUsernameStatus('available');
        } else {
          setUsernameStatus('taken');
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username, db]);

  // Password Criteria Check
  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const isUsernameValid = usernameStatus === 'available';

  const handleRegister = async () => {
    if (!email || !password || !username) {
      toast({ title: "Missing Fields", description: "Please fill in all details.", variant: "destructive" });
      return;
    }

    if (!isUsernameValid) {
      toast({ title: "Username Error", description: "Please choose a valid and available username.", variant: "destructive" });
      return;
    }

    if (!isPasswordValid) {
      toast({ title: "Weak Password", description: "Password does not meet the security criteria.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // Simulation of OTP process
    setTimeout(() => {
      setStep('OTP');
      setIsLoading(false);
      toast({ title: "Verification Sent", description: "Check your email for the 6-digit code." });
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter a 6-digit code.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        username,
        email,
        balance: 1000, 
        miningRate: 0.4,
        lastMiningTime: new Date().toISOString(),
        referralCode: `SOLAR-${Math.random().toString(36).substring(7).toUpperCase()}`,
        vipStatus: false,
        stakingBalance: 0,
        createdAt: serverTimestamp()
      });

      setStep('SUCCESS');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        username: user.displayName?.split(' ')[0] || 'SolarTrader',
        email: user.email,
        balance: 1000,
        miningRate: 0.4,
        lastMiningTime: new Date().toISOString(),
        referralCode: `SOLAR-${Math.random().toString(36).substring(7).toUpperCase()}`,
        vipStatus: false,
        stakingBalance: 0,
        createdAt: serverTimestamp()
      }, { merge: true });

      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Google Signup Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleWalletConnect = () => {
    toast({ title: "Web3 Integration", description: "Wallet connection feature is in testing phase." });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden cyber-grid">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,102,255,0.05),transparent)] pointer-events-none" />
      
      <div className="p-6">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
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
            <h1 className="text-4xl font-headline font-bold">Join Solar AI</h1>
            <p className="text-muted-foreground mt-2">Start mining and trading with AI intelligence.</p>
          </div>

          <Card className="glass-card border-white/10 shadow-2xl overflow-hidden">
            <CardContent className="pt-8 space-y-4">
              {step === 'INITIAL' && (
                <>
                  <div className="space-y-4">
                    {/* Username Field */}
                    <div className="space-y-1">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          placeholder="Username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          className={`bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary ${
                            usernameStatus === 'taken' ? 'border-destructive' : usernameStatus === 'available' ? 'border-green-500' : ''
                          }`} 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                          {usernameStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {usernameStatus === 'taken' && <XCircle className="w-4 h-4 text-destructive" />}
                        </div>
                      </div>
                      <div className="px-1 h-4">
                        {usernameStatus === 'taken' && <p className="text-[10px] text-destructive">Username already taken</p>}
                        {usernameStatus === 'invalid' && <p className="text-[10px] text-muted-foreground">Min 3 characters, alphanumeric</p>}
                        {usernameStatus === 'available' && <p className="text-[10px] text-green-500">Username is available</p>}
                      </div>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" 
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="Create Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary ${
                            password.length > 0 && !isPasswordValid ? 'border-orange-500' : isPasswordValid ? 'border-green-500' : ''
                          }`} 
                        />
                      </div>
                      
                      {/* Password Criteria Grid */}
                      <div className="grid grid-cols-2 gap-1 px-1">
                        {[
                          { key: 'length', label: '8+ Characters' },
                          { key: 'uppercase', label: 'Uppercase' },
                          { key: 'lowercase', label: 'Lowercase' },
                          { key: 'number', label: 'Number' },
                          { key: 'special', label: 'Special' },
                        ].map((c) => (
                          <div key={c.key} className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${passwordCriteria[c.key as keyof typeof passwordCriteria] ? 'bg-green-500' : 'bg-white/10'}`} />
                            <span className={`text-[9px] ${passwordCriteria[c.key as keyof typeof passwordCriteria] ? 'text-green-500' : 'text-muted-foreground'}`}>
                              {c.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleRegister}
                    disabled={isLoading || !isPasswordValid || !isUsernameValid}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Get Verification Code'}
                  </Button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/5"></span>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Quick Access</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleGoogleSignup} variant="outline" className="border-white/10 hover:bg-white/5 gap-2">
                      <Chrome className="w-4 h-4" />
                      Google
                    </Button>
                    <Button onClick={handleWalletConnect} variant="outline" className="border-white/10 hover:bg-white/5 gap-2">
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </Button>
                  </div>
                </>
              )}

              {step === 'OTP' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="text-center space-y-2">
                    <ShieldCheck className="w-12 h-12 text-secondary mx-auto mb-2" />
                    <h3 className="font-bold">Verify Identity</h3>
                    <p className="text-xs text-muted-foreground">We sent a code to {email}</p>
                  </div>
                  <Input 
                    placeholder="Enter 6-digit OTP" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-2xl tracking-[0.5em] font-bold h-16 bg-white/5 border-white/10"
                  />
                  <Button 
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Verify & Register'}
                  </Button>
                  <Button variant="link" className="w-full text-xs text-muted-foreground" onClick={() => setStep('INITIAL')}>
                    Change registration details
                  </Button>
                </div>
              )}

              {step === 'SUCCESS' && (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-bold">Registration Complete!</h3>
                  <p className="text-muted-foreground">Syncing your neural trading nodes...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
