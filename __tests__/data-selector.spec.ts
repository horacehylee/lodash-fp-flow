import { flow } from "lodash";

type DataSelector<T> = (row: T) => number;

const absDataSelector = <T>(dataSelector: DataSelector<T>): DataSelector<T> => (
  row: T
): number => {
  return Math.abs(dataSelector(row));
};

const negateDataSelector = <T>(
  dataSelector: DataSelector<T>
): DataSelector<T> => (row: T): number => {
  return -dataSelector(row);
};

describe("data-selector", () => {
  interface Row {
    value: number;
  }
  const valueSelector: DataSelector<Row> = row => row.value;

  interface TestOption {
    selector: DataSelector<Row>;
    cases: {
      input: Row;
      expectedOutput: number;
    }[];
  }

  const _it = (description: string, { selector, cases }: TestOption) => {
    return it(description, () => {
      cases.forEach(({ input, expectedOutput }) => {
        expect(selector(input)).toEqual(expectedOutput);
      });
    });
  };

  describe("combine selector", () => {
    const _describe = (
      description: string,
      { selectors }: { selectors: DataSelector<Row>[] }
    ) => {
      return describe(description, () => {
        _it("should apply absolute then negate to value", {
          selector: selectors[0],
          cases: [
            { input: { value: -99.221178 }, expectedOutput: -99.221178 },
            { input: { value: 235 }, expectedOutput: -235 }
          ]
        });

        _it("should apply negative then absolute to value", {
          selector: selectors[1],
          cases: [
            { input: { value: -99.221178 }, expectedOutput: 99.221178 },
            { input: { value: 235 }, expectedOutput: 235 }
          ]
        });
      });
    };

    _describe("lodash flow chaining", {
      selectors: [
        flow(
          absDataSelector,
          negateDataSelector
        )(valueSelector),
        flow(
          negateDataSelector,
          absDataSelector
        )(valueSelector)
      ]
    });

    _describe("default chaining", {
      selectors: [
        negateDataSelector(absDataSelector(valueSelector)),
        absDataSelector(negateDataSelector(valueSelector))
      ]
    });
  });

  describe("indiviual selector", () => {
    describe("absDataSelector", () => {
      _it("should return absolute value of value", {
        selector: absDataSelector(valueSelector),
        cases: [
          { input: { value: -99.221178 }, expectedOutput: 99.221178 },
          { input: { value: 235 }, expectedOutput: 235 }
        ]
      });
    });

    describe("negateDataSelector", () => {
      _it("should negate value of value", {
        selector: negateDataSelector(valueSelector),
        cases: [
          { input: { value: -99.221178 }, expectedOutput: 99.221178 },
          { input: { value: 235 }, expectedOutput: -235 }
        ]
      });
    });
  });
});
