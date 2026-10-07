import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { ChartLoading } from "@/components/dashboard/chart-loading";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeDataPeriod, computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const FinancialCharts = lazy(() => import("@/components/dashboard/financial-charts"));

function ChartsLoading() {
  return <>
    <ChartLoading title="Income vs. Outcome" description="Monthly revenue and expenditure evolution" />
    <ChartLoading title="Profit Margin %" description="Monthly profit as a percentage of total income" />
  </>;
}

async function fetchFinancialData(signal: AbortSignal): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [period, setPeriod] = useState("Loading period...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchFinancialData(controller.signal)
      .then((movements) => {
        setPeriod(computeDataPeriod(movements));
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setPeriod("Period unavailable");
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period={period} />

          <p role="status" className="sr-only">
            {loading ? 'Loading financial data.' : error ? '' : 'Financial data loaded.'}
          </p>

          {error ? (
            <div role="alert" lang="es" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators" aria-busy={loading}>
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            aria-busy={loading}
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            {loading ? <ChartsLoading /> : error ? (
              <p className="text-sm text-muted-foreground">Charts unavailable while financial data could not be loaded.</p>
            ) : (
              <Suspense fallback={<ChartsLoading />}>
                <FinancialCharts data={monthlyData} />
              </Suspense>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
