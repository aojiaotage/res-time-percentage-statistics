
const readline = require('readline');

const Accumulator = require('./lib/accumulator');

function extractParams() {
  return {
    timeout: 120000,
    ratios: [0.9, 0.95, 0.99],
  };
}

const opts = extractParams();

const accumulator = new Accumulator(opts);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function onLine(data) {
  accumulator.add(data);
}

function genResults() {
  const results = accumulator.cal();
  for (let i = 0; i < accumulator.ratios.length; i += 1) {
    console.log(
      `${accumulator.ratios[i]
      * 100}% of data are within ${results[i]}`,
    );
  }
}

rl.on('line', onLine);

rl.on('close', genResults);

module.exports = {
  onLine,
  genResults,
};
