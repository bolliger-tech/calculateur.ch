# Calculateur.ch – Medical Tariff Calculator

Create monthly medical tariff reports from CDD exports. Analyze, aggregate, and generate reports directly in your browser – no data leaves your device. 100% privacy-compliant.

**🌐 Live App:** [https://calculateur.ch](https://calculateur.ch)

## Features

- **Privacy First**: All processing happens in your browser. No data is sent to any server.
- **CSV Import**: Add CDD export files (CSV format) to analyze what your
  personnel has charged (TARMED/TarDoc).
- **Monthly Aggregation**: Filter and aggregate data by month to create organized reports.
- **Employee Overview**: View detailed statistics for each employee with tariff breakdowns.
- **Export Results**: Download processed data as CSV for further analysis or
  billing or print it as PDF.
- **No Authentication Required**: Completely free and accessible to everyone.

## How to Use

1. Visit [https://calculateur.ch](https://calculateur.ch)
2. Upload your CDD export CSV file
3. Select the month you want to analyze
4. View aggregated tariff statistics per employee
5. Download the results as CSV or print it as PDF

### CSV Format

Your input CSV should contain medical treatment records with the following
structure:
- Patient identifier (optional)
- Timestamp (date and time)
- Employee identifier (e.g., doctor/staff initials)
- Treatment type and description
- TARMED or TarDoc position code (e.g., `02.0020`)
- Duration in minutes

See [example.csv](example.csv) for an example format.

## Development

### Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run linter
bun run lint

# Fix linting issues
bun run format
```

### Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **CSV Parsing**: PapaParse
- **Development**: ESLint for code quality

### Project Structure

```
src/
  ├── components/       # React UI components
  ├── hooks/            # Custom React hooks (CSV aggregation logic)
  ├── utils/            # Utility functions (CSV parsing)
  ├── data/             # Static data (tariff definitions)
  └── App.tsx           # Main app component
```

## Deployment

This app is deployed to [https://calculateur.ch](https://calculateur.ch) and is available publicly without any login or restrictions.

### Privacy & Data Security

This application:
- ✅ Processes all data locally in your browser
- ✅ Never stores or transmits your files
- ✅ Never sends data to external servers
- ✅ Works completely offline once loaded

---

Built with love and AI for Swiss medical professionals. Contribute or report issues on
GitHub. May the vibe be with you! 🤖
