export function CsvInput({ onFile }: { onFile: (file: File) => void }) {
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) {
      onFile(e.dataTransfer.files[0])
    }
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFile(e.target.files[0])
    }
  }

  return (
    <label className="flex flex-col gap-2 sm:col-span-2">
      <span className="text-sm font-medium text-slate-200">CSV hochladen</span>
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        className="flex flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/50 px-4 py-3 transition hover:border-indigo-400"
      >
        <div className="flex flex-col text-left">
          <span className="text-sm text-slate-200">
            Ziehen &amp; ablegen oder klicken zum Auswählen
          </span>
          <span className="text-xs text-slate-400">
            Mit Semikolon getrennt; ISO-8859-1 codiert
          </span>
        </div>
        <div className="pill gradient-border px-3 py-1 text-xs font-medium text-indigo-200">
          Datei wählen
        </div>
      </div>
      <input
        id="file-input"
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={onFileInputChange}
      />
    </label>
  )
}
