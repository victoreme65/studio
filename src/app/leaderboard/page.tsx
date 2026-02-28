"use client";

import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, ShieldCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function LeaderboardPage() {
  const db = useFirestore();

  const leaderboardQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('balance', 'desc'), limit(50));
  }, [db]);

  const { data: users, isLoading } = useCollection(leaderboardQuery);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  const topThree = users?.slice(0, 3) || [];
  const restOfUsers = users?.slice(3) || [];

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-headline font-bold">Hall of Fame</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Network Authority Rankings.</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end pb-4">
          {/* Rank 2 */}
          {topThree[1] && (
            <div className="order-2 md:order-1">
              <div className="glass-card p-4 rounded-xl text-center relative pt-8">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-slate-400 bg-card overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={`https://picsum.photos/seed/${topThree[1].id}/200`} />
                    <AvatarFallback>{topThree[1].username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -top-3 left-1/2 translate-x-3 bg-slate-400 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <h3 className="font-bold text-xs mt-1 truncate px-2">{topThree[1].username}</h3>
                <p className="text-lg font-bold text-primary mt-1">{topThree[1].balance.toLocaleString()} S</p>
                <Badge className="mt-2 text-[8px] h-4 bg-secondary text-secondary-foreground border-none">ELITE</Badge>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {topThree[0] && (
            <div className="order-1 md:order-2 scale-105">
              <div className="glass-card p-5 rounded-xl text-center relative pt-10 border-primary/40 bg-primary/5">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-secondary bg-card overflow-hidden animate-glow">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={`https://picsum.photos/seed/${topThree[0].id}/200`} />
                    <AvatarFallback>{topThree[0].username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -top-4 left-1/2 translate-x-4 bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  <Trophy className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold mt-1 truncate px-2">{topThree[0].username}</h3>
                <p className="text-xl font-bold text-primary mt-1">{topThree[0].balance.toLocaleString()} S</p>
                <div className="flex justify-center gap-1 mt-2">
                  <Badge className="text-[8px] h-4 bg-primary text-white border-none">WHALE</Badge>
                  {topThree[0].vipStatus && <Badge className="text-[8px] h-4 bg-secondary text-secondary-foreground border-none">VIP</Badge>}
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {topThree[2] && (
            <div className="order-3">
              <div className="glass-card p-4 rounded-xl text-center relative pt-8">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-orange-700 bg-card overflow-hidden">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={`https://picsum.photos/seed/${topThree[2].id}/200`} />
                    <AvatarFallback>{topThree[2].username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -top-3 left-1/2 translate-x-3 bg-orange-700 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">3</div>
                <h3 className="font-bold text-xs mt-1 truncate px-2">{topThree[2].username}</h3>
                <p className="text-lg font-bold text-primary mt-1">{topThree[2].balance.toLocaleString()} S</p>
                <Badge className="mt-2 text-[8px] h-4 bg-white/10 text-white border-white/5">PRO</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Rest of the list */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {restOfUsers.map((user, i) => (
                <div key={user.id} className="p-2.5 px-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center text-[10px] font-bold text-muted-foreground">{i + 4}</span>
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarImage src={`https://picsum.photos/seed/${user.id}/200`} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold truncate max-w-[100px]">{user.username}</span>
                      {user.vipStatus && <ShieldCheck className="w-3 h-3 text-primary fill-current" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-primary">{user.balance.toLocaleString()} SOLAR</p>
                    <p className="text-[7px] text-muted-foreground uppercase tracking-widest">Rank #{i + 4}</p>
                  </div>
                </div>
              ))}
              {!users?.length && (
                <div className="p-8 text-center text-muted-foreground text-[10px] uppercase tracking-widest">
                  Initializing Ranks...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}