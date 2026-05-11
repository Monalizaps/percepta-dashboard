export interface ProjectRisk {
  project: string;
  source: string;
  score: number;
  deltaPercent: number;
  trend: "up" | "down" | "flat";
  criticals: number;
  highs: number;
  mediums: number;
  internetFacing: boolean;
  updatedAt: string;
}

export interface SecurityFinding {
  id: string;
  source: string;
  project: string;
  severity: string;
  title: string;
  description: string;
  status: string;
  category: string;
  exposure: string;
  internetFacing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Metric {
  source: string;
  project: string;
  key: string;
  value: number;
  unit: string;
  collectedAt: string;
}

export interface TimelineEvent {
  id: string;
  project: string;
  source: string;
  type: string;
  title: string;
  description: string;
  occurredAt: string;
}

export interface Insight {
  id: string;
  kind: string;
  project: string;
  title: string;
  description: string;
  priority: string;
}

export interface Capability {
  name: string;
  description: string;
  enabled: boolean;
}

export interface SecurityOverview {
  projects: ProjectRisk[];
  findings: SecurityFinding[];
  metrics: Metric[];
  events: TimelineEvent[];
  insights: Insight[];
  updatedAt: string;
}

export interface OverviewResponse {
  data: SecurityOverview;
  futureCapabilities?: Capability[];
}
