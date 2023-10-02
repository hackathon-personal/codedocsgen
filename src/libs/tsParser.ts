import * as vscode from "vscode";
import * as ts from "typescript";
import { FunctionDetails } from "../interface/IFunctionDetails";

let functions: FunctionDetails[] = [];
let sourceFile: ts.SourceFile | undefined = undefined;
function visit(node: ts.Node) {
  if (ts.isArrowFunction(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Arrow function1");
      const functionCode = node.getFullText();
      const endLine =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;
      let startPosition =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;

      if (startPosition > 1) {
        startPosition = startPosition - 1;
      } else {
        startPosition = ignoreImports(functionCode, startPosition, endLine);
      }

      const functionName = startPosition + "#" + endLine;
      functions.push({ functionName, functionCode });
    }
  }

  if (ts.isFunctionDeclaration(node)) {
    console.log("Function Declaration");
    const functionCode = node.getText();
    const endLine =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;

    let startPosition =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
    if (startPosition > 1) {
      startPosition = startPosition + 1;
    } else {
      startPosition = ignoreImports(node.getText(), startPosition, endLine);
    }

    const functionName = startPosition + "#" + endLine;

    functions.push({ functionName, functionCode });
  }

  if (ts.isFunctionExpression(node)) {
    if (ts.isVariableDeclaration(node.parent)) {
      console.log("Function expression");
      const endLine =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.end).line + 1;
      const functionCode = node.getFullText();
      let startPosition =
        ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 1;
      if (startPosition > 1) {
        startPosition = startPosition - 1;
      } else {
        startPosition = ignoreImports(functionCode, startPosition, endLine);
      }

      const functionName = startPosition + "#" + endLine;

      functions.push({ functionName, functionCode });
    }
  }

  if (ts.isMethodDeclaration(node)) {
    console.log("Method Declaration");
    const startPosition =
      ts.getLineAndCharacterOfPosition(sourceFile!, node.pos).line + 2;
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

// ignore imports and get the start position of the function
function ignoreImports(
  functionCode: string,
  startPosition: number,
  endPosition: number
) {
  console.log("Ignore Imports");
  const editor = vscode.window.activeTextEditor;
  let extractedFunctionCode = "";
  for (
    let lineNumber = endPosition;
    lineNumber >= startPosition;
    lineNumber--
  ) {
    const line = editor?.document.lineAt(lineNumber).text;
    extractedFunctionCode = line + "\n" + extractedFunctionCode;
    if (extractedFunctionCode.includes(functionCode)) {
      return lineNumber;
    }
  }
  return startPosition;
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
