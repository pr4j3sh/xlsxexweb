function parseArgs(argv = process.argv.slice(2)) {
  if (argv.includes("-h") || argv.includes("--help")) {
    console.log(`
Usage: npm start [options]

Options:
  --sheet <name>    Worksheet name (default: Sheet1)
  --column <letter> Column letter, e.g. A, B, C (default: A)
  -h, --help        Show this help message

Examples:
  npm start
  npm start -- --sheet "Sheet2" --column B
`);
    process.exit(0);
  }

  const args = { sheet: "Sheet1", column: "A" };

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--sheet" && argv[i + 1]) {
      args.sheet = argv[++i];
    } else if (argv[i] === "--column" && argv[i + 1]) {
      args.column = argv[++i].toUpperCase();
    }
  }

  return args;
}

module.exports = { parseArgs };
