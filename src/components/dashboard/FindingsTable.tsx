import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SecurityFinding } from '@/types/security';

interface FindingsTableProps {
  findings: SecurityFinding[];
}

function severityTone(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'border-rose-400/40 text-rose-300';
    case 'high':
      return 'border-amber-400/40 text-amber-300';
    case 'medium':
      return 'border-cyan-400/40 text-cyan-300';
    default:
      return 'border-border/70 text-muted-foreground';
  }
}

function translateSeverity(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'Crítica';
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Média';
    case 'low':
      return 'Baixa';
    default:
      return severity;
  }
}

function translateStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'open':
      return 'Aberta';
    case 'closed':
      return 'Fechada';
    case 'detected':
      return 'Detectada';
    default:
      return status;
  }
}

export function FindingsTable({ findings }: FindingsTableProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return findings;
    }

    return findings.filter((finding) =>
      [finding.project, finding.source, finding.title, finding.severity, finding.status]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [findings, query]);

  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
      <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Vulnerabilidades Normalizadas</p>
          <CardTitle className="text-xl text-foreground">Todos os findings consolidados de múltiplas fontes</CardTitle>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar projeto, severidade ou fonte" className="border-border/70 bg-background/50 pl-10" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Projeto</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Exposição</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((finding) => (
                <TableRow key={finding.id} className="border-border/60 hover:bg-white/5">
                  <TableCell className="font-mono uppercase tracking-[0.16em] text-foreground">{finding.project}</TableCell>
                  <TableCell className="text-sm">{finding.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={severityTone(finding.severity)}>
                      {translateSeverity(finding.severity)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 max-w-xs">
                      <p className="font-medium text-foreground text-sm">{finding.title}</p>
                      <p className="text-xs text-muted-foreground">{finding.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{translateStatus(finding.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{finding.exposure}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(finding.createdAt).toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}