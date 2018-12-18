const { expect } = require('chai');

const Accumulator = require('../../lib/accumulator');

describe('Accumulator#constructor', () => {
  describe('param check', () => {
    it('should throw on no opts provided', () => {
      expect(() => new Accumulator()).to.throw();
    });

    describe('timeout check', () => {
      it('should throw on no timeout', () => {
        expect(() => new Accumulator({})).to.throw();
      });

      it('should throw on negative timeout', () => {
        expect(() => new Accumulator({ timeout: -1 })).to.throw();
      });

      it('should throw on 0 timeout', () => {
        expect(() => new Accumulator({ timeout: 0 })).to.throw();
      });
    });

    describe('ratio check', () => {
      it('should throw on no ratio', () => {
        expect(() => new Accumulator({ timeout: 1 })).to.throw();
      });

      it('should throw on non-array ratios', () => {
        expect(() => new Accumulator({ timeout: 1, ratios: {} })).to.throw();
      });

      it('should throw on ratios without asc order', () => {
        expect(() => new Accumulator({ timeout: 1, ratios: [0.1, 0.05, 0.2] }))
          .to
          .throw();
      });

      it('should throw on ratio out range of [0,1]', () => {
        expect(() => new Accumulator({ timeout: 1, ratios: [-1, 0.05, 0.2] }))
          .to
          .throw();
      });
    });

    it('should not throw on valid opts', () => {
      expect(() => new Accumulator({ timeout: 1, ratios: [0.01, 0.05, 0.2] }))
        .not
        .to
        .throw();
    });
  });
});

describe('Accumulator#add', () => {
  let acc;

  beforeEach(() => {
    acc = new Accumulator({ timeout: 10, ratios: [0.1, 0.5, 0.9] });
  });

  describe('param check', () => {

    it('should ignore on no mills', () => {
      acc.add();
      expect(acc.totalCount).to.equal(0);
    });

    it('should ignore on non positive mills', () => {
      acc.add(-1);
      acc.add(0);
      expect(acc.totalCount).to.equal(0);
    });

    it('should ignore on mills greater or equal than timeout', () => {
      acc.add(10);
      acc.add(11);
      expect(acc.totalCount).to.equal(0);
    });

  });

  it('should add totalCount', () => {
    acc.add(1);
    expect(acc.totalCount).to.equal(1);
  });

  it(
    'should increase value of the slot the mill represents in the data array by 1',
    () => {
      const mills = 1;
      acc.add(mills);
      expect(acc.dataArray[mills]).to.equal(1);
    });

});

describe('Accumulator#cal', () => {
  describe('should return the right answer', () => {

    const valueResultSets = [
      {
        opts: {
          timeout: 10,
          ratios: [0.1, 0.5, 0.9],
        },
        values: new Array(10).fill(1),
        expected: [1, 1, 1],
      },
      {
        opts: {
          timeout: 10,
          ratios: [0.1, 0.5, 0.9],
        },
        values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        expected: [1, 1, 1],
      },
      {
        opts: {
          timeout: 10,
          ratios: [0.1, 0.5, 0.9],
        },
        values: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
        expected: [1, 1, 2],
      },
    ];

    for (let i = 0; i < valueResultSets.length; i += 1) {
      const { values, expected, opts } = valueResultSets[i];
      it(`test input: ${values}, output:${expected}`, () => {
        const acc = new Accumulator(opts);
        values.map(v => acc.add(v));
        expect(acc.cal()).deep.to.equal(expected);
      });
    }
  });
});
