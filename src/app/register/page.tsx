"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Mail, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(0,102,255,0.05),transparent)] pointer-events-none" />
      
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
            <h1 className="text-4xl font-headline font-bold">Join Solar AI</h1>
            <p className="text-muted-foreground mt-2">Start mining and trading with AI-powered intelligence.</p>
          </div>

          <Card className="glass-card border-white/10 shadow-2xl">
            <CardContent className="pt-8 space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Username" className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Email Address" className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="password" placeholder="Create Password" className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Referral Code (Optional)" className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" />
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold" asChild>
                  <Link href="/dashboard">Create Free Account</Link>
                </Button>
              </div>
              
              <div className="relative py-2">
                <p className="text-[10px] text-center text-muted-foreground px-4">
                  By joining, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
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