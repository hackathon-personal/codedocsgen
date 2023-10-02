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
        console.log("parsedFunctions", parsedFunctions);
        if (parsedFunctions.length > 0) {
          try {
            const generatedComments: FunctionDocsResponse =
              await apiService.getGenerateComment(parsedFunctions);
            console.log(generatedComments);

            if (
              generatedComments &&
              Object.keys(generatedComments).length > 0
            ) {
              for (let line of Object.keys(generatedComments)) {
                const lineNumber = parseInt(line);
                console.log("line", line);
                editor.edit((editBuilder) => {
                  let JSDoc = `${generatedComments[lineNumber]}\n`;

                  let startPosition = cursorPosition.with(
                    lineNumber > 0 ? lineNumber - 1 : lineNumber,
                    0
                  );
                  editBuilder.insert(startPosition, JSDoc);
                });
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
