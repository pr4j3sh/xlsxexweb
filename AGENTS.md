# xlsxexweb

Reads an IDs column from `data/input/data.xlsx`, scrapes beneficiary data from a web page via an already-open browser, and writes results to `data/output/result.xlsx`.

## Run

```bash
# 1. Start Brave/Chrome with remote debugging enabled
brave --remote-debugging-port=9222
# 2. Manually navigate and log in to the target site
# 3. Run the script (defaults: Sheet1, column A)
npm start
# Or specify sheet and column:
npm start -- --sheet "Sheet2" --column B
```

`--sheet` accepts a worksheet name. `--column` accepts a letter (A, B, C...). Both are optional.

No other commands. No tests, no lint, no build step.

## Architecture

- **`index.js`** — entry point. Orchestrates read → scrape loop → write.
- **`src/cli.js`** — parses `--sheet` and `--column` from `process.argv`. Returns `{ sheet, column }`.
- **`src/extractor.js`** — reads IDs from the given sheet of an Excel file, skips the header row. Falls back to the first worksheet if the given name isn't found.
- **`src/progress.js`** — wraps `cli-progress` for a live progress bar during the scrape loop.
- **`src/scraper.js`** — Playwright CDP automation. Connects to the open browser on `localhost:9222`, takes the first tab, fills `#emp_code`, clicks `#btnSbmt`, waits for `#example` DataTable rows.
- **`src/writer.js`** — writes results array to Excel.

## Key facts

- **Playwright** uses `chromium.connectOverCDP` to attach to an existing browser session — no browser is launched.
- **CommonJS** (`"type": "commonjs"` in package.json).
- **ExcelJS** for both reading and writing `.xlsx` files.
- **cli-progress** for the live progress bar during the scrape loop.
- The scraper assumes a specific page DOM (`#emp_code`, `#btnSbmt`, `#example` DataTable). If the target site changes these selectors, `src/scraper.js` breaks.
- Input and output Excel files are gitignored (`*.xlsx` in `.gitignore`).
