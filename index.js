const { chromium } = require("playwright");

const { parseArgs } = require("./src/cli");
const { readExcel } = require("./src/extractor");
const { searchBeneficiary } = require("./src/scraper");
const { writeExcel } = require("./src/writer");
const {
  startProgress,
  updateProgress,
  stopProgress,
} = require("./src/progress");

async function main() {
  const { sheet, column } = parseArgs();
  const ids = await readExcel("./data/input/data.xlsx", sheet, column);

  const browser = await chromium.connectOverCDP("http://localhost:9222");

  const page = browser.contexts()[0].pages()[0];

  const results = [];
  const errors = [];
  const total = ids.length;

  startProgress(total);

  for (let i = 0; i < total; i++) {
    const id = ids[i];
    let status;

    try {
      const result = await searchBeneficiary(page, id);

      if (result.rows.length === 0) {
        status = "no data";
        results.push({ searchId: id, found: false });
      } else {
        status = `${result.rows.length} found`;
        for (const row of result.rows) {
          results.push({ searchId: id, found: true, ...row });
        }
      }
    } catch (err) {
      status = "error";
      errors.push({ id, message: err.message });
      results.push({ searchId: id, found: "ERROR", error: err.message });
    }

    updateProgress(i + 1, id, status);
  }

  stopProgress();

  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const { id, message } of errors) {
      console.log(`  ${id}: ${message}`);
    }
  }

  const found = results.filter((r) => r.found === true).length;
  const notFound = results.filter((r) => r.found === false).length;
  console.log(
    `\nSummary: ${total} processed, ${found} found, ${notFound} not found, ${errors.length} errors`
  );

  console.log("Writing Excel...");
  await writeExcel("./data/output/result.xlsx", results);
  console.log("Done.");
}

main();
