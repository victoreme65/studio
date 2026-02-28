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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const handleRegister = async () => {
    if (!email || !password || !username) return;
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
        referralCode: `SOLAR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        vipStatus: false,
        stakingBalance: 0,
        createdAt: serverTimestamp()
      });

      toast({ title: "Account Created", description: "Welcome to Solar AI." });
      router.push('/dashboard');
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
        username: user.displayName?.split(' ')[0] || 'Trader',
        email: user.email,
        balance: 1000,
        miningRate: 0.4,
        lastMiningTime: new Date().toISOString(),
        referralCode: `SOLAR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        vipStatus: false,
        stakingBalance: 0,
        createdAt: serverTimestamp()
      }, { merge: true });

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
            <CardContent className="pt-8 space-y-4">
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
              </div>

              <Button 
                onClick={handleRegister}
                disabled={isLoading || usernameStatus !== 'available' || password.length < 8}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
              </Button>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button onClick={handleGoogleSignup} variant="outline" className="border-white/10 hover:bg-white/5 gap-2">
                  <Chrome className="w-4 h-4" /> Google
                </Button>
                <Button onClick={() => toast({ title: "Wallet Integration", description: "MetaMask required." })} variant="outline" className="border-white/10 hover:bg-white/5 gap-2">
                  <Wallet className="w-4 h-4" /> Wallet
                </Button>
              </div>
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