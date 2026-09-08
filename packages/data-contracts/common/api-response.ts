/**
 * Standard Platform API Response Specification
 */

export interface ApiResponse<T = any> {
  success: boolean;
  version: string;
  data: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
    totalCount?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
    latencyMs?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export function successResponse<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    version: 'v1',
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function errorResponse(code: string, message: string, details?: any): ApiResponse<null> {
  return {
    success: false,
    version: 'v1',
    data: null,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

