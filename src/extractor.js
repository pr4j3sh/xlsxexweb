const ExcelJS = require("exceljs");

async function readExcel(filePath, sheetName = "Sheet1", idColumn = "A") {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  let worksheet = workbook.getWorksheet(sheetName);

  if (!worksheet) {
    console.log(`Sheet "${sheetName}" not found, falling back to first sheet.`);
    worksheet = workbook.worksheets[0];
  }

  const actualSheetName = worksheet.name;
  console.log(`Reading sheet: ${actualSheetName} from file: ${filePath}`);

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
