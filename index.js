const { chromium } = require("playwright");

const { parseArgs } = require("./src/cli");
const { readExcel } = require("./src/extractor");
const { searchBeneficiary } = require("./src/scraper");
const { writeExcel } = require("./src/writer");

async function main() {
  const { sheet, column } = parseArgs();
  const ids = await readExcel("./data/input/data.xlsx", sheet, column);

  const browser = await chromium.connectOverCDP("http://localhost:9222");

  const page = browser.contexts()[0].pages()[0];

  const results = [];

  const total = ids.length;

  for (let i = 0; i < total; i++) {
    const id = ids[i];

    console.log("======================================");
    console.log(`Processing : ${i + 1}/${total}`);
    console.log(`Remaining  : ${total - i - 1}`);
    console.log(`Searching  : ${id}`);

    try {
      const result = await searchBeneficiary(page, id);

      if (result.rows.length === 0) {
        console.log("No records found.");

        results.push({
          searchId: id,
          found: false,
        });
      } else {
        console.log(`${result.rows.length} record(s) found.`);

        for (const row of result.rows) {
          results.push({
            searchId: id,
            found: true,
            ...row,
          });
        }
      }
    } catch (err) {
      console.error(`Failed: ${id}`);
      console.error(err.message);

      results.push({
        searchId: id,
        found: "ERROR",
        error: err.message,
      });
    }
  }

  console.log("--------------------------------------");
  console.log("Writing Excel...");

  await writeExcel("./data/output/result.xlsx", results);

  console.log("Done.");
}

main();
