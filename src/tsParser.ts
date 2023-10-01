import * as ts from "typescript";


const functionDict : any = {}
function visit(node: ts.Node) {
  if (ts.isArrowFunction(node)) {
    console.log(node.parent.getText());
  }

  if (ts.isFunctionDeclaration(node)) {
    console.log( node.getText());
  }


  if (ts.isMethodDeclaration(node)) {
    const functionName = node.name?.getText()
    const functionCode = node.getText();

    functionDict[functionName] = functionCode ; 
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
  visit(sourceFile)

  console.log(functionDict)
  return functionDict;
}

const tsParser = {
  getFunction,
};

export default tsParser;
