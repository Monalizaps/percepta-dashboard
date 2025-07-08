
import React, { useState } from 'react';
import { Shield, Search, Filter, Download, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnomalyTable } from '../components/dashboard/AnomalyTable';
import { useAnomalies } from '../hooks/useAnomalies';

export default function Anomalies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const { anomalies, loading, error } = useAnomalies(filters);

  const filteredAnomalies = anomalies.filter(anomaly =>
    anomaly.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anomaly.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anomaly.ip_address.includes(searchTerm)
  );

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,User ID,Timestamp,IP Address,Location,Device,Action,Score,Top Feature,Message\n" +
      filteredAnomalies.map(row => 
        `${row.id},${row.user_id},${row.login_time},${row.ip_address},${row.location},${row.device},${row.action},${row.score},${row.top_feature},${row.message}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "anomalies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Carregando Anomalias</h2>
          <p className="text-muted-foreground">Buscando dados da API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Anomalias Detectadas</h1>
          <p className="text-muted-foreground">
            Visualize e analise todas as anomalias identificadas pelo sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Anomalias</p>
                <p className="text-2xl font-bold">{filteredAnomalies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Alto Risco</p>
                <p className="text-2xl font-bold">
                  {filteredAnomalies.filter(a => a.score > 0.7).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Filtrados</p>
                <p className="text-2xl font-bold">{filteredAnomalies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por User ID, localização ou IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {filteredAnomalies.length} resultados
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <AnomalyTable anomalies={filteredAnomalies} />
    </div>
  );
}
