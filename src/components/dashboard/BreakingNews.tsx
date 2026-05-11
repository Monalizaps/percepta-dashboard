import { AlertTriangle, Bell, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Insight } from '@/types/security';

interface BreakingNewsProps {
  insights: Insight[];
}

export function BreakingNews({ insights }: BreakingNewsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const criticalInsights = insights.filter(i => i.priority === 'high').slice(0, 5);

  useEffect(() => {
    if (criticalInsights.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % criticalInsights.length);
    }, 8000); // Trocar a cada 8 segundos

    return () => clearInterval(interval);
  }, [criticalInsights.length]);

  if (criticalInsights.length === 0 || !isVisible) {
    return null;
  }

  const current = criticalInsights[currentIndex];

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(239,68,68,0.5)] p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500/20 border border-red-500/40">
              <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] font-semibold text-red-300">
                🔴 Últimas Atualizações
              </span>
              <span className="text-xs text-red-300/70">
                {currentIndex + 1} de {criticalInsights.length}
              </span>
            </div>
            <h3 className="mt-1 font-semibold text-foreground text-sm leading-tight">
              {current.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {current.description}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground/70">
                {current.project}
              </span>
              <span className="text-xs font-mono text-red-300">
                Crítico
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-red-500/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-pulse"
            style={{
              animation: 'progress 8s linear infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
