import type { ProjectRisk, SecurityFinding } from './security';

export interface Dashboard {
  id: string;
  name: string;
  source: string;
  projectUrl: string;
  projectPath: string;
  projectId: number;
  projectName: string;
  createdAt: string;
}

export interface DashboardListResponse {
  data: Dashboard[];
}

export interface CreateDashboardPayload {
  name?: string;
  projectUrl: string;
  /** Token pessoal — enviado via HTTPS, nunca persistido no frontend */
  token?: string;
}

export interface ProjectDashboardFindings {
  findings: SecurityFinding[];
  projectRisk: ProjectRisk;
}

export interface ProjectDashboardResponse {
  data: ProjectDashboardFindings;
}
