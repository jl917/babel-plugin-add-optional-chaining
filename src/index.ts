import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export default function () {
  return {
    visitor: {
      MemberExpression(path: NodePath<t.MemberExpression>) {
        // 이미 옵셔널 체이닝이 있는 경우 무시
        if (path.node.optional) return;

        // 현재 노드가 AssignmentExpression의 왼쪽이거나 UpdateExpression의 인수일 경우 무시
        if (
          path.parentPath.isAssignmentExpression({ left: path.node }) ||
          path.parentPath.isUpdateExpression({ argument: path.node })
        ) {
          return;
        }

        // 현재 노드의 루트 객체 탐색
        let current = path.node.object;
        let shouldReplace = false;

        // CallExpression이 루트일 경우 옵셔널 체이닝 처리
        if (t.isCallExpression(current)) {
          shouldReplace = true;
        }

        // 일반적인 루트 객체 탐색
        while (t.isMemberExpression(current)) {
          if (current.optional) return; // 이미 옵셔널 체이닝이 있는 경우
          current = current.object;
        }

        // 변수를 통해 객체 리터럴을 탐색하기 위해 parent 객체를 확인
        const parent = path.findParent((p) => p.isVariableDeclarator());

        // 객체 리터럴이 아닌 경우에만 적용 (예: function 호출의 반환값에 대해)
        if (
          (t.isIdentifier(current) || t.isThisExpression(current)) &&
          (!parent || !t.isObjectExpression(parent.node))
        ) {
          shouldReplace = true;
        }

        // 루트부터 각 단계에 대해 옵셔널 체이닝 추가
        if (shouldReplace) {
          const newObject = t.optionalMemberExpression(
            path.node.object,
            path.node.property as t.Expression,
            path.node.computed,
            true
          );

          // 기존 노드를 새 옵셔널 체이닝 노드로 교체
          path.replaceWith(newObject);
        }
      },
    },
  };
}
