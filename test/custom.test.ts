import tsv from "../src"


describe("String custom tests", () => {
  const emailSchema = tsv.string().email();
  it("Email: example@test should return an error", () => {
    const input: any = "example@test";
    expect(() => emailSchema.validate(input)).toThrowError();
  });
  it("Email: examplegmail.com should return an error", () => {
    const input: any = "examplegmail.com";
    expect(() => emailSchema.validate(input)).toThrowError();
  })
  it("Email: example@gmail.com should return example@gmail.com", () => {
    const input: any = "example@gmail.com";
    expect(emailSchema.validate(input)).toEqual("example@gmail.com");
  })

  const customSchema1 = tsv.string().custom(v => v + v);
  it("Custom: test should return testtest", () => {
    const input: any = "test";
    expect(customSchema1.validate(input)).toEqual("testtest");
  });

  const customSchema2 = tsv.string().custom(v => v + "-").custom(v => v + v);
  it("Custom: test should return test-test-", () => {
    const input: any = "test";
    expect(customSchema2.validate(input)).toEqual("test-test-");
  });

  const customSchemaOptional = tsv.string().custom(v => v + v).optional();
  it("Custom: undefined should return undefined (optional string)", () => {
    const input: any = undefined;
    expect(customSchemaOptional.validate(input)).toBeUndefined();
  });
  it("Custom: test should return testtest", () => {
    const input: any = "test";
    expect(customSchemaOptional.validate(input)).toEqual("testtest");
  });
});

describe("Number custom tests", () => {
  const customSchema1 = tsv.number().custom(v => v + v);
  it("Custom: 1 should return 2", () => {
    const input: any = 1;
    expect(customSchema1.validate(input)).toEqual(2);
  });
  it("Custom: 2 should return 4", () => {
    const input: any = 2;
    expect(customSchema1.validate(input)).toEqual(4);
  });

  const customSchema2 = tsv.number().custom(v => v + 1).custom(v => v + 1);
  it("Custom: 1 should return 3", () => {
    const input: any = 1;
    expect(customSchema2.validate(input)).toEqual(3);
  });
  it("Custom: 5 should return 7", () => {
    const input: any = 5;
    expect(customSchema2.validate(input)).toEqual(7);
  });

  const customSchemaOptional = tsv.number().custom(v => v + v).optional();
  it("Custom: undefined should return undefined (optional number)", () => {
    const input: any = undefined;
    expect(customSchemaOptional.validate(input)).toBeUndefined();
  });
  it("Custom: 1 should return 2", () => {
    const input: any = 1;
    expect(customSchemaOptional.validate(input)).toEqual(2);
  });
})

describe("Boolean custom tests", () => {
  const customSchema1 = tsv.boolean().custom(v => !v);
  it("Custom: true should return false", () => {
    const input: any = true;
    expect(customSchema1.validate(input)).toEqual(false);
  });
  it("Custom: false should return true", () => {
    const input: any = false;
    expect(customSchema1.validate(input)).toEqual(true);
  });

  const customSchema2 = tsv.boolean().custom(v => !v).custom(v => !v);
  it("Custom: true should return true", () => {
    const input: any = true;
    expect(customSchema2.validate(input)).toEqual(true);
  });
  it("Custom: false should return false", () => {
    const input: any = false;
    expect(customSchema2.validate(input)).toEqual(false);
  });

  const customSchemaOptional = tsv.boolean().custom(v => !v).optional();
  it("Custom: undefined should return undefined (optional boolean)", () => {
    const input: any = undefined;
    expect(customSchemaOptional.validate(input)).toBeUndefined();
  });
  it("Custom: true should return false", () => {
    const input: any = true;
    expect(customSchemaOptional.validate(input)).toEqual(false);
  });
});

describe("Array custom tests", () => {
  const customSchema1 = tsv.array(tsv.number())
    .custom(v => v.map((v: number) => v + v));
  it("Custom: [1,2,3] should return [2,4,6]", () => {
    const input: any = [1, 2, 3];
    expect(customSchema1.validate(input)).toEqual([2, 4, 6]);
  });
  it("Custom: [2,4,6] should return [4,8,12]", () => {
    const input: any = [2, 4, 6];
    expect(customSchema1.validate(input)).toEqual([4, 8, 12]);
  });

  const customSchema2 = tsv.array(tsv.number())
    .custom(v => v.map((v: number) => v + 1))
    .custom(v => v.map((v: number) => v + 1));
  it("Custom: [1,2,3] should return [3,4,5]", () => {
    const input: any = [1, 2, 3];
    expect(customSchema2.validate(input)).toEqual([3, 4, 5]);
  });
  it("Custom: [2,4,6] should return [4,5,6]", () => {
    const input: any = [2, 4, 6];
    expect(customSchema2.validate(input)).toEqual([4, 6, 8]);
  });

  const customSchemaOptional = tsv.array(tsv.number())
    .custom(v => v.map((v: number) => v + v)).optional();
  it("Custom: undefined should return undefined (optional array)", () => {
    const input: any = undefined;
    expect(customSchemaOptional.validate(input)).toBeUndefined();
  });
  it("Custom: [1,2,3] should return [2,4,6] (optional array)", () => {
    const input: any = [1, 2, 3];
    expect(customSchemaOptional.validate(input)).toEqual([2, 4, 6]);
  });
});

describe("Object custom tests", () => {
  const customSchema1 = tsv.object({
    foo: tsv.number(),
    bar: tsv.string()
  }).custom(v => ({
    foo: v.foo + v.foo,
    bar: v.bar + v.bar
  }));
  it("Custom: {foo: 1, bar: 'test'} should return {foo: 2, bar: 'testtest'}", () => {
    const input: any = { foo: 1, bar: "test" };
    expect(customSchema1.validate(input)).toEqual({ foo: 2, bar: "testtest" });
  });

  const customSchema2 = tsv.object({
    foo: tsv.number(),
    bar: tsv.string()
  }).custom(v => ({
    foo: v.foo + v.foo,
    bar: v.bar + v.bar
  })).custom(v => ({
    foo: v.foo + v.foo,
    bar: v.bar + v.bar
  }));
  it("Custom: {foo: 1, bar: 'test'} should return {foo: 4, bar: 'testtesttesttest'}", () => {
    const input: any = { foo: 1, bar: "test" };
    expect(customSchema2.validate(input)).toEqual({ foo: 4, bar: "testtesttesttest" });
  });
});