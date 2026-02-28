import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Shield, 
  Zap, 
  Copy, 
  Share2,
  Lock,
  Globe,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your identity, security, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card text-center p-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-full h-full border-2 border-primary">
                  <AvatarImage src="https://picsum.photos/seed/user/200" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-4 border-card flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <h2 className="text-xl font-bold font-headline">John Doe</h2>
              <p className="text-sm text-muted-foreground mb-4">john.doe@example.com</p>
              <Badge className="bg-secondary text-secondary-foreground font-bold">VIP LEVEL 1</Badge>
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                  <p className="font-bold">Jan 2024</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Signals</p>
                  <p className="font-bold">142 Used</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Referral Program
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">Share your code and earn 25% of your friends mining yield.</p>
                <div className="flex gap-2">
                  <Input readOnly value="SOLAR-882X" className="bg-black/40 border-white/10 font-mono text-center h-12" />
                  <Button size="icon" className="h-12 w-12 bg-primary">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">12 Total Referrals</p>
                  <p className="text-xs text-secondary">Earned: 1,245 SOLAR</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Username</Label>
                    <Input defaultValue="SolarExplorer" className="bg-white/5 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <Input defaultValue="john.doe@example.com" disabled className="bg-white/5 border-white/10 opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Trading Region</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="European Union" className="bg-white/5 border-white/10" />
                    <Button variant="outline" className="border-white/10">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button className="bg-primary text-white w-fit mt-4">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <Shield className="w-5 h-5 text-secondary" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Enhanced security for withdrawals</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10">Enable</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-bold">Signal Notifications</p>
                      <p className="text-xs text-muted-foreground">Get alerted for high confidence signals</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10">Configure</Button>
                </div>
                
                <div className="pt-4">
                  <Button variant="link" className="text-destructive p-0 h-auto">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}