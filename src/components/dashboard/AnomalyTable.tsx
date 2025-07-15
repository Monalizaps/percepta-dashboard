import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Download, Search } from 'lucide-react';
import { Anomaly } from '../../types/anomaly';

interface AnomalyTableProps {
  anomalies: Anomaly[];
}

type SortField = keyof Anomaly;
type SortDirection = 'asc' | 'desc';

export const AnomalyTable: React.FC<AnomalyTableProps> = ({ anomalies }) => {
  const [sortField, setSortField] = useState<SortField>('timestamp'); // timestamp agora
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedAnomalies = useMemo(() => {
    let filtered = anomalies.filter(anomaly =>
      Object.values(anomaly).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Date sorting
      if (sortField === 'timestamp') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String sorting
      const aStr = aValue?.toString().toLowerCase() ?? '';
      const bStr = bValue?.toString().toLowerCase() ?? '';
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [anomalies, searchTerm, sortField, sortDirection]);

  const paginatedAnomalies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedAnomalies.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedAnomalies, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedAnomalies.length / itemsPerPage);

  const exportToCsv = () => {
    const headers = ['User ID', 'Timestamp', 'IP Address', 'Location', 'Device', 'Action', 'Score', 'Top Feature', 'Message'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedAnomalies.map(anomaly => [
        anomaly.user_id,
        new Date(anomaly.timestamp).toLocaleString('pt-BR'),
        anomaly.ip_address,
        `"${anomaly.location}"`,
        `"${anomaly.device}"`,
        anomaly.action,
        anomaly.score.toFixed(2),
        `"${anomaly.top_feature}"`,
        `"${anomaly.message}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `anomalies_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getSeverityBadge = (score: number) => {
    if (score > 0.7) {
      return <Badge variant="destructive">Alto Risco</Badge>;
    } else if (score > 0.4) {
      return <Badge className="bg-yellow-600 text-black">Médio Risco</Badge>; // cor custom
    } else {
      return <Badge variant="outline">Baixo Risco</Badge>;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-foreground">Anomalias Detectadas</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar anomalias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button onClick={exportToCsv} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('user_id')}
                >
                  <div className="flex items-center gap-1">
                    User ID <SortIcon field="user_id" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    Timestamp <SortIcon field="timestamp" />
                  </div>
                </TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('action')}
                >
                  <div className="flex items-center gap-1">
                    Action <SortIcon field="action" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center gap-1">
                    Score <SortIcon field="score" />
                  </div>
                </TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Top Feature</TableHead>
                <TableHead>Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnomalies.map((anomaly) => (
                <TableRow
                  key={`${anomaly.user_id}-${anomaly.timestamp}`}
                  className="hover:bg-muted/30"
                >
                  <TableCell className="font-medium">{anomaly.user_id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {new Date(anomaly.timestamp).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{anomaly.ip_address}</TableCell>
                  <TableCell>{anomaly.location}</TableCell>
                  <TableCell className="text-sm">{anomaly.device}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{anomaly.action}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
  {Number(anomaly.score)?.toFixed(2) ?? 'N/A'}
</TableCell>
                  <TableCell>{getSeverityBadge(anomaly.score)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{anomaly.top_feature}</TableCell>
                  <TableCell className="text-sm">{anomaly.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredAndSortedAnomalies.length)} de {filteredAndSortedAnomalies.length} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(current => Math.max(1, current - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(current => Math.min(totalPages, current + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
