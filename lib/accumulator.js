
/**
 * Response time accumulator
 * @constructor
 * @param {object} opts - Necessary param object for initializing the accumulator
 * @param {string} opts.timeout - The timeout of all these response provided,
 * any data that is larger than timeout is going to be abandoned.
 * @param {array} opts.ratios - The ratios users want for split the statistics,
 * [0.1,0.2,0.9] means the accumulator should return the response time which
 * 10%/20%/90% responses out of all the responses have a res-time less than it.
 * The order of the ratios must be asc, or an error would be thrown.
 */
class ResTimeAccumulator {
  constructor({ timeout, ratios }) {
    if (!timeout || timeout < 0) {
      throw new Error('timeout should be a positive integer/long');
    }

    if (!ratios || !Array.isArray(ratios) || ratios.length < 1) {
      throw new Error('ratios must be provided');
    }

    ratios.reduce((p, n) => {
      if (n > 1 || n < 0) throw new Error('rations must be between 0 and 1');
      if (p > n) throw new Error('ratios\'s elements must be in asc order');
      return n;
    }, 0);

    this.timeout = timeout;
    this.ratios = ratios;
    this.dataArray = new Array(timeout).fill(0);
    this.totalCount = 0;
  }

  /**
   * Add a new data to the data set.
   * @param mills - Million seconds from 0 to the timeout provided by
   * constructor, any value out of the range is going to be ignored.
   */
  add(mills) {
    if (!mills || mills >= this.timeout || mills < 0) return;
    this.totalCount += 1;
    this.dataArray[mills] += 1;
  }

  /**
   * Calculate the results from all data.
   * @returns {Array} results - An array contains the specific value divided by ratios provided.
   */
  cal() {
    const edges = [];
    for (let i = 0; i < this.ratios.length; i += 1) {
      edges.push(Math.floor(this.totalCount * this.ratios[i]));
    }

    let t = 0;
    let pendingResultIndex = 0;
    const results = [];
    for (let i = 0; i < this.dataArray.length; i += 1) {
      if (results[this.ratios.length - 1]) break;
      t += this.dataArray[i];
      for (let j = pendingResultIndex; j < edges.length; j += 1) {
        if (t >= edges[j] && !results[j]) {
          results[j] = i;
          pendingResultIndex = j;
        }
      }
    }
    return results;
  }
}

module.exports = ResTimeAccumulator;
