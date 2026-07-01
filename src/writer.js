const ExcelJS = require("exceljs");

async function writeExcel(filePath, data) {

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Results");

  sheet.columns = [
    { header: "Search ID", key: "searchId", width: 20 },
    { header: "Found", key: "found", width: 10 },
    { header: "Name", key: "name", width: 35 },
    { header: "Beneficiary Id", key: "beneficiaryId", width: 30 },
    { header: "Account No", key: "accountNo", width: 25 },
    { header: "IFSC", key: "ifsc", width: 20 },
    { header: "Mobile", key: "mobile", width: 20 },
    { header: "Beneficiary Type", key: "type", width: 20 },
    { header: "Status", key: "status", width: 15 }
  ];

  sheet.addRows(data);

  await workbook.xlsx.writeFile(filePath);
}

module.exports = {
  writeExcel
};
