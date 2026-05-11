import { ArrowDownRight, ArrowUpRight, LucideIcon, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  delta?: number;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger';
}

const toneClasses = {
  neutral: 'from-card/95 via-card/80 to-card/60 border-border/70',
  positive: 'from-emerald-500/10 via-card/90 to-card/70 border-emerald-400/20',
  warning: 'from-amber-500/10 via-card/90 to-card/70 border-amber-400/20',
  danger: 'from-rose-500/10 via-card/90 to-card/70 border-rose-400/20',
};

export function RiskCard({ title, value, description, icon: Icon, delta, tone = 'neutral' }: RiskCardProps) {
  const DeltaIcon = delta === undefined ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={`overflow-hidden border bg-gradient-to-br ${toneClasses[tone]} shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
          <CardTitle className="mt-2 text-3xl font-semibold text-foreground">{value}</CardTitle>
        </div>
        <div className="rounded-full border border-border/70 bg-background/60 p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        {delta !== undefined && (
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${delta > 0 ? 'bg-rose-500/10 text-rose-300' : delta < 0 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-muted text-muted-foreground'}`}>
            <DeltaIcon className="h-3.5 w-3.5" />
            {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
