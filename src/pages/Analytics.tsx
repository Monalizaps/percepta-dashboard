
import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnomalyChart } from '../components/dashboard/AnomalyChart';
import { useAnomalies } from '../hooks/useAnomalies';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const { anomalies, loading } = useAnomalies({});

  const timeRangeOptions = [
    { value: '24h', label: '24 Horas' },
    { value: '7d', label: '7 Dias' },
    { value: '30d', label: '30 Dias' },
    { value: '90d', label: '90 Dias' },
  ];

  const getAnalytics = () => {
    const now = new Date();
    const timeRangeMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    };

    const rangeMs = timeRangeMs[timeRange as keyof typeof timeRangeMs];
    const filteredAnomalies = anomalies.filter(anomaly => 
      new Date(anomaly.login_time).getTime() > now.getTime() - rangeMs
    );

    const locationStats = filteredAnomalies.reduce((acc, anomaly) => {
      acc[anomaly.location] = (acc[anomaly.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceStats = filteredAnomalies.reduce((acc, anomaly) => {
      acc[anomaly.device] = (acc[anomaly.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskDistribution = {
      baixo: filteredAnomalies.filter(a => a.score <= 0.3).length,
      medio: filteredAnomalies.filter(a => a.score > 0.3 && a.score <= 0.7).length,
      alto: filteredAnomalies.filter(a => a.score > 0.7).length,
    };

    return {
      total: filteredAnomalies.length,
      locations: Object.keys(locationStats).length,
      topLocation: Object.entries(locationStats).sort(([,a], [,b]) => b - a)[0] || ['N/A', 0],
      riskDistribution,
      averageScore: filteredAnomalies.length > 0 
        ? filteredAnomalies.reduce((acc, a) => acc + a.score, 0) / filteredAnomalies.length 
        : 0,
    };
  };

  const analytics = getAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Carregando Análises</h2>
          <p className="text-muted-foreground">Processando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Análises Avançadas</h1>
          <p className="text-muted-foreground">
            Insights detalhados sobre padrões de anomalias detectadas
          </p>
        </div>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeRange === option.value ? "default" : "outline"}
              onClick={() => setTimeRange(option.value)}
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Período</p>
                <p className="text-2xl font-bold">{analytics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">{analytics.averageScore.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Localizações</p>
                <p className="text-2xl font-bold">{analytics.locations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Top Localização</p>
                <p className="text-lg font-bold">{analytics.topLocation[0]}</p>
                <p className="text-xs text-muted-foreground">{analytics.topLocation[1]} ocorrências</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{analytics.riskDistribution.baixo}</div>
              <div className="text-sm text-muted-foreground">Baixo Risco</div>
              <div className="text-xs text-muted-foreground">Score ≤ 0.3</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{analytics.riskDistribution.medio}</div>
              <div className="text-sm text-muted-foreground">Médio Risco</div>
              <div className="text-xs text-muted-foreground">0.3 < Score ≤ 0.7</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{analytics.riskDistribution.alto}</div>
              <div className="text-sm text-muted-foreground">Alto Risco</div>
              <div className="text-xs text-muted-foreground">Score > 0.7</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnomalyChart anomalies={anomalies} type="line" />
        <AnomalyChart anomalies={anomalies} type="bar" />
      </div>
    </div>
  );
}
