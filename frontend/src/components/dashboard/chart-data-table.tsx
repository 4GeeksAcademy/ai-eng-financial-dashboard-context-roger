import type { MonthlyDataPoint } from '@/lib/financial-types'
import { formatCurrency, formatPercent } from '@/lib/financial-utils'

interface ChartDataTableProps {
  data: MonthlyDataPoint[]
  kind: 'income-outcome' | 'profit'
}

export function ChartDataTable({ data, kind }: ChartDataTableProps) {
  const isIncome = kind === 'income-outcome'
  const name = isIncome ? 'income and outcome' : 'profit margin'

  return (
    <details className="mt-4 text-sm">
      <summary className="min-h-11 cursor-pointer rounded-md py-3 font-medium">
        View {name} data
      </summary>
      <div className="overflow-x-auto rounded-md" role="region" aria-label={`${name} data table`} tabIndex={0}>
        <table className="w-full text-left text-xs sm:text-sm">
          <caption className="sr-only">Monthly {name}{isIncome ? ' in USD' : ' as a percentage of income'}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-3 pr-3">Month</th>
              {isIncome ? <th scope="col" className="py-3 pr-3 text-right">Income (USD)</th> : null}
              <th scope="col" className="py-3 text-right">{isIncome ? 'Outcome (USD)' : 'Profit margin (%)'}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.month} className="border-b border-border">
                <th scope="row" className="py-3 pr-3 font-medium whitespace-nowrap">{point.month}</th>
                {isIncome ? <td className="py-3 pr-3 text-right tabular-nums">{formatCurrency(point.income)}</td> : null}
                <td className="py-3 text-right tabular-nums">{isIncome ? formatCurrency(point.outcome) : formatPercent(point.profitPercent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
