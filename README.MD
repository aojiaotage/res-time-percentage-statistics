[![Build Status](https://travis-ci.org/aojiaotage/res-time-percentage-statistics.svg?branch=master)](https://travis-ci.org/aojiaotage/res-time-percentage-statistics)

### Introduction

This tool helps to calculate the statistics of millions of response-time-like data within several seconds.
It's written in Node.js and is extremely easy to use in a *nix pipe style. Something like：

    format-data-somehow | node index.js

### Input

Data should be provided in valid integer, one integer per line.

Response-time-like data means data that are in a certain range, all the mill seconds from 0 to the timeout, for example, and the algorithm goes fastest when most of the numbers are in the beginning part of the range.

### Output

After no more data are passed to the tool, the final result will be output to the stdout, in a form like

    90% of the numbers are under 12000
    95% of the numbers are under 22000
    99% of the numbers are under 52000

### Test
To run test, please install dev dependencies via:

    npm install

Then run:

    npm run test

For coverage info, run:

    npm run test-cov

### Performance
The algorithm of `cal()` function implements has a basic hypothesis that most of the response time are under a certain value, and few response times are above that value, so most of the response time accumulates in the starting edge of the  inner data array whose index represents the mills of a response time.

So if the data matches that distribution, the calculation could be very fast.

With a single core of `Intel(R) Xeon(R) CPU E5-2650 v2 @ 2.60GHz`, and data set of 9,000,000 response time like:

    90% of data are within 42
    95% of data are within 1484
    99% of data are within 16958

The calculate process took 4ms +/- 1ms.

But more detailed benchmark is yet to run.

The current bottleneck is to read&add data to the accumulator, which could be several seconds under the situation mentioned before.
