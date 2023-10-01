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

      // Loop through lines from the cursor position to the end of the file
      // for (let line = cursorPosition.line; line < lineCount; line++) {
      //   // we should not read to end
      //   const lineText = document.lineAt(line).text;
      //   textFromCursorToEnd += lineText + "\n";
      // }



      if (textFromCursorToEnd) {
        const fn = tsParser.getFunction(textFromCursorToEnd);

        let i = 0
        let resultCode
        for (let line = cursorPosition.line; line < lineCount; line++) {
        resultCode =fn.values.filter((value:any)=>{
              return value.split('\n')[i] == document.lineAt(line).text
        })
        i++
        }

        

        console.log(resultCode)

        if (resultCode) {
          try {

            let responseDocs = await apiService.getGenerateComment(resultCode!);
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
