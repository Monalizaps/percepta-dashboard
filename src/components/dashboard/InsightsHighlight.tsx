import { AlertTriangle, TrendingUp, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Insight } from '@/types/security';

interface InsightsHighlightProps {
  insights: Insight[];
}

export function InsightsHighlight({ insights }: InsightsHighlightProps) {
  if (insights.length === 0) {
    return null;
  }

  // Pegar os 3 principais insights
  const topInsights = insights.slice(0, 3);

  const getIcon = (kind: string) => {
    switch (kind) {
      case 'risk-spike':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-amber-400" />;
      case 'vulnerability':
        return <Shield className="h-5 w-5 text-orange-400" />;
      case 'exposure':
        return <Zap className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/30 bg-red-500/5';
      case 'medium':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'low':
        return 'border-cyan-500/30 bg-cyan-500/5';
      default:
        return 'border-border/70 bg-black/20';
    }
  };

  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)] col-span-full">
      <CardHeader className="pb-3 sm:pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Percepta Insights com IA</p>
        <CardTitle className="text-lg sm:text-xl text-foreground">Principais Recomendações de Segurança</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {topInsights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 space-y-2 transition-all hover:shadow-lg ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="mt-0.5 flex-shrink-0">{getIcon(insight.kind)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-xs sm:text-sm leading-tight">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30 gap-2">
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground truncate">{insight.project}</span>
                <span className={`text-xs font-semibold uppercase tracking-[0.1em] flex-shrink-0 ${
                  insight.priority === 'high' ? 'text-red-400' :
                  insight.priority === 'medium' ? 'text-amber-400' :
                  'text-cyan-400'
                }`}>
                  {insight.priority === 'high' ? 'Crítico' : insight.priority === 'medium' ? 'Médio' : 'Baixo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
