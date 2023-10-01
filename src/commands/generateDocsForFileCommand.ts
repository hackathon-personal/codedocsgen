import * as vscode from "vscode";
import tsParser from "../tsParser";
import apiService from "../service/apiService";
import { FunctionDocsResponse } from "../interface/IFunctionDocsResponse";

const generateDocsForFile = vscode.commands.registerCommand(
  "codedocsgen.generateDocsForFile",
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const documentText = document.getText();
      const cursorPosition = editor.selection.active;

      if (documentText) {
        const parsedFunctions = tsParser.getFunction(documentText);

        if (parsedFunctions.length > 0) {
          try {
            let responseDocs: FunctionDocsResponse[] =
              await apiService.getGenerateComment(parsedFunctions);
            console.log(responseDocs);

            for (const functions of parsedFunctions) {
              const noOfLinesInFunction = functions.functionCode.split("\n");

              let documentCode = "\n";
              for (
                let line = 0;
                line < document.lineCount + noOfLinesInFunction.length;
                line++
              ) {
                const lineText = document.lineAt(line).text;
                documentCode += lineText + "\n";
              }
              if (
                documentCode.includes(functions.functionCode) ||
                functions.functionCode.includes(documentCode)
              ) {
                responseDocs = responseDocs = `${responseDocs}${"\n"}`;

                if (responseDocs) {
                  editor.edit((editBuilder) => {
                    let positionAboveCursor = cursorPosition.with(
                      cursorPosition.line - 1 < 0 ? 0 : cursorPosition.line - 1,
                      0
                    );

                    const lineText = document.lineAt(positionAboveCursor).text;

                    if (lineText) {
                      responseDocs = `${"\n"}${responseDocs}`;
                    }

                    let startPosition = cursorPosition.with(
                      cursorPosition.line,
                      0
                    );
                    editBuilder.insert(startPosition, responseDocs);
                  });
                }
              }
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

const generateDocsForFileCommand = {
  generateDocsForFile,
};

export default generateDocsForFileCommand;
