
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Anomaly } from '../../types/anomaly';

interface AnomalyChartProps {
  anomalies: Anomaly[];
  type?: 'line' | 'bar';
}

export const AnomalyChart: React.FC<AnomalyChartProps> = ({ 
  anomalies, 
  type = 'line' 
}) => {
  // Group anomalies by hour for the last 24 hours
  const groupedData = React.useMemo(() => {
    const now = new Date();
    const hours = [];
    
    // Generate last 24 hours
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      hours.push({
        hour: hour.getHours(),
        time: hour.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        anomalies: 0,
        high_risk: 0
      });
    }
    
    // Count anomalies for each hour
    anomalies.forEach(anomaly => {
      const anomalyTime = new Date(anomaly.login_time);
      const hourIndex = hours.findIndex(h => {
        const hourTime = new Date();
        hourTime.setHours(h.hour, 0, 0, 0);
        const nextHour = new Date(hourTime.getTime() + 60 * 60 * 1000);
        return anomalyTime >= hourTime && anomalyTime < nextHour;
      });
      
      if (hourIndex !== -1) {
        hours[hourIndex].anomalies++;
        if (anomaly.score > 0.7) {
          hours[hourIndex].high_risk++;
        }
      }
    });
    
    return hours;
  }, [anomalies]);

  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">
          Anomalias nas Últimas 24 Horas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            {type === 'line' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="anomalies" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Total de Anomalias"
                />
                <Line 
                  type="monotone" 
                  dataKey="high_risk" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Alto Risco"
                />
              </>
            ) : (
              <>
                <Bar 
                  dataKey="anomalies" 
                  fill="hsl(var(--primary))" 
                  name="Total de Anomalias"
                  opacity={0.8}
                />
                <Bar 
                  dataKey="high_risk" 
                  fill="hsl(var(--accent))" 
                  name="Alto Risco"
                  opacity={0.8}
                />
              </>
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
