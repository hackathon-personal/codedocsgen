import * as vscode from "vscode";
import apiService from "../service/apiService";
import tsParser from "../tsParser";

const generateDocs = vscode.commands.registerCommand(
  "codedocsgen.generateDocs",
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const cursorPosition = editor.selection.active;

      let textFromCursorToEnd = document.getText();

      if (textFromCursorToEnd) {
        const parsedFunctions = tsParser.getFunction(textFromCursorToEnd);
        console.log("parsedFunctions", parsedFunctions);

        if (parsedFunctions.length > 0) {
          try {
            let selectedFunc = [];
            let selectedFuncStartPos: number | null = null;
            for (const funcObj of parsedFunctions) {
              const [startPos, endPos]: any = funcObj.functionName?.split("#");
              selectedFuncStartPos = parseInt(startPos);
              console.log(startPos, endPos, cursorPosition.line);
              if (
                parseInt(startPos) <= cursorPosition.line + 1 &&
                cursorPosition.line + 1 <= parseInt(endPos)
              ) {
                selectedFunc.push(funcObj);
                break;
              }
            }
            console.log(selectedFunc);
            let responseDocs = await apiService.getGenerateComment(
              selectedFunc
            );
            console.log(responseDocs);

            responseDocs = responseDocs[selectedFunc[0].functionName!];
            responseDocs = `${responseDocs}${"\n"}`;

            if (responseDocs) {
              editor.edit((editBuilder) => {
                if (selectedFuncStartPos != null) {
                  let startPosition = cursorPosition.with(
                    selectedFuncStartPos - 1,
                    0
                  );
                  const currentLineText = document.lineAt(startPosition).text;
                  if (currentLineText) {
                    responseDocs = `${"\n"}${responseDocs}`;
                  }

                  console.log(startPosition);
                  editBuilder.insert(startPosition, responseDocs);
                }
              });
            }
          } catch (error) {
            console.log("Error", error);
            vscode.window.showErrorMessage(
              "Something went wrong try again",
              "Dismiss"
            );
          }
        } else {
          vscode.window.showInformationMessage("Function not found", "Dismiss");
        }
      }
    }
  }
);

const generateDocsCommand = {
  generateDocs,
};

export default generateDocsCommand;
