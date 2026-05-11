import { useCallback, useEffect, useState } from 'react';
import type { CreateDashboardPayload, Dashboard, DashboardListResponse } from '@/types/dashboard';

const API_BASE = import.meta.env.VITE_PERCEPTA_API_URL ?? 'http://localhost:8080/api/v1';

export function useDashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/dashboards`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as DashboardListResponse;
      setDashboards(body.data ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const create = useCallback(
    async (payload: CreateDashboardPayload): Promise<Dashboard> => {
      const res = await fetch(`${API_BASE}/dashboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const body = (await res.json()) as { data: Dashboard };
      const dashboard = body.data;
      setDashboards((prev) => [...prev, dashboard]);
      return dashboard;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/dashboards/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
    setDashboards((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { dashboards, loading, error, create, remove, refresh: fetchList };
}
