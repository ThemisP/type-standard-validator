import tsv from "../src/index";

describe("Array schema numbers", () => {
  const arraySchema = tsv.array(tsv.number());
  it("[1] should return [1]", () => {
    const input: any = [1];
    expect(arraySchema.validate(input)).toEqual([1]);
  });
  it("[1..5] should return [1..5]", () => {
    const input: any = [1, 2, 3, 4, 5];
    expect(arraySchema.validate(input)).toEqual([1, 2, 3, 4, 5]);
  });
  it("[] should return []", () => {
    const input: any = [];
    expect(arraySchema.validate(input)).toEqual([]);
  });
  it("[1, 'test'] should return an error", () => {
    const input: any = [1, "test"];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
  it("[1, '2'] should return [1, 2]", () => {
    const input: any = [1, "2"];
    expect(arraySchema.validate(input)).toEqual([1, 2]);
  });
});

describe("Array schema strings", () => {
  const arraySchema = tsv.array(tsv.string());
  it("['a'] should return ['a']", () => {
    const input: any = ["a"];
    expect(arraySchema.validate(input)).toEqual(["a"]);
  });
  it("['a'..'e'] should return ['a'..'e']", () => {
    const input: any = ["a", "b", "c", "d", "e"];
    expect(arraySchema.validate(input)).toEqual(["a", "b", "c", "d", "e"]);
  });
  it("[] should return []", () => {
    const input: any = [];
    expect(arraySchema.validate(input)).toEqual([]);
  });
  it("['a', 1] should return an error", () => {
    const input: any = ["a", 1];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
});

describe("Array schema boolean", () => {
  const arraySchema = tsv.array(tsv.boolean());
  it("[true] should return [true]", () => {
    const input: any = [true];
    expect(arraySchema.validate(input)).toEqual([true]);
  });
  it("[true,false] should return [true,false]", () => {
    const input: any = [true, false];
    expect(arraySchema.validate(input)).toEqual([true, false]);
  });
  it("[] should return []", () => {
    const input: any = [];
    expect(arraySchema.validate(input)).toEqual([]);
  });
  it("[true, 1] should return an error", () => {
    const input: any = [true, 1];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
  it("[true, 'test'] should return an error", () => {
    const input: any = [true, "test"];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
  it("[true, 'false'] should return [true, false]", () => {
    const input: any = [true, "false"];
    expect(arraySchema.validate(input)).toEqual([true, false]);
  });
});

describe("Array schema objects", () => {
  const arraySchema = tsv.array(tsv.object({
    foo: tsv.string(),
    bar: tsv.number().optional(),
  }));
  it("[{ foo: 'test' }] should return [{ foo: 'test' }]", () => {
    const input: any = [{ foo: "test" }];
    expect(arraySchema.validate(input)).toEqual([{ foo: "test" }]);
  });
  it("[{ foo: 'test', bar: 1 }] should return [{ foo: 'test', bar: 1 }]", () => {
    const input: any = [{ foo: "test", bar: 1 }];
    expect(arraySchema.validate(input)).toEqual([{ foo: "test", bar: 1 }]);
  });
  it("[{ foo: 'test', bar: 'test' }] should return an error", () => {
    const input: any = [{ foo: "test", bar: "test" }];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
  it("[{ foo: 'test' }, { foo: 'test' }] should return [{ foo: 'test' }, { foo: 'test' }]", () => {
    const input: any = [{ foo: "test" }, { foo: "test" }];
    expect(arraySchema.validate(input)).toEqual([{ foo: "test" }, { foo: "test" }]);
  });
  it("[{ foo: 'test' }, { foo: 'test', bar: 1 }] should return [{ foo: 'test' }, { foo: 'test', bar: 1 }]", () => {
    const input: any = [{ foo: "test" }, { foo: "test", bar: 1 }];
    expect(arraySchema.validate(input)).toEqual([{ foo: "test" }, { foo: "test", bar: 1 }]);
  });
  it("[{}, { bar: 1 }] should return an error", () => {
    const input: any = [{}, { bar: 1 }];
    expect(() => arraySchema.validate(input)).toThrowError();
  });
});