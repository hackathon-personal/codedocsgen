import * as ts from "typescript";

function visit(node: ts.Node): string | undefined {
  if (ts.isArrowFunction(node)) {
    return node.parent.getText();
  }

  if (ts.isFunctionDeclaration(node)) {
    return node.getText();
  }

  return ts.forEachChild(node, visit);
}

function getFunction(codeString: string) {
  const sourceFile = ts.createSourceFile(
    "detect.ts",
    codeString,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS
  );

  return visit(sourceFile);
}

const tsParser = {
  getFunction,
};

export default tsParser;
