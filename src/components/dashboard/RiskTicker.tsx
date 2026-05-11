import { ArrowDownRight, ArrowUpRight, Dot } from 'lucide-react';
import type { ProjectRisk } from '@/types/security';
import './RiskTicker.css';

interface RiskTickerProps {
  projects: ProjectRisk[];
}

export function RiskTicker({ projects }: RiskTickerProps) {
  // Duplicar projetos para criar efeito contínuo
  const tickerProjects = [...projects, ...projects];

  return (
    <div className="risk-ticker-wrapper overflow-hidden rounded-2xl border border-border/70 bg-black/20 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
      <div className="risk-ticker-container">
        <div className="risk-ticker-track">
          {tickerProjects.map((project, index) => {
            const positiveRisk = project.deltaPercent > 0;
            return (
              <div key={`${project.project}-${index}`} className="risk-ticker-item flex items-center gap-3 px-4 py-3">
                <span className="font-mono text-sm uppercase tracking-[0.22em] text-foreground whitespace-nowrap">{project.project}</span>
                <div className={`flex items-center gap-1 text-sm font-semibold whitespace-nowrap ${positiveRisk ? 'text-rose-300' : project.deltaPercent < 0 ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {positiveRisk ? <ArrowUpRight className="h-4 w-4" /> : project.deltaPercent < 0 ? <ArrowDownRight className="h-4 w-4" /> : <Dot className="h-4 w-4" />}
                  <span>{positiveRisk ? '+' : ''}{project.deltaPercent.toFixed(1)}%</span>
                </div>
                <span className="rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground whitespace-nowrap">
                  SRI {project.score.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
