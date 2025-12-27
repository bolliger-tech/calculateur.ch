import { CsvInput } from './CsvInput'
import { MonthInput } from './MonthInput'

export function InputSection({
  selectedMonth,
  setSelectedMonth,
  fileName,
  onFile,
}: {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  fileName: string
  onFile: (file: File) => void
}) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-6 ring-1 ring-slate-800/60 print:hidden">
      <div className="grid gap-4 sm:grid-cols-3">
        <MonthInput
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />

        <CsvInput onFile={onFile} />

        <span className="text-xs text-slate-400 col-start-2">
          {!!fileName && `Gewählt: ${fileName}`}
&nbsp;
        </span>
      </div>
    </div>
  )
}
