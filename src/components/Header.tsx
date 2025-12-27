export function Header() {
  return (
    <header className="flex flex-col gap-3 print:hidden">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
        Aggregator für CDD
      </p>
      <h1 className="text-3xl font-semibold text-slate-500">
        Monatlicher Tarifbericht
      </h1>
      <p className="text-slate-400">
        Laden Sie eine CSV-Datei mit Semikolon-Trennzeichen und
        ISO-8859-1-Kodierung hoch, wählen Sie einen Monat aus und sehen Sie
        aggregierte Minuten pro Mitarbeiter &amp; tariff. Alles wird auf Ihrem
        Computer verarbeitet. Keine Daten verlassen Ihren Browser.
      </p>
    </header>
  )
}
