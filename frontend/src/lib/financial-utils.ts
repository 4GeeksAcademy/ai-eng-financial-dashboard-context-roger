import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "./financial-types";

function formatMonthYearLabel(yearMonthKey: string): string {
  const [yearText, monthText] = yearMonthKey.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function computeKPIs(movements: FinancialMovement[]): KPIMetrics {
  let totalIncome = 0;
  let totalOutcome = 0;
  for (const movement of movements) {
    if (movement.operation_type === "income") totalIncome += movement.amount;
    else totalOutcome += movement.amount;
  }

  const profit = totalIncome - totalOutcome;
  const profitPercent = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  return { totalIncome, totalOutcome, profit, profitPercent };
}

export function computeMonthlyData(
  movements: FinancialMovement[],
): MonthlyDataPoint[] {
  const monthlyMap: Record<string, { income: number; outcome: number }> = {};

  for (const m of movements) {
    const yearMonthKey = m.create_date.slice(0, 7);
    if (!monthlyMap[yearMonthKey]) {
      monthlyMap[yearMonthKey] = { income: 0, outcome: 0 };
    }

    if (m.operation_type === "income") {
      monthlyMap[yearMonthKey].income += m.amount;
    } else {
      monthlyMap[yearMonthKey].outcome += m.amount;
    }
  }

  return Object.keys(monthlyMap)
    .sort()
    .map((yearMonthKey) => {
      const { income, outcome } = monthlyMap[yearMonthKey];
      const profit = income - outcome;
      const profitPercent = income > 0 ? (profit / income) * 100 : 0;
      return {
        month: formatMonthYearLabel(yearMonthKey),
        income,
        outcome,
        profitPercent,
      };
    });
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function computeDataPeriod(movements: FinancialMovement[]): string {
  if (movements.length === 0) return "No financial data";
  let first = movements[0].create_date;
  let last = first;
  for (const movement of movements) {
    if (movement.create_date < first) first = movement.create_date;
    if (movement.create_date > last) last = movement.create_date;
  }
  return first === last ? first : `${first} - ${last}`;
}
