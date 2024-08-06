import { type BabelFileResult, transform } from "@babel/core";
import { expect, test } from "vitest";
import babelBannerPlugin from ".";

const code1 = "response.payload.results[0].data";
test(code1, () => {
  // Arrange
  const source = code1;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("response?.payload?.results?.[0]?.data;");
});

const code2 = "const result = validateAdditionalMemo({}).isValid;";
test(code2, () => {
  // Arrange
  const source = code2;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("const result = validateAdditionalMemo({})?.isValid;");
});

const code3 = "console.log(obj.a.b.c.d);";
test(code3, () => {
  // Arrange
  const source = code3;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("(console?.log)(obj?.a?.b?.c?.d);");
});

const code4 = "window.location.href";
test(code4, () => {
  // Arrange
  const source = code4;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("window?.location?.href;");
});

const code5 = "if(process.env.APP_MODE === 'local'){}";
test(code5, () => {
  // Arrange
  const source = code5;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("if (process.env.APP_MODE === 'local') {}");
});

const code6 = "response.payload.result[0][event.id]";
test(code6, () => {
  // Arrange
  const source = code6;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("response?.payload?.result?.[0]?.[event?.id];");
});

const code7 = "const anotherResult = getData().x.y.z;";
test(code7, () => {
  // Arrange
  const source = code7;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("const anotherResult = (getData()?.x).y.z;");
});

const code8 = "let value = obj.a;";
test(code8, () => {
  // Arrange
  const source = code8;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("let value = obj?.a;");
});

const code9 = "const nodeEnv = process.NODE_ENV;";
test(code9, () => {
  // Arrange
  const source = code9;
  const options = { plugins: [babelBannerPlugin] };

  // Act
  const { code } = transform(source, options) as BabelFileResult;

  // Assert
  expect(code).toEqual("const nodeEnv = process.NODE_ENV;");
});
