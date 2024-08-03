import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url"; // 👈 추가

const __dirname = fileURLToPath(new URL(".", import.meta.url)); // 👈 추가
const code = fs.readFileSync(path.resolve(__dirname, "code.mjs"), "utf8");

const ast = parse(code, {
  sourceType: "module",
  plugins: ["typescript", "jsx"],
});
traverse.default(ast, {
  MemberExpression(path) {
    // 이미 옵셔널 체이닝이 있는 경우 무시
    if (path.node.optional) return;

    // 현재 노드의 루트 객체 탐색
    let current = path.node.object;

    // CallExpression이 루트일 경우 옵셔널 체이닝 처리
    if (t.isCallExpression(current)) {
      path.replaceWith(
        t.optionalMemberExpression(
          path.node.object,
          path.node.property,
          path.node.computed,
          true
        )
      );
      return;
    }

    // 일반적인 루트 객체 탐색
    while (t.isMemberExpression(current)) {
      current = current.object;
    }

    // 루트 객체에 옵셔널 체이닝 적용 (식별자 또는 this 표현식인 경우)
    if (t.isIdentifier(current) || t.isThisExpression(current)) {
      // 루트부터 각 단계에 대해 옵셔널 체이닝 추가
      const newObject = t.optionalMemberExpression(
        path.node.object,
        path.node.property,
        path.node.computed,
        true
      );

      // 기존 노드를 새 옵셔널 체이닝 노드로 교체
      path.replaceWith(newObject);
    }
  },
});

console.log(generate.default(ast).code);
