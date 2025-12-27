export function Footer() {
  return (
    <footer className="mt-8 pt-4 text-center text-xs text-slate-400 print:hidden">
      <p>
        Built with love and AI by
        {' '}
        <a
          href="https://bolliger.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-600 transition-colors"
        >
          bolliger.tech
        </a>
        . Open source on
        {' '}
        <a
          href="https://github.com/bolliger-tech/calculateur.ch"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-600 transition-colors"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  )
}
