const cliProgress = require("cli-progress");

const bar = new cliProgress.SingleBar(
  {
    format:
      " {bar} | {percentage}% | {value}/{total} | {id} | {status}",
    hideCursor: true,
    clearOnComplete: false,
    stopOnComplete: false,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
  },
  cliProgress.Presets.shades_classic
);

function startProgress(total) {
  bar.start(total, 0, { id: "---", status: "starting" });
}

function updateProgress(current, id, status) {
  bar.update(current, { id, status });
}

function stopProgress() {
  bar.stop();
}

module.exports = { startProgress, updateProgress, stopProgress };
