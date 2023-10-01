import * as vscode from "vscode";
import apiService from "../service/apiService";
import tsParser from "../tsParser";

const generateDocs = vscode.commands.registerCommand(
  "codedocsgen.generateDocs",
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const lineCount = document.lineCount;
      const cursorPosition = editor.selection.active;

      let textFromCursorToEnd = document.getText();

      if (textFromCursorToEnd) {
        const parsedFunctions = tsParser.getFunction(textFromCursorToEnd);
        const parsedFunctionsArray = Array.from(parsedFunctions.values());
        let functionCodeToGenerateComment: string[] = [];

        for (const functionCode of parsedFunctionsArray) {
          const noOfLinesInFunction = functionCode.split("\n");

          let documentCode = "\n";
          for (
            let line = cursorPosition.line;
            line < cursorPosition.line + noOfLinesInFunction.length;
            line++
          ) {
            const lineText = document.lineAt(line).text;
            documentCode += lineText + "\n";
          }
          console.log("Document text", documentCode);
          console.log("Function code", functionCode);
          if (
            documentCode.includes(functionCode) ||
            functionCode.includes(documentCode)
          ) {
            console.log("Function found");
            functionCodeToGenerateComment.push(functionCode);
          }
        }

        console.log(functionCodeToGenerateComment);

        if (functionCodeToGenerateComment.length > 0) {
          try {
            let responseDocs = await apiService.getGenerateComment(
              functionCodeToGenerateComment[0]
            );
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

                editBuilder.insert(startPosition, responseDocs!);
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
