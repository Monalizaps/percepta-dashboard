
import React, { useState } from 'react';
import { Activity, Shield, AlertTriangle, MapPin, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { AnomalyChart } from '../components/dashboard/AnomalyChart';
import { AnomalyTable } from '../components/dashboard/AnomalyTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnomalies } from '../hooks/useAnomalies';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const { anomalies, stats, loading, error, refetch } = useAnomalies(filters);
  const { toast } = useToast();

  const handleRefresh = async () => {
    toast({
      title: "Atualizando dados...",
      description: "Buscando anomalias mais recentes da API Percepta.",
    });
    await refetch();
    toast({
      title: "Dados atualizados!",
      description: `${stats.total} anomalias carregadas com sucesso.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Carregando Dashboard</h2>
          <p className="text-muted-foreground">Conectando à API Percepta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Dashboard de Anomalias</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real de anomalias detectadas pelo sistema Percepta
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Atualizar Dados
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold text-destructive">Erro de Conexão</h3>
                <p className="text-sm text-muted-foreground">
                  {error} - Exibindo dados de demonstração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Anomalias"
          value={stats.total.toLocaleString()}
          description="Detectadas no sistema"
          icon={Shield}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Anomalias Recentes"
          value={stats.recent}
          description="Últimas 24 horas"
          icon={Activity}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Alto Risco"
          value={stats.high_risk}
          description="Score > 0.7"
          icon={AlertTriangle}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Localizações"
          value={stats.locations}
          description="Diferentes origens"
          icon={MapPin}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyChart anomalies={anomalies} type="line" />
        <AnomalyChart anomalies={anomalies} type="bar" />
      </div>

      {/* Table */}
      <AnomalyTable anomalies={anomalies} />
    </div>
  );
}
