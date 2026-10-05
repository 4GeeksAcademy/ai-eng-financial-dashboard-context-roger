import type { BusinessType, Category, GroupBy, OperationType } from './api-types';

/** Modelo de query del cliente: omitir propiedades vacías, nunca serializar null/undefined. */
export interface DateRangeFilter {
  /** Límite inferior inclusivo opcional; fecha real de calendario YYYY-MM-DD. */
  start_date?: string;
  /** Límite superior inclusivo opcional; fecha real de calendario YYYY-MM-DD. */
  end_date?: string;
}

/** GET /api/metrics; ninguna propiedad es obligatoria en OpenAPI. */
export interface MetricsParams extends DateRangeFilter {
  /** Categoría opcional entre suppliers, sales, operational, administrative, others. */
  category?: Category;
  /** Operación opcional: income u outcome; omitir para incluir ambas. */
  operation_type?: OperationType;
}

/** GET /api/metrics/alerts; contrato real, separado de las restricciones de producto. */
export interface AlertsParams extends DateRangeFilter {
  /** API: número finito >= 0, sin máximo, default 0.3. UI: 0.01 <= valor <= 1.0. */
  threshold?: number;
  /** day, week o month; default month. La tabla del producto fija month. */
  group_by?: GroupBy;
  /** B2B o B2C opcional; omitir para incluir ambos grupos. */
  business_type?: BusinessType;
}

/** GET /api/metrics/categories/top. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** income u outcome; default API outcome. La comparativa envía income explícitamente. */
  operation_type?: OperationType;
  /** Entero 1..20 inclusivo, default API 5. La comparativa envía 5 explícitamente. */
  limit?: number;
  /** B2B o B2C; opcional en API pero obligatorio por decisión de cada panel. */
  business_type?: BusinessType;
}

/** GET /api/metrics/summary, soporte verificado de ambas funcionalidades. */
export interface SummaryParams extends DateRangeFilter {
  /** day, week o month, default month; el producto envía month. */
  group_by?: GroupBy;
  /** Categoría opcional entre suppliers, sales, operational, administrative, others. */
  category?: Category;
  /** income u outcome opcional; comparativa income, media móvil ambas operaciones. */
  operation_type?: OperationType;
  /** B2B o B2C opcional; comparativa envía el grupo, alertas omite. */
  business_type?: BusinessType;
}
