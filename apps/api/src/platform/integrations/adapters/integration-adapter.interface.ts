export type IntegrationType =
  | 'LOGISTICS'
  | 'PAYMENTS'
  | 'FINANCIAL'
  | 'AGRICULTURE'
  | 'GOVERNMENT'
  | 'FPO'
  | 'ERP'
  | 'ACCOUNTING'
  | 'MESSAGING'
  | 'IDENTITY'
  | 'OTHER';

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'UNKNOWN';

export interface HealthCheckResult {
  status: HealthStatus;
  latencyMs: number;
  errorRate: number;
  message?: string;
}

export interface IntegrationAdapter {
  type: IntegrationType;
  name: string;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  healthCheck(): Promise<HealthCheckResult>;
  send(payload: any): Promise<any>;
  receive(payload: any): Promise<any>;
}
