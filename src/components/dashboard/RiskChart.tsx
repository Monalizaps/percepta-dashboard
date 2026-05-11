import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectRisk } from '@/types/security';
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RiskChartProps {
  projects: ProjectRisk[];
}

export function RiskChart({ projects }: RiskChartProps) {
  const chartData = projects.map((project) => ({
    project: project.project,
    sri: Number(project.score.toFixed(1)),
    delta: Number(project.deltaPercent.toFixed(1)),
  }));

  return (
    <Card className="border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/70 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.9)]">
      <CardHeader>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Security Risk Index</p>
        <CardTitle className="text-xl text-foreground">SRI por ativo e variação recente</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="project" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '16px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Area yAxisId="left" type="monotone" dataKey="sri" fill="hsla(185, 85%, 55%, 0.14)" stroke="hsl(var(--primary))" strokeWidth={2.5} />
            <Bar yAxisId="right" dataKey="delta" fill="hsla(40, 95%, 65%, 0.75)" radius={[8, 8, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
