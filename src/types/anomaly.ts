
export interface Anomaly {
  id: string;
  user_id: string;
  login_time: string;
  ip_address: string;
  action: string;
  location: string;
  device: string;
  score: number;
  top_feature: string;
  message: string;
}

export interface AnomalyFilters {
  user_id?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status?: 'anomaly' | 'success' | 'all';
}

export interface AnomalyStats {
  total: number;
  recent: number;
  high_risk: number;
  locations: number;
}
