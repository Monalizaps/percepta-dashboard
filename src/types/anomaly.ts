export interface Anomaly {
  id?: string;           // Opcional, pois pode vir do banco (anomalous_logs.id)
  user_id: string;
  timestamp: string;     // Data/hora do evento
  ip_address?: string;   // Opcional, pois você filtra e exibe
  action?: string;       // Opcional (ex: "login")
  location?: string;     // Opcional (ex: cidade, país)
  device?: string;       // Opcional (ex: "Chrome on Windows")
  score: number;
  top_feature: string;
  message: string;
  is_anomaly?: boolean;  // Opcional, pois o backend usa label (bool(label))
}

export interface AnomalyFilters {
  user_id?: string;
  location?: string;
  start_date?: string;  // ISO string, ex: "2025-07-08T00:00:00Z"
  end_date?: string;
  status?: 'anomaly' | 'success' | 'all';  // 'success' para "normal"
}

export interface AnomalyStats {
  total: number;
  recent: number;
  high_risk: number;
  locations: number;
}
