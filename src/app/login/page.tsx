"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
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
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Email Address" className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="password" placeholder="Password" className="bg-white/5 border-white/10 h-12 pl-10 focus-visible:ring-primary" />
                </div>
                <div className="text-right">
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
              </div>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold" asChild>
                <Link href="/dashboard">Login to Portal</Link>
              </Button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">Google</Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">Discord</Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}