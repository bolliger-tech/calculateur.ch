import Papa from 'papaparse'
import type { EmployeeData } from '../hooks/useCsvAggregation'

export interface ParsedRow {
  month: string
  employee: string
  tariff: string
  minutes: number
}

function parseTimestampToMonthKey(ts: string): string | null {
  const trimmed = ts.trim()
  const match = /^(\d{2})\.(\d{2})\.(\d{4})\s+\d{2}:\d{2}$/.exec(trimmed)
  if (!match) return null
  const [, dayStr, monthStr, yearStr] = match
  const day = Number(dayStr)
  const month = Number(monthStr)
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  return `${yearStr}-${monthStr}`
}

function parsetariffAndDuration(
  field: string,
): { tariff: string, minutes: number } | null {
  const match = /Pos:\s*([A-Za-z0-9.]+)\s+(\d+)\s*min/i.exec(field.trim())
  if (!match) return null
  const [, tariff, minutesStr] = match
  const minutes = Number(minutesStr)
  if (!Number.isFinite(minutes) || minutes <= 0) return null
  return { tariff, minutes }
}

export function parseText(text: string) {
  const data = {
    totalRowsCount: 0,
    rows: [] as ParsedRow[],
  }
  let error = ''

  const parsed = Papa.parse<string[]>(text, {
    delimiter: ';',
    skipEmptyLines: true,
  })

  if (parsed.errors.length > 0) {
    error = 'CSV parsing reported errors; some rows may be skipped.'
  }

  const candidates = parsed.data

  for (const row of candidates) {
    const timestamp = row[1]?.trim()
    const employee = row[2]?.trim()
    const tariffField = row[6]?.trim()

    const monthKey = timestamp ? parseTimestampToMonthKey(timestamp) : null
    if (!monthKey) continue
    data.totalRowsCount += 1
    if (!employee || !tariffField) {
      continue
    }

    const tariffParsed = parsetariffAndDuration(tariffField)
    if (!tariffParsed) continue

    data.rows.push({
      month: monthKey,
      employee,
      minutes: tariffParsed.minutes,
      tariff: tariffParsed.tariff,
    })
  }

  return { data, error }
}

export function buildCsvFromEmployeeTariffSums(
  employeeData: EmployeeData[],
): string {
  const rows: string[][] = [['employee', 'tariff', 'totalMinutes']]
  const employees = employeeData.sort((a, b) => a.name.localeCompare(b.name))
  for (const employee of employees) {
    const tariffs = Object.entries(employee.sums).sort(([a], [b]) =>
      a.localeCompare(b),
    )
    for (const [tariff, sum] of tariffs) {
      rows.push([employee.name, tariff, sum.minutes.toString()])
    }
  }

  return Papa.unparse(rows)
}
