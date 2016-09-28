/* @flow */

type Bucket = {
  le: number,
  val: number
};

class SimpleHistogram {
  buckets: Array<Bucket>;
  sum: number;

  // TODO check sorting or sort
  constructor(buckets: Array<number>) {
    this.buckets = buckets.map(le => ({ le, val: 0 })).concat([{ le: Infinity, val: 0 }]);
    this.sum = 0;
  }

  observe(val: number): void {
    this.sum += val;

    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];

      if (val <= bucket.le) {
        bucket.val++;
      }
    }
  }
}

export default SimpleHistogram;
