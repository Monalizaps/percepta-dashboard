import { useCallback, useEffect, useState } from 'react';
import type { ProjectDashboardFindings, ProjectDashboardResponse } from '@/types/dashboard';
import type { SecurityFinding } from '@/types/security';

const API_BASE = import.meta.env.VITE_PERCEPTA_API_URL ?? 'http://localhost:8080/api/v1';

const emptyFindings: ProjectDashboardFindings = {
  findings: [],
  projectRisk: {
    project: '',
    source: 'gitlab',
    score: 0,
    deltaPercent: 0,
    trend: 'flat',
    criticals: 0,
    highs: 0,
    mediums: 0,
    internetFacing: false,
    updatedAt: new Date().toISOString(),
  },
};

export function useProjectDashboard(dashboardId: string) {
  const [data, setData] = useState<ProjectDashboardFindings>(emptyFindings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    if (!dashboardId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/dashboards/${dashboardId}/findings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as ProjectDashboardResponse;
      setData(body.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar findings');
    } finally {
      setLoading(false);
    }
  }, [dashboardId]);

  useEffect(() => {
    void fetch_();
  }, [fetch_]);

  const bySeverity = (severity: string) =>
    data.findings.filter((f: SecurityFinding) => f.severity.toLowerCase() === severity);

  return {
    findings: data.findings,
    projectRisk: data.projectRisk,
    criticals: bySeverity('critical'),
    highs: bySeverity('high'),
    mediums: bySeverity('medium'),
    loading,
    error,
    refresh: fetch_,
  };
}
