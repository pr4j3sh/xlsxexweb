# xlsxexweb

`xlsx` web extractor

- install deps

```bash
npm i
```

- start browser

```bash
brave --remote-debugging-port=9222
```

- run script

```bash
npm start
# Or specify sheet and column:
npm start -- --sheet "Sheet2" --column B
# Show help:
npm start -- -h
```

`--sheet` accepts a worksheet name. `--column` accepts a letter (A, B, C...). Both are optional.
