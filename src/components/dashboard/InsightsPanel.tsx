import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Capability, Insight } from '@/types/security';

interface InsightsPanelProps {
  insights: Insight[];
  capabilities: Capability[];
}

export function InsightsPanel({ insights, capabilities }: InsightsPanelProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Percepta Insights</p>
          <CardTitle className="text-xl text-foreground">Insights automáticos e comportamento anômalo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="rounded-2xl border border-border/70 bg-black/20 p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-semibold text-foreground">{insight.title}</p>
                <Badge variant="outline" className={insight.priority === 'high' ? 'border-rose-400/40 text-rose-300' : 'border-amber-400/40 text-amber-300'}>
                  {insight.priority}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{insight.description}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{insight.project}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Future Ready</p>
          <CardTitle className="text-xl text-foreground">Capacidades preparadas para IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {capabilities.map((capability) => (
            <div key={capability.name} className="rounded-2xl border border-border/70 bg-black/20 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold text-foreground">{capability.name}</p>
                <Badge variant="outline" className={capability.enabled ? 'border-emerald-400/40 text-emerald-300' : 'border-border/70 text-muted-foreground'}>
                  {capability.enabled ? 'enabled' : 'planned'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{capability.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
