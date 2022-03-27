import { jest } from "@jest/globals";
import { suggestify } from "../src/main";

describe("get the text you meant", () => {
  jest.setTimeout(60 * 1000);

  it(`got some text:`, async () => {
    const result = await suggestify(
      //"what hath god wrought todayor tomorrow",
      "what hath god wrought on this strange day is so very strange\n\nwhat hath god wrought on this strange day is so very strange\nso do you like stuff",
    );
    console.log(result);
    expect(result).not.toBe("");
  });
});
