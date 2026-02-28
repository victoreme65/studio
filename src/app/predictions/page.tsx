"use client";

import React from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BrainCircuit,
  Zap,
  RefreshCcw,
  Target,
  BarChart2,
  Loader2
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export default function PredictionsPage() {
  const db = useFirestore();

  const predsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'predictions_public'), orderBy('timestamp', 'desc'));
  }, [db]);

  const { data: predictions, isLoading } = useCollection(predsQuery);

  const handleRefresh = () => {
    toast({
      title: "Trajectory Analysis",
      description: "Recalculating market vectors...",
    });
  };

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
              Market Predictions
              <BrainCircuit className="w-8 h-8 text-primary" />
            </h1>
            <p className="text-muted-foreground">Autonomous price trajectory and sentiment forecasting.</p>
          </div>
          <Button onClick={handleRefresh} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-full px-6">
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Recalculate
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Processing Neural Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions?.map((pred, i) => (
              <Card key={i} className="glass-card border-white/5 hover:border-primary/20 relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 p-4">
                  <div className={`p-2 rounded-lg ${pred.trend === 'Bullish' || pred.trend === 'UP' ? 'text-green-500 bg-green-500/10' : pred.trend === 'Bearish' || pred.trend === 'DOWN' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground bg-white/5'}`}>
                    {pred.trend === 'Bullish' || pred.trend === 'UP' ? <TrendingUp className="w-5 h-5" /> : pred.trend === 'Bearish' || pred.trend === 'DOWN' ? <TrendingDown className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="w-fit text-[10px] tracking-widest border-white/10 uppercase mb-2">
                      72H Forecast
                    </Badge>
                    <CardTitle className="text-3xl font-headline font-bold">{pred.asset}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex justify-between items-end">
                      <p className="text-sm text-muted-foreground">Target Price</p>
                      <p className="text-2xl font-bold font-mono">${pred.targetPrice?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: `${pred.confidence}%` }} />
                    </div>
                    <p className="text-[10px] text-right text-muted-foreground uppercase tracking-widest">{pred.confidence}% Confidence</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Trend Strength</p>
                        <p className="text-sm font-bold">{pred.trend} Momentum</p>
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-secondary fill-current animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
            {!predictions?.length && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground">Awaiting next AI epoch results.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}