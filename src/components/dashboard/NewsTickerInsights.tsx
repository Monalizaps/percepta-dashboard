import { AlertTriangle, TrendingUp, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Insight } from '@/types/security';
import './NewsTickerInsights.css';

interface NewsTickerInsightsProps {
  insights: Insight[];
}

export function NewsTickerInsights({ insights }: NewsTickerInsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  // Duplicar insights para criar efeito contínuo
  const tickerInsights = [...insights, ...insights];

  const getIcon = (kind: string) => {
    switch (kind) {
      case 'risk-spike':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-amber-400" />;
      case 'vulnerability':
        return <Shield className="h-4 w-4 text-orange-400" />;
      case 'exposure':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'low':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-border/20 text-muted-foreground border-border/30';
    }
  };

  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)] col-span-full overflow-hidden">
      <CardHeader className="pb-3 sm:pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Percepta News Ticker</p>
        <CardTitle className="text-lg sm:text-xl text-foreground">Insights em Tempo Real</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="news-ticker-container">
          <div className="news-ticker-track">
            {tickerInsights.map((insight, index) => (
              <div
                key={`${insight.id}-${index}`}
                className="news-ticker-item flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-r border-border/30 last:border-r-0 flex items-center gap-3 min-w-max"
              >
                <div className="flex-shrink-0">
                  {getIcon(insight.kind)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {insight.title}
                    </span>
                    <span className={`text-xs font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded border flex-shrink-0 ${getPriorityBadge(insight.priority)}`}>
                      {insight.priority === 'high' ? 'Crítico' : insight.priority === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {insight.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {insight.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
