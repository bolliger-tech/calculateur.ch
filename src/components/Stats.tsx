import type { ParseStats } from '../hooks/useCsvAggregation'

export function Stats({
  stats,
  downloadCsv,
}: {
  stats: ParseStats
  downloadCsv: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-500 bg-slate-900/70 px-4 py-3 print:hidden">
      <div className="flex flex-wrap gap-3 text-sm text-slate-300">
        <span className="pill bg-slate-800 px-3 py-1">
          Gesamtzeilen:
          {' '}
          {stats.totalRows}
        </span>
        <span className="pill bg-emerald-800/40 px-3 py-1">
          Gültig:
          {' '}
          {stats.validRows}
        </span>
        <span className="pill bg-amber-800/40 px-3 py-1">
          Übersprungen:
          {' '}
          {stats.skippedRows}
        </span>
      </div>
      <button
        onClick={downloadCsv}
        disabled={stats.validRows === 0}
        className="pill cursor-pointer gradient-border bg-slate-900 px-4 py-2 text-sm font-medium text-indigo-100 transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Ergebnis als CSV herunterladen
      </button>
    </div>
  )
}
