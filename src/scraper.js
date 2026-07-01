async function searchBeneficiary(page, id) {

  const input = page.locator("#emp_code");

  await input.fill("");
  await input.fill(id);

  await page.locator("#btnSbmt").click();

  // Give the request a moment to start
  await page.waitForTimeout(300);

  // Wait until either data rows appear or "No data" is shown
  await page.waitForFunction(() => {

    const tbody = document.querySelector("#example tbody");
    if (!tbody) return false;

    // No data message
    if (tbody.querySelector(".dataTables_empty")) {
      return true;
    }

    // At least one real row
    const rows = tbody.querySelectorAll("tr");

    for (const row of rows) {
      if (row.querySelectorAll("td").length > 1) {
        return true;
      }
    }

    return false;

  }, { timeout: 10000 });

  // No data
  if (await page.locator("#example td.dataTables_empty").count()) {
    return {
      searchId: id,
      rows: []
    };
  }

  const rows = await page.locator("#example tbody tr").evaluateAll(rows => {

    return rows.map(row => {

      const tds = [...row.querySelectorAll("td")];

      const get = i => tds[i]?.innerText.trim() ?? "";

      return {
        name: get(1),
        beneficiaryId: get(2),
        accountNo: get(3),
        ifsc: get(4),
        mobile: get(5),
        type: get(6),
        status: get(7)
      };
    });

  });

  return {
    searchId: id,
    rows
  };
}

module.exports = {
  searchBeneficiary
};
