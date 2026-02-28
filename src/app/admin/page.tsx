"use client";

import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Search,
  Settings,
  MoreVertical
} from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_SIGNALS } from '@/app/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminPage() {
  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" />
              Admin Command Center
            </h1>
            <p className="text-muted-foreground">Manage Solar AI ecosystem, users, and content.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Users', value: '124,500', sub: '+12% this week', icon: Users },
            { label: 'Total Revenue', value: '$45,210', sub: 'VIP Sales', icon: Zap },
            { label: 'System Health', value: '99.9%', sub: 'All nodes online', icon: ShieldCheck },
          ].map((stat, i) => (
            <Card key={i} className="glass-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold font-headline">{stat.value}</h3>
                  <p className="text-xs text-green-500 mt-0.5">{stat.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-primary">Users</TabsTrigger>
            <TabsTrigger value="signals" className="rounded-lg data-[state=active]:bg-primary">Signals</TabsTrigger>
            <TabsTrigger value="predictions" className="rounded-lg data-[state=active]:bg-primary">Predictions</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-lg data-[state=active]:bg-primary">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">User Management</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search users by email or username..." className="pl-10 bg-white/5 border-white/10" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_LEADERBOARD.map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://picsum.photos/seed/${user.username}/200`} />
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.username.toLowerCase()}@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold">{user.balance.toLocaleString()} SOLAR</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{user.vip ? 'VIP Member' : 'Standard'}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signals">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Active Trading Signals</CardTitle>
                <Button size="sm" className="bg-primary">Add Signal</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_SIGNALS.map((signal, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${signal.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                          {signal.type === 'BUY' ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                        </div>
                        <div>
                          <p className="font-bold">{signal.pair}</p>
                          <p className="text-xs text-muted-foreground">{signal.confidence}% Confidence</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-primary">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Security & System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-[10px] sm:text-xs text-muted-foreground">
                  {[
                    '[2024-05-20 14:32:01] SECURITY: User SolarKing modified balance (+45 SOLAR - Mining Reward)',
                    '[2024-05-20 14:30:45] SYSTEM: AI Signal generated for BTC/USDT (Confidence 88%)',
                    '[2024-05-20 14:28:12] AUTH: New registration from IP 192.168.1.45 (Referrer: SolarKing)',
                    '[2024-05-20 14:25:00] SYSTEM: Daily node synchronization complete.',
                    '[2024-05-20 14:22:18] WARNING: High server load detected on Mining-Node-04',
                  ].map((log, i) => (
                    <div key={i} className={`p-2 rounded border-l-2 ${log.includes('WARNING') ? 'border-secondary bg-secondary/5' : log.includes('SECURITY') ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'}`}>
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}