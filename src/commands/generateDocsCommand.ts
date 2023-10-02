import * as vscode from "vscode";
import apiService from "../service/apiService";
import tsParser from "../tsParser";
import {
  ACTIONS,
  COMMANDS,
  ERROR_MESSAGES,
} from "../constants/applicationConstants";

const generateDocs = vscode.commands.registerCommand(
  COMMANDS.GENERATE_DOCS_FOR_SELECTION,
  async () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const cursorPosition = editor.selection.active;

      // entire ts file text till end of the file
      let textFromCursorToEnd = document.getText();

      if (textFromCursorToEnd) {
        // parse the text to get the functions
        const parsedFunctions = tsParser.getFunction(textFromCursorToEnd);
        console.log("parsedFunctions", parsedFunctions);

        if (parsedFunctions.length > 0) {
          try {
            // function to generate the comments
            let selectedFunc = [];
            // selected function start line
            let selectedFuncStartPos: number | null = null;
            // loop through the parsed functions to find the selected function
            for (const functionDetails of parsedFunctions) {
              // get the start and end position of the function
              const [startPos, endPos]: any =
                functionDetails.functionName?.split("#");
              // check if the cursor position is within the function
              selectedFuncStartPos = parseInt(startPos);
              console.log(startPos, endPos, cursorPosition.line);
              // check if the cursor position is within the function
              if (
                parseInt(startPos) <= cursorPosition.line + 1 &&
                cursorPosition.line + 1 <= parseInt(endPos)
              ) {
                // if yes then add the function to the selected function array
                selectedFunc.push(functionDetails);
                break;
              }
            }
            console.log(selectedFunc);
            // check if the selected function is empty
            if (selectedFunc.length === 0) {
              // if yes then show the info message
              vscode.window.showInformationMessage(
                ERROR_MESSAGES.functionNotFound,
                ACTIONS.dismiss
              );
              return;
            }

            // get the response of JSDocs from the api
            let responseDocs = await apiService.getGenerateComment(
              selectedFunc
            );
            console.log(responseDocs);

            // get the function name from the selected function
            responseDocs = responseDocs[selectedFunc[0].functionName!];
            responseDocs = `${responseDocs}${"\n"}`;

            // insert the comments in the editor
            if (responseDocs) {
              editor.edit((editBuilder) => {
                if (selectedFuncStartPos !== null) {
                  // get the start position of the selected function
                  let startPosition = cursorPosition.with(
                    selectedFuncStartPos - 1,
                    0
                  );
                  const currentLineText = document.lineAt(startPosition).text;
                  if (currentLineText) {
                    responseDocs = `${"\n"}${responseDocs}`;
                  }

                  console.log(startPosition);
                  // insert the comments in the editor
                  editBuilder.insert(startPosition, responseDocs);
                }
              });
            }
          } catch (error) {
            console.log("Error", error);
            vscode.window.showErrorMessage(
              ERROR_MESSAGES.somethingWentWrong,
              ACTIONS.dismiss
            );
          }
        } else {
          vscode.window.showInformationMessage(
            ERROR_MESSAGES.functionNotFound,
            ACTIONS.dismiss
          );
        }
      }
    }
  }
);

const generateDocsCommand = {
  generateDocs,
};

export default generateDocsCommand;
