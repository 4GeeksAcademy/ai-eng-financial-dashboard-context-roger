import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { IncomeOutcomeChart } from './income-outcome-chart'
import { ProfitPercentChart } from './profit-percent-chart'
import { computeMonthlyData } from '@/lib/financial-utils'
import type { FinancialMovement, MonthlyDataPoint } from '@/lib/financial-types'

function movement(amount: number, operation_type: FinancialMovement['operation_type']): FinancialMovement {
  return { create_date: '2026-01-01', amount, operation_type, category: 'sales', business_type: 'B2B' }
}

describe('financial chart integrity', () => {
  it('presents break-even as real data with a zero margin', () => {
    const data = computeMonthlyData([movement(100, 'income'), movement(100, 'outcome')])
    const html = renderToStaticMarkup(<ProfitPercentChart data={data} />)
    expect(html).not.toContain('No data available')
    expect(html).toContain('0.0%')
    expect(html).toContain('Jan 2026')
  })

  it('keeps all-zero movements visible in both chart alternatives', () => {
    const data = computeMonthlyData([movement(0, 'income')])
    const income = renderToStaticMarkup(<IncomeOutcomeChart data={data} />)
    const profit = renderToStaticMarkup(<ProfitPercentChart data={data} />)
    expect(income).not.toContain('No data available')
    expect(profit).not.toContain('No data available')
    expect(income).toContain('$0')
    expect(profit).toContain('0.0%')
  })

  it('preserves losses and the documented no-income convention', () => {
    const loss = computeMonthlyData([movement(100, 'income'), movement(150, 'outcome')])
    expect(renderToStaticMarkup(<ProfitPercentChart data={loss} />)).toContain('-50.0%')
    const expenses = computeMonthlyData([movement(150, 'outcome')])
    expect(renderToStaticMarkup(<IncomeOutcomeChart data={expenses} />)).toContain('$150')
    const html = renderToStaticMarkup(<ProfitPercentChart data={expenses} />)
    expect(html).toContain('0.0%')
    expect(html).not.toContain('No data available')
  })

  it('uses the empty state only for an empty dataset', () => {
    for (const Chart of [IncomeOutcomeChart, ProfitPercentChart]) {
      const html = renderToStaticMarkup(<Chart data={[]} />)
      expect(html).toContain('No data available to display')
      expect(html).not.toContain('<table')
    }
  })

  it('does not expose confirmed values during loading', () => {
    const data: MonthlyDataPoint[] = [{ month: 'Jan 2026', income: 100, outcome: 50, profitPercent: 50 }]
    const html = renderToStaticMarkup(<IncomeOutcomeChart data={data} loading />)
    expect(html).not.toContain('<table')
    expect(html).not.toContain('$100')
    expect(html).not.toContain('No data available')
  })
})
