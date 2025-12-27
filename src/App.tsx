import './App.css'
import { Header } from './components/Header'
import { InputSection } from './components/InputSection'
import { ResultSection } from './components/ResultSection'
import { Footer } from './components/Footer'
import { useCsvAggregation } from './hooks/useCsvAggregation'

function App() {
  const {
    selectedMonth,
    setSelectedMonth,
    fileName,
    stats,
    employeeData,
    error,
    downloadCsv,
    onFile,
  } = useCsvAggregation()

  return (
    <div className="flex min-h-screen flex-col px-6 pb-4 pt-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
        <Header />

        <InputSection
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          fileName={fileName}
          onFile={onFile}
        />

        <ResultSection
          employeeData={employeeData}
          stats={stats}
          error={error}
          downloadCsv={downloadCsv}
          fileName={fileName}
          month={selectedMonth}
        />
      </div>

      <Footer />
    </div>
  )
}

export default App
