import * as vscode from "vscode";
import apiService from "../service/apiService";
import tsParser from "../tsParser";
import { FunctionDetails } from "../interface/IFunctionDetails";

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

        let functionCodeToGenerateComment: FunctionDetails[] = [];

        for (const functions of parsedFunctions) {
          const noOfLinesInFunction = functions.functionCode.split("\n");

          let documentCode = "\n";
          for (
            let line = cursorPosition.line;
            line < cursorPosition.line + noOfLinesInFunction.length;
            line++
          ) {
            const lineText = document.lineAt(line).text;
            documentCode += lineText + "\n";
          }
          if (
            documentCode.includes(functions.functionCode) ||
            functions.functionCode.includes(documentCode)
          ) {
            const selectedFunction = {
              functionCode: functions.functionCode,
              functionName: functions.functionName,
            };
            functionCodeToGenerateComment.push(selectedFunction);
          }
        }

        console.log(
          "functionCodeToGenerateComment",
          functionCodeToGenerateComment
        );

        if (functionCodeToGenerateComment.length > 0) {
          try {
            let responseDocs = await apiService.getGenerateComment(
              functionCodeToGenerateComment
            );
            console.log(responseDocs);

            responseDocs = Object.values(responseDocs)[0];
            responseDocs = `${responseDocs}${"\n"}`;

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

                let startPosition = cursorPosition.with(cursorPosition.line, 0);
                editBuilder.insert(startPosition, responseDocs);
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
