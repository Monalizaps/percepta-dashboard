import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Capability, OverviewResponse, SecurityOverview } from '@/types/security';

const API_BASE_URL = import.meta.env.VITE_PERCEPTA_API_URL ?? 'http://localhost:8080/api/v1';
const WS_URL = import.meta.env.VITE_PERCEPTA_WS_URL ?? 'ws://localhost:8080/ws';

const emptyOverview: SecurityOverview = {
  projects: [],
  findings: [],
  metrics: [],
  events: [],
  insights: [],
  updatedAt: new Date().toISOString(),
};

const defaultCapabilities: Capability[] = [
  { name: 'anomaly-detection', description: 'Detecção de comportamento fora do baseline', enabled: false },
  { name: 'forecasting', description: 'Projeção de tendência de risco', enabled: false },
  { name: 'contextual-analysis', description: 'Enriquecimento contextual para insights', enabled: false },
];

type ConnectionStatus = 'connecting' | 'live' | 'polling' | 'offline';

export function useSecurityOverview() {
  const [overview, setOverview] = useState<SecurityOverview>(emptyOverview);
  const [futureCapabilities, setFutureCapabilities] = useState<Capability[]>(defaultCapabilities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdated, setLastUpdated] = useState<string>(emptyOverview.updatedAt);
  const socketRef = useRef<WebSocket | null>(null);

  const applyResponse = useCallback((payload: OverviewResponse) => {
    setOverview(payload.data);
    setFutureCapabilities(payload.futureCapabilities ?? defaultCapabilities);
    setLastUpdated(payload.data.updatedAt);
  }, []);

  const fetchOverview = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setLoading(true);
      }

      const response = await fetch(`${API_BASE_URL}/overview${forceRefresh ? '/refresh' : ''}`, {
        method: forceRefresh ? 'POST' : 'GET',
      });

      if (!response.ok) {
        throw new Error(`API ${response.status}: ${response.statusText}`);
      }

      const payload = (await response.json()) as OverviewResponse;
      applyResponse(payload);
      setConnectionStatus((current) => (current === 'live' ? current : 'polling'));
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Falha ao carregar overview');
      setConnectionStatus('offline');
      applyResponse({ data: emptyOverview, futureCapabilities: defaultCapabilities });
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus('live');
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as { type?: string; payload?: SecurityOverview };
        if (parsed.type === 'snapshot.updated' && parsed.payload) {
          applyResponse({ data: parsed.payload, futureCapabilities });
          setConnectionStatus('live');
        }
      } catch {
        setConnectionStatus('polling');
      }
    };

    socket.onerror = () => {
      setConnectionStatus('polling');
    };

    socket.onclose = () => {
      setConnectionStatus('polling');
    };

    return () => {
      socket.close();
    };
  }, [applyResponse, futureCapabilities]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchOverview();
    }, 45000);

    return () => window.clearInterval(interval);
  }, [fetchOverview]);

  const topProject = useMemo(() => overview.projects[0], [overview.projects]);

  return {
    overview,
    futureCapabilities,
    loading,
    error,
    connectionStatus,
    lastUpdated,
    topProject,
    refresh: () => fetchOverview(true),
  };
}