import { IncomeOutcomeChart } from './income-outcome-chart'
import { ProfitPercentChart } from './profit-percent-chart'
import type { MonthlyDataPoint } from '@/lib/financial-types'

export default function FinancialCharts({ data }: { data: MonthlyDataPoint[] }) {
  return (
    <>
      <IncomeOutcomeChart data={data} />
      <ProfitPercentChart data={data} />
    </>
  )
}
