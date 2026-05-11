import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TimelineEvent } from '@/types/security';

interface EventTimelineProps {
  events: TimelineEvent[];
}

function formatRelative(dateString: string) {
  const diffMs = new Date(dateString).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const formatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, 'minute');
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, 'hour');
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, 'day');
}

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Timeline de Eventos</p>
        <CardTitle className="text-xl text-foreground">Eventos Recentes e Movimentos de Risco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-4 rounded-2xl border border-border/70 bg-black/20 p-4">
            <div className={`mt-1 h-3 w-3 rounded-full ${event.type === 'risk' ? 'bg-amber-300' : 'bg-cyan-300'}`} />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-foreground">{event.title}</p>
                <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {event.project}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{formatRelative(event.occurredAt)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
