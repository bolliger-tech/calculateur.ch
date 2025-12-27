export function MonthInput({
  selectedMonth,
  setSelectedMonth,
}: {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-200">Monat</span>
      <input
        type="month"
        value={selectedMonth}
        onChange={e => setSelectedMonth(e.target.value)}
        onClick={(e) => {
          const input = e.currentTarget as HTMLInputElement
          if (input.showPicker) {
            input.showPicker()
          }
        }}
        className="cursor-pointer w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-100 outline-none transition hover:border-indigo-400 hover:ring-2 hover:ring-indigo-500/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 flex-grow-1"
      />
    </label>
  )
}
