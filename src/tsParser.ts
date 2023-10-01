import * as ts from "typescript";

const functionDict: Map<string, string> = new Map();
function visit(node: ts.Node) {
  if (ts.isArrowFunction(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Arrow function");
      const functionName = node.parent.name.getText();
      const functionCode = node.getFullText();
      functionDict.set(functionName!, functionCode);
    }
  }

  if (ts.isFunctionDeclaration(node)) {
    console.log("Function Declaration");
    const functionName = node.name?.getText();
    const functionCode = node.getText();
    functionDict.set(functionName!, functionCode);
  }

  if (ts.isFunctionExpression(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Function expression");
      const functionName = node.parent.name.getText();
      const functionCode = node.getFullText();
      functionDict.set(functionName!, functionCode);
    }
  }

  if (ts.isMethodDeclaration(node)) {
    console.log("Method Declaration");

    const functionName = node.name?.getText();
    const functionCode = node.getText();
    let className: string | undefined;
    const parentNode = node.parent;
    if (ts.isClassDeclaration(parentNode)) {
      className = parentNode?.name?.getText();
    }
    console.log("Class name", className);
    if (className) {
      functionDict.set(`${className}#${functionName}`, functionCode);
    } else {
      functionDict.set(functionName, functionCode);
    }
  }

  ts.forEachChild(node, visit);
}

function getFunction(codeString: string) {
  const sourceFile = ts.createSourceFile(
    "detect.ts",
    codeString,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS
  );
  visit(sourceFile);

  console.log(functionDict);
  return functionDict;
}

const tsParser = {
  getFunction,
};

export default tsParser;
