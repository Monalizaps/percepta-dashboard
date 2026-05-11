import { ArrowDownRight, ArrowUpRight, Dot } from 'lucide-react';
import type { ProjectRisk } from '@/types/security';

interface RiskTickerProps {
  projects: ProjectRisk[];
}

export function RiskTicker({ projects }: RiskTickerProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-black/20 px-4 py-3 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
      <div className="flex gap-6 overflow-x-auto whitespace-nowrap pb-1">
        {projects.map((project) => {
          const positiveRisk = project.deltaPercent > 0;
          return (
            <div key={project.project} className="flex items-center gap-3">
              <span className="font-mono text-sm uppercase tracking-[0.22em] text-foreground">{project.project}</span>
              <div className={`flex items-center gap-1 text-sm font-semibold ${positiveRisk ? 'text-rose-300' : project.deltaPercent < 0 ? 'text-emerald-300' : 'text-slate-300'}`}>
                {positiveRisk ? <ArrowUpRight className="h-4 w-4" /> : project.deltaPercent < 0 ? <ArrowDownRight className="h-4 w-4" /> : <Dot className="h-4 w-4" />}
                <span>{positiveRisk ? '+' : ''}{project.deltaPercent.toFixed(1)}%</span>
              </div>
              <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">
                SRI {project.score.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
