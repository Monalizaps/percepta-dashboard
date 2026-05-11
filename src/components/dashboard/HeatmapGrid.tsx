import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectRisk } from '@/types/security';

interface HeatmapGridProps {
  projects: ProjectRisk[];
}

function getHeatColor(score: number) {
  if (score >= 80) return 'bg-rose-500/75';
  if (score >= 60) return 'bg-amber-400/75';
  if (score >= 35) return 'bg-cyan-400/60';
  return 'bg-emerald-400/55';
}

export function HeatmapGrid({ projects }: HeatmapGridProps) {
  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Risk Heatmap</p>
        <CardTitle className="text-xl text-foreground">Concentração de risco por ativo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project) => (
            <div key={project.project} className="rounded-2xl border border-border/70 bg-background/40 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.2em] text-foreground">{project.project}</p>
                  <p className="text-xs text-muted-foreground">{project.source}</p>
                </div>
                <div className={`h-4 w-4 rounded-full ${getHeatColor(project.score)}`} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-black/20 p-3 text-center">
                  <div className="text-lg font-semibold text-rose-300">{project.criticals}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Critical</div>
                </div>
                <div className="rounded-xl bg-black/20 p-3 text-center">
                  <div className="text-lg font-semibold text-amber-300">{project.highs}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">High</div>
                </div>
                <div className="rounded-xl bg-black/20 p-3 text-center">
                  <div className="text-lg font-semibold text-cyan-300">{project.mediums}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Medium</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
