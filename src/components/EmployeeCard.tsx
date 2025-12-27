import { useMemo, useState } from 'react'
import {
  UNKNOWN_PROFESSION,
  type EmployeeData,
} from '../hooks/useCsvAggregation'
import { twMerge } from 'tailwind-merge'

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `${hours}:${rest.toString().padStart(2, '0')}`
}

function parseHoursInput(input: string): number | null {
  const trimmed = input.trim()
  if (trimmed === '') return null
  if (trimmed.includes(':')) {
    const withHours = `0${trimmed}`
    const [hoursStr, minutesStr] = withHours.split(':')
    if (minutesStr === undefined) return null
    if (minutesStr !== '0' && minutesStr.length !== 2) return null
    const hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)
    if (minutes < 0 || minutes >= 60) return null
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      return hours + minutes / 60
    }
  }
  else {
    const parsed = parseFloat(trimmed.replace(',', '.'))
    if (!Number.isNaN(parsed)) return parsed
  }
  return null
}

export function EmployeeCard({
  employee,
  monthString,
  className = '',
}: {
  employee: EmployeeData
  monthString: string
  className?: string
}) {
  const [hoursWorked, setHoursWorked] = useState<string>('')

  const totalMinutes = useMemo(
    () =>
      Array.from(employee.sums.values()).reduce(
        (acc, curr) => acc + curr.minutes,
        0,
      ),
    [employee.sums],
  )

  const parsedHours = useMemo(
    () => parseHoursInput(hoursWorked),
    [hoursWorked],
  )

  const percentage = useMemo(() => {
    const hoursWorkedMinutes
      = parsedHours !== null ? parsedHours * 60 : undefined
    const percentage
      = hoursWorkedMinutes !== undefined && hoursWorkedMinutes > 0
        ? ((totalMinutes / hoursWorkedMinutes) * 100).toFixed(1)
        : undefined
    return percentage
  }, [totalMinutes, parsedHours])

  const isInvalid = hoursWorked.trim() !== '' && Number.isNaN(parsedHours)

  const sortedSums = useMemo(
    () =>
      Array.from(employee.sums.entries()).sort(
        (a, b) => b[1].minutes - a[1].minutes,
      ),
    [employee.sums],
  )

  return (
    <section
      className={twMerge(
        'rounded-xl border border-slate-500 bg-slate-900/70 p-4 shadow-sm break-inside-avoid-page',
        className,
      )}
    >
      <div>
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-semibold text-slate-50">
            {employee.name}
          </h2>
          <span className="inline-block rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-200">
            {employee.profession}
          </span>
        </div>

        <div className="sm:flex justify-between align-bottom">
          <div>
            <ul className="mt-3">
              <li className="mt-2 text-sm text-slate-200">
                Abgerechnet:
                {' '}
                <span className="font-semibold">
                  {formatMinutes(totalMinutes)}
                </span>
              </li>
              <li className="text-slate-400 text-sm">
                Minuten:
                {' '}
                {totalMinutes}
              </li>
            </ul>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <label className="block text-sm text-slate-300 mb-1">
                  Arbeitszeit im
                  {' '}
                  {monthString}
                  :
                </label>
                <input
                  type="text"
                  value={hoursWorked}
                  onChange={e => setHoursWorked(e.target.value)}
                  inputMode="decimal"
                  pattern="[.,0-9]*"
                  placeholder="HH:MM"
                  aria-invalid={isInvalid}
                  className={`text-slate-50 placeholder-slate-400 placeholder:text-sm placeholder:text-center border-b px-0 py-0 outline-none w-15 px-1 text-right bg-slate-800/60 ${
                    isInvalid
                      ? 'border-b-red-500 focus:border-b-red-500'
                      : 'border-b-slate-900 focus:border-b-indigo-400'
                  }`}
                />
              </div>
            </div>
          </div>
          {percentage !== undefined && (
            <div className="text-slate-200 flex flex-col items-end justify-end gap-1">
              <div className="ml-2 inline-block rounded-md bg-indigo-500/15 px-2 py-1 text-2xl font-bold text-indigo-200 ring-1 ring-indigo-500/0">
                {percentage}
                %
              </div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Abgerechnet
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-900/60 p-3">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-2 py-1 w-20">Tarif</th>
                <th></th>
                <th className="px-2 py-1 text-right">Minuten</th>
                <th className="px-2 py-1 text-right">HH:MM</th>
              </tr>
            </thead>
            <tbody>
              {sortedSums.map(([tariffCode, { tariff, minutes }]) => (
                <tr key={tariffCode} className="border-t border-slate-800/60">
                  <td className="px-2 py-1 font-medium w-20">{tariffCode}</td>
                  <td className="px-2 py-1 font-medium">
                    {tariff?.description ?? 'Unbekannter Tarif'}
                  </td>
                  <td className="px-2 py-1 text-right">{minutes}</td>
                  <td className="px-2 py-1 text-right text-slate-400">
                    {formatMinutes(minutes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {employee.profession !== UNKNOWN_PROFESSION
        && employee.errors.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-900/50 bg-red-950/30 p-3">
          <h3 className="text-xs uppercase tracking-wide text-red-400 mb-2">
            Fehlerhafte Einträge
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-red-200">
              <thead className="text-xs uppercase tracking-wide text-red-400">
                <tr>
                  <th className="px-2 py-1">Tarif</th>
                  <th className="px-2 py-1 text-right">Minuten</th>
                  <th className="px-2 py-1">Fehler</th>
                </tr>
              </thead>
              <tbody>
                {employee.errors.map((error, idx) => (
                  <tr key={idx} className="border-t border-red-900/30">
                    <td className="px-2 py-1 font-medium">{error.tariff}</td>
                    <td className="px-2 py-1 text-right">{error.minutes}</td>
                    <td className="px-2 py-1 text-red-300">{error.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
