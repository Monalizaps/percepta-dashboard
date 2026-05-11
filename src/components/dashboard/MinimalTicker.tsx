import { TrendingDown, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { Project } from '@/types/security';
import './MinimalTicker.css';

interface MinimalTickerProps {
  projects: Project[];
}

export function MinimalTicker({ projects }: MinimalTickerProps) {
  if (projects.length === 0) {
    return null;
  }

  // Duplicar projetos para criar efeito contínuo
  const tickerProjects = [...projects, ...projects];

  // Gerar dados históricos simulados para cada projeto
  const generateMiniData = (project: Project) => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      const variance = (Math.random() - 0.5) * 15;
      const score = Math.max(0, Math.min(100, project.score + variance * (i / 6)));
      data.push({ value: parseFloat(score.toFixed(1)) });
    }
    return data;
  };

  return (
    <div className="minimal-ticker-wrapper bg-gradient-to-r from-background via-background/80 to-background border-b border-border/40 sticky top-14 z-40">
      <div className="minimal-ticker-container">
        <div className="minimal-ticker-track">
          {tickerProjects.map((project, index) => {
            const isUp = project.deltaPercent > 0;
            const isDown = project.deltaPercent < 0;
            const miniData = generateMiniData(project);

            return (
              <div
                key={`${project.id}-${index}`}
                className="minimal-ticker-item"
              >
                {/* Símbolo e valor */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <span className="font-mono text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">
                    {project.project.substring(0, 3).toUpperCase()}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-cyan-400 whitespace-nowrap">
                    {project.score.toFixed(1)}
                  </span>
                </div>

                {/* Mini gráfico - escondido em mobile */}
                <div className="hidden sm:block w-12 sm:w-16 h-5 sm:h-6 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isUp ? '#f87171' : isDown ? '#34d399' : '#06b6d4'}
                        dot={false}
                        strokeWidth={1.5}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Variação */}
                <div className={`flex items-center gap-0.5 flex-shrink-0 ${
                  isUp ? 'text-red-400' :
                  isDown ? 'text-emerald-400' :
                  'text-muted-foreground'
                }`}>
                  <span className="font-mono text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {isUp ? '+' : ''}{project.deltaPercent.toFixed(1)}%
                  </span>
                  {isUp && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                  {isDown && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
