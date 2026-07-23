const ExcelJS = require("exceljs");

async function readExcel(filePath, sheetName = "Sheet1", idColumn = "A") {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log({ workbook: workbook.worksheets.map((ws) => ws.name) });
  sheetName = workbook.worksheets[0].name;
  console.log(`Reading sheet: ${sheetName} from file: ${filePath}`);

  const worksheet =
    typeof sheetName === "number"
      ? workbook.getWorksheet(sheetName)
      : workbook.getWorksheet(sheetName);

  if (!worksheet) {
    throw new Error("Worksheet not found");
  }

  const ids = [];

  worksheet.eachRow((row, rowNumber) => {
    // Skip header
    if (rowNumber === 1) return;

    const cell = row.getCell(idColumn);
    const value = cell.text?.trim();

    if (value) {
      ids.push(value);
    }
  });

  return ids;
}

module.exports = { readExcel };
