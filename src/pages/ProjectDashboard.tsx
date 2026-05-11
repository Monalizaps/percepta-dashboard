import { AlertTriangle, ArrowLeft, ExternalLink, Gauge, RefreshCw, Siren } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FindingsTable } from '@/components/dashboard/FindingsTable';
import { RiskCard } from '@/components/dashboard/RiskCard';
import { useDashboards } from '@/hooks/useDashboards';
import { useProjectDashboard } from '@/hooks/useProjectDashboard';

function severityColor(score: number) {
  if (score >= 70) return 'danger';
  if (score >= 40) return 'warning';
  return 'positive';
}

export default function ProjectDashboard() {
  const { id = '' } = useParams<{ id: string }>();
  const { dashboards } = useDashboards();
  const dashboard = dashboards.find((d) => d.id === id);

  const { findings, projectRisk, criticals, highs, mediums, loading, error, refresh } =
    useProjectDashboard(id);

  return (
    <SidebarProvider>
      <header className="h-14 flex items-center border-b border-border bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-50">
        <SidebarTrigger className="mr-4" />
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(13,211,255,0.8)]">
            <span className="text-xs font-bold text-white">P</span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Percepta</span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {dashboard?.projectPath ?? 'Project Dashboard'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dashboard?.projectUrl && (
            <a
              href={dashboard.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              GitLab
            </a>
          )}
          <Button variant="outline" size="sm" onClick={() => void refresh()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </header>

      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="space-y-6 p-6">
            {/* Navegação */}
            <Link
              to="/dashboards"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos os dashboards
            </Link>

            {/* Cabeçalho do projeto */}
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300 mb-1">GitLab · {dashboard?.source ?? 'gitlab'}</p>
              <h1 className="text-3xl font-semibold text-foreground flex items-center gap-3">
                {dashboard?.name ?? dashboard?.projectPath ?? 'Projeto'}
                {projectRisk.score > 0 && (
                  <Badge
                    variant="outline"
                    className={
                      projectRisk.score >= 70
                        ? 'border-rose-400/40 text-rose-300'
                        : projectRisk.score >= 40
                        ? 'border-amber-400/40 text-amber-300'
                        : 'border-emerald-400/40 text-emerald-300'
                    }
                  >
                    SRI {projectRisk.score.toFixed(1)}
                  </Badge>
                )}
              </h1>
              {dashboard?.projectPath && (
                <p className="mt-1 text-sm font-mono text-muted-foreground">{dashboard.projectPath}</p>
              )}
            </div>

            {/* Erro de conexão */}
            {error && (
              <Card className="border-destructive/50 bg-destructive/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-semibold text-destructive text-sm">Erro ao carregar findings</p>
                      <p className="text-xs text-muted-foreground mt-1">{error}</p>
                      {error.toLowerCase().includes('403') || error.toLowerCase().includes('forbidden') ? (
                        <p className="text-xs text-amber-400 mt-1">
                          A API de vulnerabilidades do GitLab requer plano Premium/Ultimate ou token com escopo adequado.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Métricas de risco */}
            {loading ? (
              <div className="flex items-center gap-3 text-muted-foreground py-8">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Buscando vulnerabilidades no GitLab...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <RiskCard
                    title="SRI do Projeto"
                    value={projectRisk.score.toFixed(1)}
                    description="Security Risk Index calculado com base nos findings normalizados."
                    icon={Gauge}
                    delta={projectRisk.deltaPercent}
                    tone={severityColor(projectRisk.score)}
                  />
                  <RiskCard
                    title="Críticos"
                    value={String(criticals.length)}
                    description="Vulnerabilidades de severidade crítica encontradas."
                    icon={Siren}
                    tone={criticals.length > 0 ? 'danger' : 'positive'}
                  />
                  <RiskCard
                    title="Altos"
                    value={String(highs.length)}
                    description="Vulnerabilidades de severidade alta encontradas."
                    icon={AlertTriangle}
                    tone={highs.length > 0 ? 'warning' : 'positive'}
                  />
                  <RiskCard
                    title="Médios"
                    value={String(mediums.length)}
                    description="Vulnerabilidades de severidade média encontradas."
                    icon={AlertTriangle}
                    tone="positive"
                  />
                </div>

                {findings.length === 0 && !error ? (
                  <Card className="border-border/70 bg-card/50">
                    <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                      <p className="font-semibold text-foreground">Nenhuma vulnerabilidade encontrada</p>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Isso pode significar que o projeto está limpo, que o GitLab Security Scanning não está
                        habilitado neste projeto, ou que o plano não suporta o endpoint de vulnerabilidades.
                      </p>
                      <a
                        href="https://docs.gitlab.com/ee/user/application_security/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 hover:underline"
                      >
                        Documentação GitLab Security →
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <FindingsTable findings={findings} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
