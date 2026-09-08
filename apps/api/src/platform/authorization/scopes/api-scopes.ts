/**
 * RuralConnect API Scopes Definition
 */

export enum ApiScope {
  // Agriculture / Farms
  FARMS_READ = 'farms:read',
  FARMS_WRITE = 'farms:write',

  // Workforce
  JOBS_READ = 'jobs:read',
  JOBS_WRITE = 'jobs:write',

  // Machinery / Assets
  ASSETS_READ = 'assets:read',
  ASSETS_WRITE = 'assets:write',

  // Commerce
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',

  // Produce
  PRODUCE_READ = 'produce:read',
  PRODUCE_WRITE = 'produce:write',

  // Logistics
  TRANSPORT_READ = 'transport:read',
  TRANSPORT_WRITE = 'transport:write',

  // Financials
  PAYMENTS_READ = 'payments:read',
  SETTLEMENTS_READ = 'settlements:read',

  // Analytics & Exports
  ANALYTICS_READ = 'analytics:read',
  EXPORTS_READ = 'exports:read',
  EXPORTS_WRITE = 'exports:write',

  // Webhooks
  WEBHOOKS_MANAGE = 'webhooks:manage',

  // Admin / Full Access
  PLATFORM_ADMIN = 'platform:admin',
}

export const ALL_SCOPES = Object.values(ApiScope);
