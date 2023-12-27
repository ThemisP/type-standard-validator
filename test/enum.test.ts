import tsv from "../src/index";

describe("String whitelist/blacklist", () => {
  const whitelistSchema = tsv.string().whitelist(["a", "b"]);
  it("'a' should return 'a'", () => {
    const input: any = "a";
    expect(whitelistSchema.validate(input)).toEqual("a");
  });
  it("'b' should return 'b'", () => {
    const input: any = "b";
    expect(whitelistSchema.validate(input)).toEqual("b");
  });
  it("'d' should return an error", () => {
    const input: any = "d";
    expect(() => whitelistSchema.validate(input)).toThrowError();
  });

  const blacklistSchema = tsv.string().blacklist(["a", "b"]);
  it("'a' should return an error", () => {
    const input: any = "a";
    expect(() => blacklistSchema.validate(input)).toThrowError();
  });
  it("'b' should return an error", () => {
    const input: any = "b";
    expect(() => blacklistSchema.validate(input)).toThrowError();
  });
  it("'d' should return 'd'", () => {
    const input: any = "d";
    expect(blacklistSchema.validate(input)).toEqual("d");
  });
});


describe("Number whitelist/blacklist", () => {
  const whitelistSchema = tsv.number().whitelist([1, 2]);
  it("1 should return 1", () => {
    const input: any = 1;
    expect(whitelistSchema.validate(input)).toEqual(1);
  });
  it("2 should return 2", () => {
    const input: any = 2;
    expect(whitelistSchema.validate(input)).toEqual(2);
  });
  it("3 should return an error", () => {
    const input: any = 3;
    expect(() => whitelistSchema.validate(input)).toThrowError();
  });
  const blacklistSchema = tsv.number().blacklist([1, 2]);
  it("1 should return an error", () => {
    const input: any = 1;
    expect(() => blacklistSchema.validate(input)).toThrowError();
  });
  it("2 should return an error", () => {
    const input: any = 2;
    expect(() => blacklistSchema.validate(input)).toThrowError();
  });
  it("3 should return 3", () => {
    const input: any = 3;
    expect(blacklistSchema.validate(input)).toEqual(3);
  });
});