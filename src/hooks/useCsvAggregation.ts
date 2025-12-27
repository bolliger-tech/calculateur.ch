import { useCallback, useMemo, useState } from 'react'
import type { ParsedRow } from '../utils/csvParsing'
import { buildCsvFromEmployeeTariffSums, parseText } from '../utils/csvParsing'
import tariffDetails from '../data/tariffs.json'

export interface Tariff {
  tardoc: string
  tarmed: string | null
  professions: string[]
  description: string
  maxMinutes: number | null
  presence: boolean | null
}

export interface ParseStats {
  totalRows: number
  validRows: number
  skippedRows: number
}

export interface TariffSum {
  minutes: number
  tariff: Tariff | undefined
}

type EmployeeName = string
export type TariffCode = string

type TariffSums = Map<TariffCode, TariffSum>

export interface ErrorRow {
  tariff: TariffCode
  minutes: number
  error: string
}

export interface EmployeeData {
  name: EmployeeName
  sums: TariffSums
  profession: string
  errors: ErrorRow[]
}

export interface UseCsvAggregationResult {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  fileName: string
  stats: ParseStats
  employeeData: EmployeeData[]
  error: string
  onFile: (file: File) => void
  downloadCsv: () => void
}

export const UNKNOWN_PROFESSION = 'Unbekannt'

const getDefaultMonthValue = (): string => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

function getTariffDetails(tariffCode: TariffCode): Tariff | undefined {
  return tariffDetails.find(
    t => t.tarmed === tariffCode || t.tardoc === tariffCode,
  )
}

function sumByTariff(rows: ParsedRow[]): TariffSums {
  return rows.reduce((acc, row) => {
    const existing = acc.get(row.tariff) ?? { minutes: 0, tariff: undefined }
    const tariffInfo = getTariffDetails(row.tariff)
    acc.set(row.tariff, {
      minutes: existing.minutes + row.minutes,
      tariff: tariffInfo,
    })
    return acc
  }, new Map())
}

function guessProfession(sums: TariffSums): string {
  const professionScores = new Map<string, number>()

  for (const [tariffCode, { tariff }] of sums.entries()) {
    if (tariffCode.startsWith('P') && !tariff) {
      professionScores.set(
        'Psycholog:in',
        (professionScores.get('Psycholog:in') ?? 0) + 1,
      )
      continue
    }
    if (!tariff) continue
    if (tariff.professions.length === 0) continue
    if (tariff.professions.length === 1) {
      for (const profession of tariff.professions) {
        if (!professionScores.has(profession)) {
          professionScores.set(profession, 0)
        }
        professionScores.set(profession, professionScores.get(profession)! + 1)
      }
    }
  }

  const sortedProfessions = Array.from(professionScores.entries()).sort(
    (a, b) => b[1] - a[1],
  )

  if (
    sortedProfessions.length === 0
    || (sortedProfessions.length >= 2
      && sortedProfessions[0][1] === sortedProfessions[1][1])
  ) {
    return UNKNOWN_PROFESSION
  }

  return sortedProfessions[0][0]
}

function getEmployeeErrors(profession: string, sums: TariffSums): ErrorRow[] {
  const errors: ErrorRow[] = []

  for (const [tariffCode, { minutes, tariff }] of sums.entries()) {
    if (!tariff) continue

    if (tariff.maxMinutes !== null && minutes > tariff.maxMinutes) {
      errors.push({
        tariff: tariffCode,
        minutes,
        error: `Maximale Minuten für Tarif ${tariffCode} überschritten (${minutes} > ${tariff.maxMinutes})`,
      })
    }

    if (
      tariff.professions.length > 0
      && !tariff.professions.includes(profession)
    ) {
      errors.push({
        tariff: tariffCode,
        minutes,
        error: `Tarif ${tariffCode} passt nicht zum Beruf ${profession}`,
      })
    }
  }

  return errors
}

function getEmployeeData(name: EmployeeName, sums: TariffSums): EmployeeData {
  const profession = guessProfession(sums)
  return {
    name: name.toLocaleUpperCase(),
    sums,
    profession,
    errors: getEmployeeErrors(profession, sums),
  }
}

export const useCsvAggregation = (): UseCsvAggregationResult => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    getDefaultMonthValue(),
  )
  const [fileName, setFileName] = useState<string>('')
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [totalRows, setTotalRows] = useState<number>(0)
  const [error, setError] = useState<string>('')

  const handleTextParse = useCallback((text: string) => {
    const { data, error } = parseText(text)
    setError(error)
    setTotalRows(data.totalRowsCount)
    setParsedRows(data.rows)
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          handleTextParse(text)
        }
        else {
          setError('Unable to read file content')
        }
      }
      reader.onerror = () => setError('Error reading the file')
      reader.readAsText(file, 'ISO-8859-1')
    },
    [handleTextParse],
  )

  const rowsOfSelectedMonth = useMemo(
    () => parsedRows.filter(row => row.month === selectedMonth),
    [parsedRows, selectedMonth],
  )

  const rowsByEmployee = useMemo(() => {
    const employees = new Map<EmployeeName, ParsedRow[]>()
    rowsOfSelectedMonth.forEach((row) => {
      if (!employees.has(row.employee)) {
        employees.set(row.employee, [])
      }
      employees.get(row.employee)?.push(row)
    })
    return employees
  }, [rowsOfSelectedMonth])

  const employeeData = useMemo(
    () =>
      Array.from(rowsByEmployee.entries()).map(([employee, rows]) => {
        const sums = sumByTariff(rows)
        return getEmployeeData(employee, sums)
      }),
    [rowsByEmployee],
  )

  const stats = useMemo(() => {
    const validRows = rowsOfSelectedMonth.length
    return {
      totalRows,
      validRows,
      skippedRows: Math.max(totalRows - validRows, 0),
    }
  }, [rowsOfSelectedMonth, totalRows])

  const downloadCsv = useCallback(() => {
    const csv = buildCsvFromEmployeeTariffSums(employeeData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `calculateur-${selectedMonth}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [employeeData, selectedMonth])

  return {
    selectedMonth,
    setSelectedMonth,
    fileName,
    stats,
    employeeData,
    error,
    onFile: handleFile,
    downloadCsv,
  }
}
