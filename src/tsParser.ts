import * as ts from "typescript";
import { FunctionDetails } from "./interface/IFunctionDetails";

let functions: FunctionDetails[] = [];
let sourceFile: ts.SourceFile | undefined = undefined;
function visit(node: ts.Node) {
  if (ts.isArrowFunction(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Arrow function1");
      let startPosition = ts.getLineAndCharacterOfPosition(
        sourceFile!,
        node.pos
      ).line + 1;

      if (startPosition > 1) {
        startPosition = startPosition - 1;
      }
      const endLine =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;
      const functionName = startPosition + "#" + endLine;
      const functionCode = node.getFullText();
      functions.push({ functionName, functionCode });
    }
  }

  if (ts.isFunctionDeclaration(node)) {
    console.log("Function Declaration");
    let startPosition =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
    if (startPosition > 1) {
      startPosition = startPosition + 1;
    }
    const endLine =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;

    const functionName = startPosition + "#" + endLine;
    const functionCode = node.getText();
    functions.push({ functionName, functionCode });
  }

  if (ts.isFunctionExpression(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Function expression");
      let startPosition = ts.getLineAndCharacterOfPosition(
        sourceFile!,
        node.pos
      ).line + 1;
      if (startPosition > 1) {
        startPosition = startPosition - 1;
      }
      const endLine =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;
      const functionName = startPosition + "#" + endLine;
      const functionCode = node.getFullText();
      functions.push({ functionName, functionCode });
    }
  }

  if (ts.isMethodDeclaration(node)) {
    console.log("Method Declaration");
    const startPosition = ts.getLineAndCharacterOfPosition(
      sourceFile!,
      node.pos
    ).line + 2 ;
    const endLine =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;
    const functionName = startPosition + "#" + endLine;
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
  functions = [];
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
