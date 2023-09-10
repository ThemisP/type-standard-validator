import tsv from "../src/index";

describe("Object schema (strict keys)", () => {
  const objectSchema = tsv.object({
    foo: tsv.string(),
    bar: tsv.number(),
  });
  it("{ foo: 'test', bar: 1 } should return { foo: 'test', bar: 1 }", () => {
    const input: any = { foo: "test", bar: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", bar: 1 });
  });
  it("{ foo: 'test', bar: 'test' } should return an error", () => {
    const input: any = { foo: "test", bar: "test" };
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  it("{ foo: 'test' } should return an error", () => {
    const input: any = { foo: "test" };
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  it("{ bar: 1 } should return an error", () => {
    const input: any = { bar: 1 };
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  it("{} should return an error", () => {
    const input: any = {};
    expect(() => objectSchema.validate(input)).toThrowError();
  });
});

describe("Object schema (unknown keys)", () => {
  const objectSchema = tsv.object({}).unknown(true);
  it("{ foo: 1 } should return { foo: 1 }", () => {
    const input: any = { foo: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: 1 });
  });
  it("{ foo: 'test' } should return { foo: 'test' }", () => {
    const input: any = { foo: "test" };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test" });
  });
  it("{ foo: 'test', bar: 1 } should return { foo: 'test', bar: 1 }", () => {
    const input: any = { foo: "test", bar: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", bar: 1 });
  });
});

describe("Object schema (optional keys)", () => {
  const objectSchema = tsv.object({
    foo: tsv.string().optional(),
    bar: tsv.number().optional(),
  });
  it("{ foo: 'test' } should return { foo: 'test' }", () => {
    const input: any = { foo: "test" };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test" });
  });
  it("{ bar: 1 } should return { bar: 1 }", () => {
    const input: any = { bar: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ bar: 1 });
  });
  it("{ foo: 'test', bar: 1 } should return { foo: 'test', bar: 1 }", () => {
    const input: any = { foo: "test", bar: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", bar: 1 });
  });
  it("{} should return {}", () => {
    const input: any = {};
    expect(objectSchema.validate(input)).toStrictEqual({});
  });
  it("{ foo: 1 } should return an error", () => {
    const input: any = { foo: 1 };
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  it("{ bar: 'test' } should return an error", () => {
    const input: any = { bar: "test" };
    expect(() => objectSchema.validate(input)).toThrowError();
  });
});

describe("Object schema (required, optional and unknown keys)", () => {
  const objectSchema = tsv.object({
    foo: tsv.string(),
    bar: tsv.number().optional(),
  }).unknown(true);
  it("{ foo: 'test' } should return { foo: 'test' }", () => {
    const input: any = { foo: "test" };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test" });
  });
  it("{ foo: 'test', bar: 1 } should return { foo: 'test', bar: 1 }", () => {
    const input: any = { foo: "test", bar: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", bar: 1 });
  });
  it("{ foo: 'test', bar: 'test' } should return an error", () => {
    const input: any = { foo: "test", bar: "test" };
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  it("{ foo: 'test', bar: 1, baz: 1 } should return { foo: 'test', bar: 1, baz: 1 }", () => {
    const input: any = { foo: "test", bar: 1, baz: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", bar: 1, baz: 1 });
  });
  it("{ foo: 'test', bar: 1, baz: 'test' } should { foo: 'test', bar: 1, baz: 'test' }", () => {
    const input: any = { foo: "test", bar: 1, baz: "test" };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", bar: 1, baz: "test" });
  });
  it("{} should return an error", () => {
    const input: any = {};
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  it("{ foo: 'test', baz: 1 } should return { foo: 'test', baz: 1 }", () => {
    const input: any = { foo: "test", baz: 1 };
    expect(objectSchema.validate(input)).toStrictEqual({ foo: "test", baz: 1 });
  });
});

describe("Nested Object schema", () => {
  const nestedObjectSchema = tsv.object({
    foo: tsv.string(),
    bar: tsv.object({
      baz: tsv.number(),
    })
  });

  it("{ foo: 'test', bar: { baz: 1 } } should return { foo: 'test', bar: { baz: 1 } }", () => {
    const input: any = { foo: "test", bar: { baz: 1 } };
    expect(nestedObjectSchema.validate(input)).toStrictEqual({ foo: "test", bar: { baz: 1 } });
  });
  it("{ foo: 'test', bar: { baz: 'test' } } should return an error", () => {
    const input: any = { foo: "test", bar: { baz: "test" } };
    expect(() => nestedObjectSchema.validate(input)).toThrowError();
  });
  it("{ foo: 'test', bar: { baz: 1, qux: 1 } } should return an error", () => {
    const input: any = { foo: "test", bar: { baz: 1, qux: 1 } };
    expect(() => nestedObjectSchema.validate(input)).toThrowError();
  });
});

describe("Nested Object schema (required, optional and unknown keys)", () => {
  const nestedObjectSchema = tsv.object({
    foo: tsv.string(),
    bar: tsv.object({
      baz: tsv.number(),
      qux: tsv.number().optional(),
    }).unknown(true)
  });
  it("{ foo: 'test', bar: { baz: 1 } } should return { foo: 'test', bar: { baz: 1 } }", () => {
    const input: any = { foo: "test", bar: { baz: 1 } };
    expect(nestedObjectSchema.validate(input)).toStrictEqual({ foo: "test", bar: { baz: 1 } });
  });
  it("{ foo: 'test', bar: { baz: 'test' } } should return an error", () => {
    const input: any = { foo: "test", bar: { baz: "test" } };
    expect(() => nestedObjectSchema.validate(input)).toThrowError();
  });
  it("{ foo: 'test', bar: { baz: 1, qux: 1 } } should return { foo: 'test', bar: { baz: 1, qux: 1 } }", () => {
    const input: any = { foo: "test", bar: { baz: 1, qux: 1 } };
    expect(nestedObjectSchema.validate(input)).toStrictEqual({ foo: "test", bar: { baz: 1, qux: 1 } });
  });
  it("{ foo: 'test', bar: { baz: 1, qux: 'test' } } should return an error", () => {
    const input: any = { foo: "test", bar: { baz: 1, qux: "test" } };
    expect(() => nestedObjectSchema.validate(input)).toThrowError();
  });
  it("{ foo: 'test', bar: { baz: 1, qux: 1, quux: 1 } } should return { foo: 'test', bar: { baz: 1, qux: 1, quux: 1 } }", () => {
    const input: any = { foo: "test", bar: { baz: 1, qux: 1, quux: 1 } };
    expect(nestedObjectSchema.validate(input)).toStrictEqual({ foo: "test", bar: { baz: 1, qux: 1, quux: 1 } });
  });
  it("{ foo: 'test', qux: 1, bar: { baz: 1 } } should return an error", () => {
    const input: any = { foo: "test", qux: 1, bar: { baz: 1 } };
    expect(() => nestedObjectSchema.validate(input)).toThrowError();
  });
});