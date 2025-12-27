import { useMemo } from 'react'
import type { EmployeeData, ParseStats } from '../hooks/useCsvAggregation'
import { EmployeeCard } from './EmployeeCard'
import { Stats } from './Stats'

export function ResultSection({
  employeeData,
  stats,
  error,
  downloadCsv,
  fileName,
  month,
}: {
  employeeData: EmployeeData[]
  stats: ParseStats
  error: string
  downloadCsv: () => void
  fileName: string
  month: string
}) {
  const monthString = useMemo(() => {
    const date = new Date(month + '-01')
    const monthName = date.toLocaleString('de-CH', { month: 'long' })
    const year = date.getFullYear()
    return `${monthName} ${year}`
  }, [month])

  const professionGroups = useMemo(
    () =>
      employeeData.reduce<Record<string, EmployeeData[]>>((acc, employee) => {
        if (!acc[employee.profession]) {
          acc[employee.profession] = []
        }
        acc[employee.profession].push(employee)
        return acc
      }, {}),
    [employeeData],
  )

  const sortedProfessionGroups = useMemo(
    () =>
      Object.values(professionGroups)
        .sort((a, b) => a[0].profession.localeCompare(b[0].profession))
        .map((group) => {
          group.sort((a, b) => a.name.localeCompare(b.name))
          return group
        }),
    [professionGroups],
  )

  if (!fileName) {
    return (
      <div className="text-slate-400">
        Noch keine Daten. Laden Sie eine CSV-Datei hoch, um den Bericht zu
        sehen.
      </div>
    )
  }

  if (employeeData.length === 0 && !error) {
    return (
      <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-800">
        Keine gültigen Daten für
        {' '}
        <strong>{monthString}</strong>
        {' '}
        gefunden. Bitte
        überprüfen Sie die hochgeladene Datei resp. den gewählten Monat.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Stats stats={stats} downloadCsv={downloadCsv} />

      {!!error && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm text-rose-800">
          {error}
        </div>
      )}

      <EmployeeCard
        employee={{
          name: 'Alle',
          sums: employeeData.reduce((acc, emp) => {
            emp.sums.forEach((value, key) => {
              const existing = acc.get(key) ?? {
                minutes: 0,
                tariff: value.tariff,
              }
              acc.set(key, {
                minutes: existing.minutes + value.minutes,
                tariff: value.tariff,
              })
            })
            return acc
          }, new Map()),
          profession: 'Alle Berufe',
          errors: [],
        }}
        monthString={monthString}
        className="gradient-border mt-4"
      />

      {sortedProfessionGroups.map(employees => (
        <div
          key={employees[0].profession}
          className="space-y-4 not-last:break-after-page"
        >
          <div className="flex justify-between items-baseline">
            <h2 className="mt-6 text-xl font-semibold text-slate-500 break-after-avoid-page">
              {employees[0].profession}
            </h2>
            <span className="text-xs uppercase tracking-wide text-slate-500">
              {monthString}
            </span>
          </div>

          <div className="grid gap-4">
            <EmployeeCard
              employee={{
                name: 'Alle',
                sums: employees.reduce((acc, emp) => {
                  emp.sums.forEach((value, key) => {
                    const existing = acc.get(key) ?? {
                      minutes: 0,
                      tariff: value.tariff,
                    }
                    acc.set(key, {
                      minutes: existing.minutes + value.minutes,
                      tariff: value.tariff,
                    })
                  })
                  return acc
                }, new Map()),
                profession: employees[0].profession,
                errors: [],
              }}
              monthString={monthString}
              className="gradient-border"
            />

            {employees.map((employee) => {
              return (
                <EmployeeCard
                  key={employee.name}
                  employee={employee}
                  monthString={monthString}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
