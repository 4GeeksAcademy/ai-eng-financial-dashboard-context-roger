/** Contratos de transporte verificados en OpenAPI en vivo el 2026-10-05.
 * Estos tipos describen JSON; no validan respuestas en tiempo de ejecución.
 */
import type { BusinessType, Category, OperationType } from '../src/lib/financial-types';
export type { BusinessType, Category, OperationType, FinancialMovement } from '../src/lib/financial-types';

/** Agrupaciones admitidas; el producto utilizará month. */
export type GroupBy = 'day' | 'week' | 'month';

/** GET /api/metrics/facets -> MetricsFacets. Todos los campos son obligatorios. */
export interface FacetsResponse {
  /** Operaciones presentes en el dataset: income (ingreso), outcome (gasto). */
  operation_types: OperationType[];
  /** Líneas presentes en el dataset global: B2B, B2C. No es un mapa de categorías. */
  business_types: BusinessType[];
  /** Categorías globales: suppliers, sales, operational, administrative, others. */
  categories: Category[];
  /** Primera fecha de calendario del dataset global, YYYY-MM-DD; no nullable. */
  min_date: string;
  /** Última fecha de calendario del dataset global, YYYY-MM-DD; no nullable. */
  max_date: string;
}

/** GET /api/metrics/alerts -> MetricsAlert. Baseline real: todo el historial previo. */
export interface AlertEntry {
  /** Período: YYYY-MM para month, YYYY-Www para week, YYYY-MM-DD para day. */
  period: string;
  /** Gasto agregado del período, número monetario redondeado a dos decimales. */
  outcome_total: number;
  /** Media de TODOS los períodos anteriores devueltos por la agregación filtrada. */
  baseline_average: number;
  /** (outcome_total - baseline) / baseline; ratio, 0.3 representa 30%, cuatro decimales. */
  increase_ratio: number;
}
/** Respuesta raíz JSON de alerts: array, nunca un objeto con propiedad alerts. */
export type AlertsResponse = AlertEntry[];

/** GET /api/metrics/categories/top -> TopCategoryItem. */
export interface CategoryEntry {
  /** Nombre de categoría: suppliers, sales, operational, administrative, others. */
  category: Category;
  /** Operación solicitada, income u outcome; para la comparativa siempre income. */
  operation_type: OperationType;
  /** Importe agregado de la categoría; número monetario, dos decimales. */
  total_amount: number;
}
/** Respuesta raíz JSON de top: array ordenado por total_amount descendente, hasta limit filas. */
export type TopCategoriesResponse = CategoryEntry[];

/** GET /api/metrics/summary -> MetricsSummaryItem; soporte para media móvil y totales. */
export interface SummaryEntry {
  /** Período en el formato de group_by; en estas funcionalidades YYYY-MM. */
  period: string;
  /** Ingresos del período, número monetario redondeado a dos decimales. */
  income: number;
  /** Gastos del período, número monetario redondeado a dos decimales. */
  outcome: number;
  /** income - outcome, número monetario que puede ser negativo. */
  net: number;
}
/** Respuesta raíz JSON de summary: array cronológico; no rellena períodos sin movimientos. */
export type SummaryResponse = SummaryEntry[];
