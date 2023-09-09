import tsv from "../src/index";

describe("String validator", () => {
  const strSchema = tsv.string();

  it("'test' should return a 'test'", () => {
    const input: any = "test";
    expect(strSchema.validate(input)).toBe("test");
  });

  it("1 should return an error", () => {
    const input: any = 1;
    expect(() => strSchema.validate(input)).toThrowError();
  });

  it("true should return an error", () => {
    const input: any = true;
    expect(() => strSchema.validate(input)).toThrowError();
  });

  it("null should return an error", () => {
    const input: any = null;
    expect(() => strSchema.validate(input)).toThrowError();
  });

  it("undefined should return an error", () => {
    const input: any = undefined;
    expect(() => strSchema.validate(input)).toThrowError();
  });

  it("[] should return an error", () => {
    const input: any = [];
    expect(() => strSchema.validate(input)).toThrowError();
  });

  it("{} should return an error", () => {
    const input: any = {};
    expect(() => strSchema.validate(input)).toThrowError();
  });

  const strSchemaOptional = tsv.string().optional();
  it("undefined should return undefined (optional string)", () => {
    const input: any = undefined;
    expect(strSchemaOptional.validate(input)).toBeUndefined();
  });
})

describe("Number validator", () => {
  const numberSchema = tsv.number();
  it("1 should return a 1", () => {
    const input: any = 1;
    expect(numberSchema.validate(input)).toBe(1);
  });
  
  it("'test' should return an error", () => {
    const input: any = "test";
    expect(() => numberSchema.validate(input)).toThrowError();
  });

  it("true should return an error", () => {
    const input: any = true;
    expect(() => numberSchema.validate(input)).toThrowError();
  });

  it("null should return an error", () => {
    const input: any = null;
    expect(() => numberSchema.validate(input)).toThrowError();
  });

  it("undefined should return an error", () => {
    const input: any = undefined;
    expect(() => numberSchema.validate(input)).toThrowError();
  });

  it("[] should return an error", () => {
    const input: any = [];
    expect(() => numberSchema.validate(input)).toThrowError();
  });

  it("{} should return an error", () => {
    const input: any = {};
    expect(() => numberSchema.validate(input)).toThrowError();
  });

  const numberSchemaOptional = tsv.number().optional();
  it("undefined should return undefined (optional number)", () => {
    const input: any = undefined;
    expect(numberSchemaOptional.validate(input)).toBeUndefined();
  });
})

describe("Array validator", () => {
  const arraySchema = tsv.array(tsv.number());
  it("[] should return a []", () => {
    const input: any = [];
    expect(arraySchema.validate(input)).toStrictEqual([]);
  });

  it("1 should return an error", () => {
    const input: any = 1;
    expect(() => arraySchema.validate(input)).toThrowError();
  });
  
  it("'test' should return an error", () => {
    const input: any = "test";
    expect(() => arraySchema.validate(input)).toThrowError();
  });

  it("true should return an error", () => {
    const input: any = true;
    expect(() => arraySchema.validate(input)).toThrowError();
  });

  it("null should return an error", () => {
    const input: any = null;
    expect(() => arraySchema.validate(input)).toThrowError();
  });

  it("undefined should return an error", () => {
    const input: any = undefined;
    expect(() => arraySchema.validate(input)).toThrowError();
  });

  it("{} should return an error", () => {
    const input: any = {};
    expect(() => arraySchema.validate(input)).toThrowError();
  });

  const arraySchemaOptional = tsv.array(tsv.number()).optional();
  it("undefined should return undefined (optional number)", () => {
    const input: any = undefined;
    expect(arraySchemaOptional.validate(input)).toBeUndefined();
  });
});

describe("Object validator", () => {
  const objectSchema = tsv.object({});
  it("{} should return a {}", () => {
    const input: any = {};
    expect(objectSchema.validate(input)).toStrictEqual({});
  });

  it("1 should return an error", () => {
    const input: any = 1;
    expect(() => objectSchema.validate(input)).toThrowError();
  });
  
  it("'test' should return an error", () => {
    const input: any = "test";
    expect(() => objectSchema.validate(input)).toThrowError();
  });

  it("true should return an error", () => {
    const input: any = true;
    expect(() => objectSchema.validate(input)).toThrowError();
  });

  it("[] should return an error", () => {
    const input: any = [];
    expect(() => objectSchema.validate(input)).toThrowError();
  });

  it("null should return an error", () => {
    const input: any = null;
    expect(() => objectSchema.validate(input)).toThrowError();
  });

  it("undefined should return an error", () => {
    const input: any = undefined;
    expect(() => objectSchema.validate(input)).toThrowError();
  });

  const objectSchemaOptional = tsv.object({}).unknown(true);
  it("{ foo: 1 } should return { foo: 1 } (unknown keys)", () => {
    const input: any = { foo: 1 };
    expect(objectSchemaOptional.validate(input)).toStrictEqual({ foo: 1 });
  });
});