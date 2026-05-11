import { AlertTriangle, FolderGit2, Gauge, Globe, Layers3, RefreshCw, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventTimeline } from '../components/dashboard/EventTimeline';
import { FindingsTable } from '../components/dashboard/FindingsTable';
import { HeatmapGrid } from '../components/dashboard/HeatmapGrid';
import { InsightsPanel } from '../components/dashboard/InsightsPanel';
import { RealtimeStatus } from '../components/dashboard/RealtimeStatus';
import { RiskCard } from '../components/dashboard/RiskCard';
import { RiskChart } from '../components/dashboard/RiskChart';
import { RiskTicker } from '../components/dashboard/RiskTicker';
import { useSecurityOverview } from '../hooks/useSecurityOverview';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  initialTab?: 'overview' | 'findings' | 'metrics' | 'insights';
}

export default function Dashboard({ initialTab = 'overview' }: DashboardProps) {
  const { overview, futureCapabilities, loading, error, refresh, connectionStatus, lastUpdated, topProject } = useSecurityOverview();
  const { toast } = useToast();

  const stats = {
    assets: overview.projects.length,
    criticalExposure: overview.projects.filter((project) => project.internetFacing && project.score >= 70).length,
    findings: overview.findings.length,
    averageRisk: overview.projects.length > 0
      ? overview.projects.reduce((accumulator, project) => accumulator + project.score, 0) / overview.projects.length
      : 0,
  };

  const handleRefresh = async () => {
    toast({
      title: 'Atualizando dados...',
      description: 'Recalculando SRI, normalizando findings e sincronizando conectores.',
    });
    await refresh();
    toast({
      title: 'Dados atualizados!',
      description: `${overview.projects.length.toLocaleString()} ativos recalculados com sucesso.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Carregando Security Intelligence Layer</h2>
          <p className="text-muted-foreground">Sincronizando overview, findings e telemetria em tempo real...</p>
        </div>
      </div>
    );
  }

  if (!loading && overview.projects.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300">Security Intelligence Layer</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Cockpit de risco desacoplado de ferramenta, com leitura multi-fonte e foco em tendência.
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border/70 bg-black/20 p-16 text-center">
          <FolderGit2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Nenhum projeto conectado</h2>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            Adicione um dashboard com a URL do seu projeto GitLab e o token de acesso para começar a monitorar vulnerabilidades.
          </p>
          <Link
            to="/dashboards"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FolderGit2 className="h-4 w-4" />
            Adicionar projeto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-cyan-300">Security Intelligence Layer</p>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Cockpit de risco desacoplado de ferramenta, com leitura multi-fonte e foco em tendência.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            O Percepta opera acima de GitLab, security dashboards internos, PostgreSQL, APIs externas e AppSec tools, normalizando tudo para um modelo interno único.
          </p>
          <div className="mt-6">
            <RiskTicker projects={overview.projects} />
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-3xl border border-border/70 bg-black/20 p-5 backdrop-blur-sm">
          <RealtimeStatus status={connectionStatus} lastUpdated={lastUpdated} />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Maior pressão de risco</p>
            <p className="mt-2 font-mono text-3xl uppercase tracking-[0.18em] text-foreground">{topProject?.project ?? 'N/A'}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              SRI {topProject?.score.toFixed(1) ?? '0.0'} com variação de {topProject?.deltaPercent.toFixed(1) ?? '0.0'}%.
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2 border-border/70 bg-background/50">
            <RefreshCw className="h-4 w-4" />
            Atualizar Snapshot
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Erro de Conexão</h3>
                <p className="text-sm text-muted-foreground">
                  {error} — Verifique se o servidor está rodando em localhost:9090.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskCard
          title="Ativos Monitorados"
          value={stats.assets.toLocaleString()}
          description="Projetos agregados de múltiplas fontes no mesmo schema interno."
          icon={Layers3}
        />
        <RiskCard
          title="Exposure Hotspots"
          value={stats.criticalExposure.toLocaleString()}
          description="Ativos internet-facing com SRI acima de 70."
          icon={Globe}
          tone="danger"
        />
        <RiskCard
          title="Findings Normalizados"
          value={stats.findings.toLocaleString()}
          description="Itens consolidados e independentes do schema de origem."
          icon={Siren}
          tone="warning"
        />
        <RiskCard
          title="SRI Médio"
          value={stats.averageRisk.toFixed(1)}
          description="Índice médio de risco calculado em tempo real."
          icon={Gauge}
          delta={topProject?.deltaPercent}
          tone={stats.averageRisk >= 70 ? 'danger' : stats.averageRisk >= 50 ? 'warning' : 'positive'}
        />
      </div>

      <Tabs defaultValue={initialTab} className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-black/20 p-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
          <TabsTrigger value="findings" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Findings</TabsTrigger>
          <TabsTrigger value="metrics" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Metrics</TabsTrigger>
          <TabsTrigger value="insights" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Percepta Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <RiskChart projects={overview.projects} />
            <EventTimeline events={overview.events.slice(0, 4)} />
          </div>
        </TabsContent>

        <TabsContent value="findings">
          <FindingsTable findings={overview.findings} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <HeatmapGrid projects={overview.projects} />
            <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
              <CardContent className="flex h-full flex-col justify-center gap-4 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Realtime Pipeline</p>
                <h3 className="text-2xl font-semibold text-foreground">Novo finding → normalização → recalcular score → snapshot → websocket</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  A camada de métricas foi preparada para Redis Streams, snapshots temporais e atualização automática no frontend sem acoplamento ao sistema de origem.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Top Trend</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{topProject?.project ?? 'N/A'}</p>
                    <p className="text-sm text-rose-300">{topProject?.deltaPercent.toFixed(1) ?? '0.0'}% no período</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Risk Direction</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{overview.projects.filter((project) => project.trend === 'up').length} ativos em alta</p>
                    <p className="text-sm text-muted-foreground">{overview.projects.length} ativos agregados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsPanel insights={overview.insights} capabilities={futureCapabilities} />
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <EventTimeline events={overview.events} />
            <RiskChart projects={[...overview.projects].sort((left, right) => right.deltaPercent - left.deltaPercent)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
