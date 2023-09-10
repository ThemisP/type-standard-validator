import tsv from "../src/index";

describe("Number range 1 < x < 10", () => {
  const numberSchema = tsv.number().min(1).max(10);
  it("1 should return a 1", () => {
    const input: any = 1;
    expect(numberSchema.validate(input)).toBe(1);
  });
  it("5 should return a 5", () => {
    const input: any = 5;
    expect(numberSchema.validate(input)).toBe(5);
  });
  it("10 should return a 10", () => {
    const input: any = 10;
    expect(numberSchema.validate(input)).toBe(10);
  });
  it("0 should return an error", () => {
    const input: any = 0;
    expect(() => numberSchema.validate(input)).toThrowError();
  });
  it("11 should return an error", () => {
    const input: any = 11;
    expect(() => numberSchema.validate(input)).toThrowError();
  });
});

describe("String range 1 < x < 10 characters long", () => {
  const stringSchema = tsv.string().min(1).max(10);
  it("'a' should return 'a'", () => {
    const input: any = "a";
    expect(stringSchema.validate(input)).toBe("a");
  });
  it("'abcde' should return 'abcde'", () => {
    const input: any = "abcde";
    expect(stringSchema.validate(input)).toBe("abcde");
  });
  it("'abcdefghij' should return 'abcdefghij'", () => {
    const input: any = "abcdefghij";
    expect(stringSchema.validate(input)).toBe("abcdefghij");
  });
  it("'' should return an error", () => {
    const input: any = "";
    expect(() => stringSchema.validate(input)).toThrowError();
  });
  it("'abcdefghijk' should return an error", () => {
    const input: any = "abcdefghijk";
    expect(() => stringSchema.validate(input)).toThrowError();
  });
});

describe("Array range 1 < x < 10 items long", () => {
  const arraySchema = tsv.array(tsv.number()).min(1).max(10);
  it("[1] should return [1]", () => {
    const input: any = [1];
    expect(arraySchema.validate(input)).toEqual([1]);
  });
  it("[1..5] should return [1..5]", () => {
    const input: any = [1, 2, 3, 4, 5];
    expect(arraySchema.validate(input)).toEqual([1, 2, 3, 4, 5]);
  });
  it("[1..10] should return [1..10]", () => {
    const input: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(arraySchema.validate(input)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  it("[] should return an error", () => {
    const input: any = [];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
  it("[1..11] should return an error", () => {
    const input: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
});