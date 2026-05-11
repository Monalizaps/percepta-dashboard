import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/types/security';
import './StockTicker.css';

interface StockTickerProps {
  projects: Project[];
}

export function StockTicker({ projects }: StockTickerProps) {
  if (projects.length === 0) {
    return null;
  }

  // Duplicar projetos para criar efeito contínuo
  const tickerProjects = [...projects, ...projects];

  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)] col-span-full overflow-hidden">
      <CardHeader className="pb-3 sm:pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Bolsa de Vulnerabilidades</p>
        <CardTitle className="text-lg sm:text-xl text-foreground">Cotações de Risco em Tempo Real</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <div className="stock-ticker-container">
          <div className="stock-ticker-track">
            {tickerProjects.map((project, index) => {
              const isUp = project.deltaPercent > 0;
              const isDown = project.deltaPercent < 0;

              return (
                <div
                  key={`${project.id}-${index}`}
                  className="stock-ticker-item flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-r border-border/30 last:border-r-0 flex items-center gap-3 min-w-max"
                >
                  {/* Símbolo */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <p className="font-mono text-xs sm:text-sm font-bold text-foreground truncate">
                      {project.project.substring(0, 4).toUpperCase()}
                    </p>
                  </div>

                  {/* Preço (SRI) */}
                  <div className="flex-shrink-0 w-16 text-right">
                    <p className="font-mono text-sm sm:text-base font-semibold text-foreground">
                      {project.score.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">SRI</p>
                  </div>

                  {/* Variação */}
                  <div className={`flex-shrink-0 flex items-center gap-1 ${
                    isUp ? 'text-red-400' :
                    isDown ? 'text-emerald-400' :
                    'text-muted-foreground'
                  }`}>
                    <span className="font-mono text-xs sm:text-sm font-semibold">
                      {isUp ? '+' : ''}{project.deltaPercent.toFixed(1)}%
                    </span>
                    {isUp && <TrendingUp className="h-4 w-4" />}
                    {isDown && <TrendingDown className="h-4 w-4" />}
                    {!isUp && !isDown && <div className="h-4 w-4 flex items-center justify-center text-xs">—</div>}
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      isUp ? 'bg-red-400 animate-pulse' :
                      isDown ? 'bg-emerald-400' :
                      'bg-muted-foreground/50'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
