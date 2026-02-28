import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Star, ShieldCheck } from 'lucide-react';
import { MOCK_LEADERBOARD } from '@/app/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardPage() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold">Solar Hall of Fame</h1>
          <p className="text-muted-foreground">The top miners and traders in the Solar AI ecosystem.</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8">
          {/* Rank 2 */}
          <div className="order-2 md:order-1">
            <div className="glass-card p-6 rounded-2xl text-center relative pt-12">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-silver bg-card overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://picsum.photos/seed/rank2/200" />
                  <AvatarFallback>S2</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -top-4 left-1/2 translate-x-4 bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold font-headline mt-2">{MOCK_LEADERBOARD[1].username}</h3>
              <p className="text-2xl font-bold text-primary mt-2">{MOCK_LEADERBOARD[1].balance.toLocaleString()} SOLAR</p>
              <Badge className="mt-4 bg-secondary text-secondary-foreground">ELITE MINER</Badge>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="order-1 md:order-2 scale-110">
            <div className="glass-card p-8 rounded-2xl text-center relative pt-16 border-primary/40 bg-primary/5">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-secondary bg-card overflow-hidden animate-glow">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://picsum.photos/seed/rank1/200" />
                  <AvatarFallback>S1</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -top-6 left-1/2 translate-x-6 bg-secondary text-secondary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-headline mt-2">{MOCK_LEADERBOARD[0].username}</h3>
              <p className="text-3xl font-bold text-primary mt-2">{MOCK_LEADERBOARD[0].balance.toLocaleString()} SOLAR</p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge className="bg-primary text-white">ULTIMATE WHALE</Badge>
                <Badge className="bg-secondary text-secondary-foreground">VIP GOLD</Badge>
              </div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3">
            <div className="glass-card p-6 rounded-2xl text-center relative pt-12">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-bronze bg-card overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src="https://picsum.photos/seed/rank3/200" />
                  <AvatarFallback>S3</AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -top-4 left-1/2 translate-x-4 bg-orange-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="font-bold font-headline mt-2">{MOCK_LEADERBOARD[2].username}</h3>
              <p className="text-2xl font-bold text-primary mt-2">{MOCK_LEADERBOARD[2].balance.toLocaleString()} SOLAR</p>
              <Badge className="mt-4 bg-white/10 text-white border-white/5">PRO MINER</Badge>
            </div>
          </div>
        </div>

        {/* Rest of the list */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {MOCK_LEADERBOARD.map((user, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 1}</span>
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarImage src={`https://picsum.photos/seed/${user.username}/200`} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{user.username}</span>
                      {user.vip && <ShieldCheck className="w-4 h-4 text-primary fill-current" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-primary">{user.balance.toLocaleString()} SOLAR</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Global Rank #{i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}