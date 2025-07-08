
import { useState, useEffect, useCallback } from 'react';
import { Anomaly, AnomalyFilters, AnomalyStats } from '../types/anomaly';

const API_BASE_URL = 'http://localhost:8000';

export const useAnomalies = (filters: AnomalyFilters = {}) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [stats, setStats] = useState<AnomalyStats>({
    total: 0,
    recent: 0,
    high_risk: 0,
    locations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnomalies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching anomalies from API...');
      const response = await fetch(`${API_BASE_URL}/anomalies`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data: Anomaly[] = await response.json();
      console.log('Anomalies fetched successfully:', data.length, 'items');
      
      // Apply filters
      let filteredData = data;
      
      if (filters.user_id) {
        filteredData = filteredData.filter(a => 
          a.user_id.toLowerCase().includes(filters.user_id!.toLowerCase())
        );
      }
      
      if (filters.location) {
        filteredData = filteredData.filter(a => 
          a.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.start_date) {
        filteredData = filteredData.filter(a => 
          new Date(a.login_time) >= new Date(filters.start_date!)
        );
      }
      
      if (filters.end_date) {
        filteredData = filteredData.filter(a => 
          new Date(a.login_time) <= new Date(filters.end_date!)
        );
      }
      
      if (filters.status && filters.status !== 'all') {
        filteredData = filteredData.filter(a => {
          if (filters.status === 'anomaly') {
            return a.score > 0.5; // High risk threshold
          } else {
            return a.score <= 0.5; // Low risk/success
          }
        });
      }
      
      setAnomalies(filteredData);
      
      // Calculate stats
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recent = data.filter(a => new Date(a.login_time) >= oneDayAgo).length;
      const highRisk = data.filter(a => a.score > 0.7).length;
      const uniqueLocations = new Set(data.map(a => a.location)).size;
      
      setStats({
        total: data.length,
        recent,
        high_risk: highRisk,
        locations: uniqueLocations
      });
      
    } catch (err) {
      console.error('Error fetching anomalies:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      
      // Mock data for demonstration when API is not available
      const mockData: Anomaly[] = [
        {
          id: '1',
          user_id: 'user_001',
          login_time: new Date().toISOString(),
          ip_address: '192.168.1.100',
          action: 'login',
          location: 'São Paulo, BR',
          device: 'Chrome/Windows',
          score: 0.85,
          top_feature: 'unusual_location',
          message: 'Anomalia detectada'
        },
        {
          id: '2',
          user_id: 'user_002',
          login_time: new Date(Date.now() - 3600000).toISOString(),
          ip_address: '10.0.0.50',
          action: 'login',
          location: 'Rio de Janeiro, BR',
          device: 'Safari/iOS',
          score: 0.35,
          top_feature: 'normal_pattern',
          message: 'Login normal'
        }
      ];
      
      setAnomalies(mockData);
      setStats({
        total: mockData.length,
        recent: 1,
        high_risk: 1,
        locations: 2
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnomalies();
  }, [fetchAnomalies]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchAnomalies, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnomalies]);

  return {
    anomalies,
    stats,
    loading,
    error,
    refetch: fetchAnomalies
  };
};
