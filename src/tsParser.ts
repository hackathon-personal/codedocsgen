import * as ts from "typescript";
import { FunctionDetails } from "./interface/IFunctionDetails";

const functions: FunctionDetails[] = [];
let sourceFile: ts.SourceFile | undefined = undefined;
function visit(node: ts.Node) {
  if (ts.isArrowFunction(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Arrow function1");
      const functionName =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
      console.log("functionName", functionName);

      const functionCode = node.getFullText();

      functions.push({ functionName, functionCode });
    }
  }

  if (ts.isFunctionDeclaration(node)) {
    console.log("Function Declaration");
    const functionName =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
    const functionCode = node.getText();
    functions.push({ functionName, functionCode });
  }

  if (ts.isFunctionExpression(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Function expression");
      const functionName =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
      const functionCode = node.getFullText();
      functions.push({ functionName, functionCode });
    }
  }

  if (ts.isMethodDeclaration(node)) {
    console.log("Method Declaration");

    const functionName =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
    const functionCode = node.getText();
    let className: string | undefined;
    const parentNode = node.parent;
    if (ts.isClassDeclaration(parentNode)) {
      className = parentNode?.name?.getText();
    }
    functions.push({ functionName, functionCode });
  }

  ts.forEachChild(node, visit);
}

function getFunction(codeString: string) {
  sourceFile = ts.createSourceFile(
    "detect.ts",
    codeString,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS
  );
  visit(sourceFile);

  console.log(functions);
  return functions;
}

const tsParser = {
  getFunction,
};

export default tsParser;
